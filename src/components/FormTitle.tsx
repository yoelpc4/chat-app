import { FC, HTMLProps } from 'react'

const FormTitle: FC<HTMLProps<HTMLHeadingElement>> = (props) => {
  return (
    <h1 className='mb-4 w-full text-center text-2xl font-bold' {...props} />
  )
}

export default FormTitle
