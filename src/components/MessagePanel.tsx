import { FC, FormEventHandler, HTMLProps, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import StatusIcon from '@/components/StatusIcon.tsx'
import { User } from '@/types'

interface MessagePanelProps extends HTMLProps<HTMLDivElement> {
  user: User
  onSendMessage: (body: string) => void
}

const MessagePanel: FC<MessagePanelProps> = ({
  user,
  onSendMessage,
  ...props
}) => {
  const [body, setBody] = useState('')

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    onSendMessage(body)

    setBody('')
  }

  return (
    <div className='relative w-full' {...props}>
      <div className='fixed top-0 w-full border-b border-gray-200 bg-white px-5 py-2.5 leading-10'>
        <StatusIcon isConnected={user.isConnected} /> {user.username}
      </div>
      <ul className='mx-0 px-5 pb-[120px] pt-[80px]'>
        {user.messages?.map((message, index) => (
          <li
            key={index}
            className={twMerge(
              'list-none',
              message.isFromSelf ? 'text-right' : 'text-left'
            )}
          >
            <div className='fw-bold mt-1'>
              {message.isFromSelf ? '(You)' : user.username}
            </div>
            {message.body}
          </li>
        ))}
      </ul>
      <form
        id='form-send-message'
        className='fixed bottom-0 right-0 flex h-[100px] w-[calc(100vw-16rem)] items-center justify-between gap-x-4 border-t border-gray-200 bg-white p-5'
        onSubmit={handleSubmit}
      >
        <textarea
          name='body'
          placeholder='Type your message...'
          className='w-full resize-none rounded border-2 border-gray-200 p-2 leading-normal'
          value={body}
          required
          onInput={(event) => setBody(event.currentTarget.value)}
        />
        <button
          type='submit'
          form='form-send-message'
          disabled={!body.length}
          className='w-20 rounded bg-blue-500 p-2 text-white'
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default MessagePanel
