import { DefaultEventsMap } from '@socket.io/component-emitter'
import { Message } from '@/types'

export interface ClientToServerEvents extends DefaultEventsMap {
  fetch_private_messages: (userId: string) => void
  send_private_message: (
    message: Pick<Message, 'to' | 'body' | 'clientOffset'>
  ) => void
}
