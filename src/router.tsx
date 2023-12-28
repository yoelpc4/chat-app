import { FC, lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from '@/App.tsx'
import Auth from '@/middlewares/Auth.tsx'
import Guest from '@/middlewares/Guest.tsx'
import FullPageSpinner from '@/components/FullPageSpinner.tsx'

const lazyLoad = (factory: () => Promise<{ readonly default: FC<object> }>) => {
  const LazyExoticComponent = lazy(factory)

  return (
    <Suspense fallback={<FullPageSpinner />}>
      <LazyExoticComponent />
    </Suspense>
  )
}

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <Guest />,
        children: [
          {
            path: '/login',
            element: lazyLoad(() => import('@/pages/Login.tsx')),
          },
          {
            path: '/register',
            element: lazyLoad(() => import('@/pages/Register.tsx')),
          },
        ],
      },
      {
        element: <Auth />,
        children: [
          {
            path: '/',
            element: lazyLoad(() => import('@/pages/Chat.tsx')),
          },
        ],
      },
    ],
  },
])

export default router
