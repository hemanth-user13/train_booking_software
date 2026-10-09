import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import ToastProvider from '../components/organisms/ToastProvider'
import { router } from './router'
import { store } from './store'

export default function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </Provider>
  )
}
