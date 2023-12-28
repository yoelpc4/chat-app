import { FC, HTMLProps } from 'react'
import { twMerge } from 'tailwind-merge'

interface TextFieldProps extends HTMLProps<HTMLInputElement> {
  id: string
  name: string
  label?: string
  error?: string
}

const TextField: FC<TextFieldProps> = ({
  label,
  id,
  name,
  error,
  ...props
}) => {
  return (
    <div className='flex w-full flex-col gap-2'>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type='text'
        id={id}
        name={name}
        className={twMerge(
          'rounded border-2 p-2',
          error ? 'border-red-500' : 'border-gray-200'
        )}
        {...props}
      />
      {error && <span className='text-xs text-red-500'>{error}</span>}
    </div>
  )
}

export default TextField
