import { FC, RefAttributes } from 'react'
import { Link, LinkProps } from 'react-router-dom'

const AppLink: FC<LinkProps & RefAttributes<HTMLAnchorElement>> = (props) => {
  return <Link className='text-blue-500 hover:underline' {...props} />
}

export default AppLink
