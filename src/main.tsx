import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from '@/layout'
import "styles/global.scss"
//006 layout
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AboutPage from 'pages/client/About';
import Login from '@/pages/client/auth/login.tsx';
import Register from './pages/client/auth/register.tsx';
import BookPage from 'pages/client/Book.tsx';
import HomePage from './pages/client/home.tsx';
import { App, ConfigProvider } from 'antd';
import { AppProvider } from 'components/context/app.context';
import ProtectedRoute from '@/components/auth';
import LayoutAdmin from './components/layouts/layout.admin.tsx';
import DashBoardPage from './pages/admin/dashboard.tsx';
import ManageBookPage from './pages/admin/manage.book.tsx';
import ManageUserPage from './pages/admin/manage.user.tsx';
import enUS from 'antd/locale/en_US';
import OrderPage from './pages/client/order.tsx';
import HistoryPage from '@/pages/client/history.tsx';
import ManageOrderPage from './pages/admin/manage.order.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout />
    ),
    children: [
      {
        index: true, //if not 
        element: (
          <HomePage />
        )
      },
      {
        path: "/book/:id",
        element: (
          <BookPage />
        ),
      },
      {
        path: "/about",
        element: (
          <AboutPage />
        ),
      },
      {
        path: "/order",
        element: (
          <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            checkout
          </ProtectedRoute>
        ),
      },
      {
        path: "/history",
        element: (
          <ProtectedRoute>
            <HistoryPage/>
          </ProtectedRoute>
        ),
      },
    ]
  },
  {
    path: "/admin",
    element: (
      <LayoutAdmin />
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <DashBoardPage />
          </ProtectedRoute>
        )
      },
      {
        path: "book",
        element: (
          <ProtectedRoute>
            <ManageBookPage />
          </ProtectedRoute>
        )
      },
      {
        path: "order",
        element: (
          <ProtectedRoute>
            <ManageOrderPage />
          </ProtectedRoute>
        )
      },
      {
        path: "user",
        element: (
          <ProtectedRoute>
            <ManageUserPage />
          </ProtectedRoute>
        )
      },
    ]
  },
  {
    path: "/login",
    element: (
      <Login />
    ),
  },
  {
    path: "/register",
    element: (
      <Register />
    ),
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App>
      <AppProvider>
        <ConfigProvider locale={enUS}>
          <RouterProvider router={router} />
        </ConfigProvider>
      </AppProvider>
    </App>
  </StrictMode>,
)
