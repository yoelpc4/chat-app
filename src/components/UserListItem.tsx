import { FC, HTMLProps } from 'react'
import { twMerge } from 'tailwind-merge'
import StatusIcon from '@/components/StatusIcon.tsx'
import { User } from '@/types'

interface UserListItemProps extends HTMLProps<HTMLDivElement> {
  user: User
  isSelected: boolean
  onSelectUser: () => void
}

const UserListItem: FC<UserListItemProps> = ({
  user,
  isSelected,
  onSelectUser,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        'flex items-center justify-between p-2.5',
        isSelected && 'bg-primary'
      )}
      onClick={onSelectUser}
      {...props}
    >
      <div className='inline-block'>
        <div>
          {user.username} {user.isSelf ? ' (You)' : ''}
        </div>
        <div className='text-tertiary'>
          <StatusIcon isConnected={user.isConnected} />{' '}
          {user.isConnected ? 'online' : 'offline'}
        </div>
      </div>
      {user.hasNewMessages && (
        <div className='mt-2.5 w-5 rounded-sm bg-red-500 text-center text-white'>
          !
        </div>
      )}
    </div>
  )
}

export default UserListItem
