import { useCallback, useState } from 'react'
import { AxiosError } from 'axios'
import { StatusCodes } from 'http-status-codes'

export default function useFormErrors(
  initialState: Record<string, string> | (() => Record<string, string>) = {}
) {
  const [formErrors, setFormErrors] =
    useState<Record<string, string>>(initialState)

  const handleFormErrors = useCallback((error: unknown) => {
    if (error instanceof AxiosError) {
      if (error.response?.status === StatusCodes.BAD_REQUEST) {
        setFormErrors(error.response.data.errors)
      }
    }
  }, [])

  return {
    formErrors,
    setFormErrors,
    handleFormErrors,
  }
}
