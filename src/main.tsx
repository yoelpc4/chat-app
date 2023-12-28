import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import store from '@/store'
import { setUser } from '@/store/auth.ts'
import router from '@/router.tsx'
import client from '@/utils/client.ts'
import { User } from '@/types'
import '@/index.css'

try {
  client.defaults.headers.common['x-csrf-token'] = await client
    .get<{ csrfToken: string }>('/csrf-token')
    .then(({ data }) => data.csrfToken)

  const user = await client.get<User>('/auth/user').then(({ data }) => data)

  store.dispatch(setUser(user))
} catch {
  // no-op
} finally {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>
  )
}
