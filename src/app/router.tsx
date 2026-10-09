import { createBrowserRouter, Navigate } from 'react-router-dom'
import AdminLayout from '../components/templates/AdminLayout'
import CustomerLayout from '../components/templates/CustomerLayout'
import PublicLayout from '../components/templates/PublicLayout'
import AdminTrainFormPage from '../pages/AdminTrainFormPage'
import AdminTrainsPage from '../pages/AdminTrainsPage'
import BookingConfirmationPage from '../pages/BookingConfirmationPage'
import BookingPage from '../pages/BookingPage'
import LoginPage from '../pages/LoginPage'
import MyBookingsPage from '../pages/MyBookingsPage'
import NotFoundPage from '../pages/NotFoundPage'
import PassengersPage from '../pages/PassengersPage'
import PaymentMethodsPage from '../pages/PaymentMethodsPage'
import ProfilePage from '../pages/ProfilePage'
import SearchTrainsPage from '../pages/SearchTrainsPage'
import SignupPage from '../pages/SignupPage'
import TrainResultsPage from '../pages/TrainResultsPage'
import PrivateRoute from '../routes/PrivateRoute'
import PublicRoute from '../routes/PublicRoute'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },

  // Guest-only pages
  {
    element: <PublicRoute />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/signup', element: <SignupPage /> },
        ],
      },
    ],
  },

  // Customer area
  {
    path: '/customer',
    element: <PrivateRoute role="CUSTOMER" />,
    children: [
      {
        element: <CustomerLayout />,
        children: [
          { index: true, element: <Navigate to="search" replace /> },
          { path: 'search', element: <SearchTrainsPage /> },
          { path: 'trains', element: <TrainResultsPage /> },
          { path: 'book/:trainId', element: <BookingPage /> },
          { path: 'booking-confirmation/:bookingId', element: <BookingConfirmationPage /> },
          { path: 'bookings', element: <MyBookingsPage /> },
          { path: 'passengers', element: <PassengersPage /> },
          { path: 'payment-methods', element: <PaymentMethodsPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
    ],
  },

  // Admin area
  {
    path: '/admin',
    element: <PrivateRoute role="ADMIN" />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="trains" replace /> },
          { path: 'trains', element: <AdminTrainsPage /> },
          { path: 'trains/new', element: <AdminTrainFormPage /> },
          { path: 'trains/:trainId/edit', element: <AdminTrainFormPage /> },
        ],
      },
    ],
  },

  { path: '*', element: <NotFoundPage /> },
])
