import { DefaultEventsMap } from '@socket.io/component-emitter'
import { Message, User } from '@/types'

export interface ServerToClientEvents extends DefaultEventsMap {
  users_fetched: (fetchedUsers: User[]) => void
  user_connected: (connectedUser: User) => void
  user_disconnected: (disconnectedUserId: string) => void
  private_messages_fetched: (userId: string, messages: Message[]) => void
  private_message_sent: (message: Message) => void
}
