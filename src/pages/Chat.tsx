import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { twMerge } from 'tailwind-merge'
import { selectUser, unsetUser } from '@/store/auth.ts'
import UserListItem from '@/components/UserListItem.tsx'
import MessagePanel from '@/components/MessagePanel.tsx'
import socket from '@/utils/websocket.ts'
import client from '@/utils/client.ts'
import { Message, User } from '@/types'

export default function Chat() {
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const authUser = useSelector(selectUser)!

  const [socketId, setSocketId] = useState<string | null>(null)

  const [users, setUsers] = useState<User[]>([])

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const [counter, setCounter] = useState(0)

  const [isConnected, setIsConnected] = useState(false)

  const selectedUser = users.find((user) => user._id === selectedUserId)

  const handleSelectUser = (userId: string) => {
    setUsers((currentUsers) =>
      currentUsers.map((currentUser) => {
        if (currentUser._id === userId) {
          return {
            ...currentUser,
            hasNewMessages: false,
          }
        }

        return currentUser
      })
    )

    setSelectedUserId(userId)

    socket.emit('fetch_private_messages', userId)
  }

  const handleSendMessage = (body: string) => {
    if (!selectedUserId) {
      return
    }

    const clientOffset = `${socketId}-${counter}`

    setUsers((currentUsers) =>
      currentUsers.map((currentUser) => {
        if (currentUser._id === selectedUserId) {
          return {
            ...currentUser,
            messages: currentUser.messages.concat({
              from: authUser._id,
              to: selectedUserId,
              body,
              clientOffset,
              isFromSelf: true,
            }),
          }
        }

        return currentUser
      })
    )

    setCounter((currentCounter) => currentCounter + 1)

    socket.emit('send_private_message', {
      to: selectedUserId,
      body,
      clientOffset,
    })
  }

  const toggleConnection = () => {
    setIsConnected(!isConnected)

    isConnected ? socket.disconnect() : socket.connect()
  }

  const handleLogout = async () => {
    socket.disconnect()

    await client.post('/auth/logout')

    dispatch(unsetUser())

    navigate('/login')
  }

  useEffect(() => {
    const handleConnect = () => {
      setSocketId(socket.id)

      setIsConnected(true)

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) => {
          if (currentUser.isSelf) {
            return {
              ...currentUser,
              isConnected: true,
            }
          }

          return currentUser
        })
      )
    }

    socket.on('connect', handleConnect)

    const handleConnectError = async (error: Error) => {
      console.error(error)

      if (error.message === 'Unauthorized') {
        try {
          await client.post('auth/refresh')

          setTimeout(() => {
            socket.connect()
          }, 1000)
        } catch {
          // no-op
        }
      } else {
        alert('An error occurred while connecting to the websocket')
      }
    }

    socket.on('connect_error', handleConnectError)

    const handleDisconnect = () => {
      setIsConnected(false)

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) => {
          if (currentUser.isSelf) {
            return {
              ...currentUser,
              isConnected: false,
            }
          }

          return currentUser
        })
      )

      // attach last disconnect to properly recover state on reconnection
      socket.auth = {
        ...socket.auth,
        disconnectedAt: new Date().toISOString(),
      }
    }

    socket.on('disconnect', handleDisconnect)

    const handleUsersFetched = (fetchedUsers: User[]) => {
      setUsers((currentUsers) =>
        fetchedUsers
          .map((fetchedUser) => {
            const user = currentUsers.find(
              (currentUser) => currentUser._id === fetchedUser._id
            )

            if (!user) {
              // add client properties to the fetched user
              return {
                ...fetchedUser,
                isSelf: fetchedUser._id === authUser._id,
                hasNewMessages: false,
              }
            }

            // merge existing user with fetched user
            return {
              ...user,
              ...fetchedUser,
            }
          })
          // sort by socket user, then sort by username
          .sort((a, b) => {
            if (a.isSelf) return -1
            if (b.isSelf) return 1
            if (a.username < b.username) return -1
            return a.username > b.username ? 1 : 0
          })
      )
    }

    socket.on('users_fetched', handleUsersFetched)

    const handleUserConnected = (connectedUser: User) => {
      setUsers((currentUsers) => {
        const isConnectedUserExists = currentUsers.some(
          (currentUser) => currentUser._id === connectedUser._id
        )

        if (!isConnectedUserExists) {
          // insert new connected user with client property
          return currentUsers.concat({
            ...connectedUser,
            hasNewMessages: false,
          })
        }

        // update existing connected user
        return currentUsers.map((currentUser) => {
          if (currentUser._id === connectedUser._id) {
            return {
              ...currentUser,
              isConnected: true,
            }
          }

          return currentUser
        })
      })
    }

    socket.on('user_connected', handleUserConnected)

    const handleUserDisconnected = (disconnectedUserId: string) => {
      setUsers((currentUsers) =>
        currentUsers.map((currentUser) => {
          if (currentUser._id === disconnectedUserId) {
            return {
              ...currentUser,
              isConnected: false,
            }
          }

          return currentUser
        })
      )
    }

    socket.on('user_disconnected', handleUserDisconnected)

    const handlePrivateMessagesFetched = (
      userId: string,
      messages: Message[]
    ) => {
      setUsers((currentUsers) =>
        currentUsers.map((currentUser) => {
          if (currentUser._id === userId) {
            return {
              ...currentUser,
              messages: messages.map((message) => ({
                ...message,
                isFromSelf: message.from === authUser._id,
              })),
            }
          }

          return currentUser
        })
      )
    }

    socket.on('private_messages_fetched', handlePrivateMessagesFetched)

    socket.connect()

    return () => {
      socket
        .off('connect', handleConnect)
        .off('connect_error', handleConnectError)
        .off('disconnect', handleDisconnect)
        .off('users_fetched', handleUsersFetched)
        .off('user_connected', handleUserConnected)
        .off('user_disconnected', handleUserDisconnected)
        .off('private_messages_fetched', handlePrivateMessagesFetched)
        .disconnect()
    }
  }, [navigate, authUser])

  useEffect(() => {
    const handlePrivateMessageSent = (message: Message) => {
      const isFromSelf = message.from === authUser._id

      const otherUserId = isFromSelf ? message.to : message.from

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) => {
          if (currentUser._id === otherUserId) {
            const messages = currentUser.messages
              ? [...currentUser.messages]
              : []

            if (
              messages.length &&
              messages[messages.length - 1].clientOffset ===
                message.clientOffset
            ) {
              messages[messages.length - 1] = {
                ...message,
                isFromSelf,
              }
            } else if (message.from !== message.to) {
              messages.push({
                ...message,
                isFromSelf,
              })
            }

            return {
              ...currentUser,
              hasNewMessages: !isFromSelf && currentUser._id !== selectedUserId,
              messages,
            }
          }

          return currentUser
        })
      )
    }

    socket.on('private_message_sent', handlePrivateMessageSent)

    return () => {
      socket.off('private_message_sent', handlePrivateMessageSent)
    }
  }, [authUser, selectedUserId])

  return (
    <div className='min-h-screen'>
      <button
        className='fixed right-3 top-3 z-10 w-24 rounded bg-gray-500 p-2 text-white'
        onClick={handleLogout}
      >
        Logout
      </button>
      <section className='fixed bottom-0 left-0 top-0 w-64 overflow-x-hidden bg-secondary p-2 text-white'>
        {users.map((user) => (
          <UserListItem
            key={user._id}
            user={user}
            isSelected={selectedUserId === user._id}
            onSelectUser={() => handleSelectUser(user._id)}
          />
        ))}
      </section>
      <section className='ml-64'>
        {selectedUser && (
          <MessagePanel user={selectedUser} onSendMessage={handleSendMessage} />
        )}
      </section>
      <button
        className={twMerge(
          'fixed bottom-3 left-3 w-24 rounded p-2 text-white',
          isConnected ? 'bg-offline' : 'bg-online'
        )}
        onClick={toggleConnection}
      >
        {isConnected ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  )
}
