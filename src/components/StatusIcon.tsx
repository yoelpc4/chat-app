import { FC, HTMLProps } from 'react'
import { twMerge } from 'tailwind-merge'

interface StatusIconProps extends HTMLProps<HTMLElement> {
  isConnected: boolean
}

const StatusIcon: FC<StatusIconProps> = ({ isConnected, ...props }) => {
  return (
    <i
      className={twMerge(
        'mr-1 inline-block h-2 w-2 rounded-full',
        isConnected ? 'bg-online' : 'bg-offline'
      )}
      {...props}
    />
  )
}

export default StatusIcon
