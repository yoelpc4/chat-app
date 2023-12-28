import client from '@/utils/client.ts'
import { io, Socket } from 'socket.io-client'
import { ServerToClientEvents } from '@/types/ServerToClientEvents.ts'
import { ClientToServerEvents } from '@/types/ClientToServerEvents.ts'

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.VITE_API_URL,
  {
    autoConnect: false,
    ackTimeout: 10_000,
    extraHeaders: {
      'x-csrf-token':
        client.defaults.headers.common['x-csrf-token']!.toString(),
    },
    path: import.meta.env.VITE_WEBSOCKET_PATH,
    retries: 3,
    withCredentials: true,
  }
)

if (import.meta.env.DEV) {
  socket.onAny((event, ...args) => {
    console.log(event, args)
  })

  socket.onAnyOutgoing((event, ...args) => {
    console.log(event, args)
  })
}

export default socket
