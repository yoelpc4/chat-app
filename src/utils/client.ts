import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import nprogress from 'nprogress'
import { StatusCodes } from 'http-status-codes'
import store from '@/store'
import { unsetUser } from '@/store/auth.ts'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true,
  xsrfCookieName: undefined,
  xsrfHeaderName: undefined,
})

const fulfillRequest = (config: InternalAxiosRequestConfig) => {
  if (nprogress.isStarted()) {
    nprogress.inc()
  } else {
    nprogress.start()
  }

  return config
}

const rejectRequest = (error: AxiosError) => {
  nprogress.done()

  return Promise.reject(error)
}

const fulfillResponse = (response: AxiosResponse) => {
  nprogress.done()

  return response
}

const rejectResponse = async (error: AxiosError) => {
  nprogress.done()

  const { config, response } = error

  const isRetryable = config && (!config.retry || config.retry < 2)

  if (response && isRetryable) {
    config.retry = (config.retry ?? 0) + 1

    if (response.status === StatusCodes.UNAUTHORIZED) {
      if (config.url === 'auth/refresh') {
        store.dispatch(unsetUser())

        return Promise.reject(error)
      }

      try {
        await client.post('auth/refresh', null, {
          retry: config.retry,
        })

        return client(config)
      } catch {
        // no-op
      }
    } else if (response.status === StatusCodes.FORBIDDEN) {
      try {
        const csrfToken = await client
          .get<{ csrfToken: string }>('/csrf-token', {
            retry: config.retry,
          })
          .then(({ data }) => data.csrfToken)

        client.defaults.headers.common['x-csrf-token'] = config.headers[
          'x-csrf-token'
        ] = csrfToken

        return client(config)
      } catch {
        // no-op
      }
    }
  }

  return Promise.reject(error)
}

client.interceptors.request.use(fulfillRequest, rejectRequest)

client.interceptors.response.use(fulfillResponse, rejectResponse)

export default client
