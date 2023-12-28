export interface User {
  _id: string
  username: string
  isConnected: boolean
  isSelf: boolean
  hasNewMessages: boolean
  createdAt: string
  updatedAt: string
  messages: Message[]
}

export interface Message {
  _id?: string
  from: string
  to: string
  body: string
  clientOffset: string
  isFromSelf: boolean
  createdAt?: string
  updatedAt?: string
}
