import { FormEventHandler, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { StatusCodes } from 'http-status-codes'
import { setUser } from '@/store/auth.ts'
import useFormErrors from '@/hooks/useFormErrors.tsx'
import FormTitle from '@/components/FormTitle.tsx'
import TextField from '@/components/TextField.tsx'
import ButtonSubmit from '@/components/ButtonSubmit.tsx'
import AppLink from '@/components/AppLink.tsx'
import client from '@/utils/client.ts'
import { User } from '@/types'

export default function Login() {
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)

  const { formErrors, setFormErrors, handleFormErrors } = useFormErrors()

  const [inputs, setInputs] = useState({
    username: '',
    password: '',
  })

  const handleChange: FormEventHandler<HTMLInputElement> = (event) => {
    const target = event.target as HTMLInputElement

    setInputs((currentInputs) => ({
      ...currentInputs,
      [target.name]: target.value,
    }))
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    if (isLoading) {
      return
    }

    setIsLoading(true)

    try {
      const { accessToken, user } = await client
        .post<{
          accessToken: string
          user: User
        }>('/auth/login', inputs)
        .then(({ data }) => data)

      localStorage.setItem('accessToken', accessToken)

      dispatch(setUser(user))

      navigate('/')
    } catch (error) {
      if (error instanceof AxiosError) {
        handleFormErrors(error)

        if (error.response?.status === StatusCodes.UNAUTHORIZED) {
          setFormErrors({
            username: "These credentials doesn't match our records",
          })
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <form
        id='form-login'
        className='flex w-[300px] flex-col items-start justify-center gap-4 rounded-lg border-2 border-gray-200 p-4'
        onSubmit={handleSubmit}
      >
        <FormTitle>Login</FormTitle>
        <TextField
          type='text'
          id='username'
          name='username'
          label='Username'
          required
          value={inputs.username}
          error={formErrors.username}
          onChange={handleChange}
        />
        <TextField
          type='password'
          id='password'
          name='password'
          label='Password'
          required
          value={inputs.password}
          error={formErrors.password}
          onChange={handleChange}
        />
        <div className='flex w-full flex-col items-center justify-center gap-2'>
          <ButtonSubmit form='form-login' disabled={isLoading}>
            Login
          </ButtonSubmit>
          <AppLink to='/register'>Create a new account</AppLink>
        </div>
      </form>
    </div>
  )
}
