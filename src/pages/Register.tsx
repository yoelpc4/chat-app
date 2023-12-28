import { FormEventHandler, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setUser } from '@/store/auth.ts'
import useFormErrors from '@/hooks/useFormErrors.tsx'
import TextField from '@/components/TextField.tsx'
import FormTitle from '@/components/FormTitle.tsx'
import AppLink from '@/components/AppLink.tsx'
import ButtonSubmit from '@/components/ButtonSubmit.tsx'
import client from '@/utils/client.ts'
import { User } from '@/types'

export default function Register() {
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)

  const { formErrors, handleFormErrors } = useFormErrors()

  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    passwordConfirmation: '',
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
        .post<{ accessToken: string; user: User }>('/auth/register', inputs)
        .then(({ data }) => data)

      localStorage.setItem('accessToken', accessToken)

      dispatch(setUser(user))

      navigate('/')
    } catch (error) {
      handleFormErrors(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <form
        id='form-register'
        className='flex w-[300px] flex-col items-start justify-center gap-4 rounded-lg border-2 border-gray-200 p-4'
        onSubmit={handleSubmit}
      >
        <FormTitle>Register</FormTitle>
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
        <TextField
          type='password'
          id='passwordConfirmation'
          name='passwordConfirmation'
          label='Password Confirmation'
          required
          value={inputs.passwordConfirmation}
          error={formErrors.passwordConfirmation}
          onChange={handleChange}
        />
        <div className='flex w-full flex-col items-center justify-center gap-2'>
          <ButtonSubmit form='form-register' disabled={isLoading}>
            Register
          </ButtonSubmit>
          <AppLink to='/login'>I have an account</AppLink>
        </div>
      </form>
    </div>
  )
}
