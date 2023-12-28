import { ComponentProps, FC } from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonSubmit extends ComponentProps<'button'> {
  form: string
  disabled?: boolean
}

const ButtonSubmit: FC<ButtonSubmit> = ({
  form,
  disabled = false,
  ...props
}) => {
  return (
    <button
      type='submit'
      form={form}
      disabled={disabled}
      className={twMerge(
        'w-20 rounded p-2 text-white',
        disabled ? 'bg-gray-200' : 'bg-blue-500'
      )}
      {...props}
    />
  )
}

export default ButtonSubmit
