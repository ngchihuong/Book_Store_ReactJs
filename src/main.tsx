import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from '@/layout'
import "./styles/global.scss"

//006 layout
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AboutPage from 'pages/client/About';
import Login from './pages/client/auth/login.tsx';
import Register from './pages/client/auth/register.tsx';
import BookPage from 'pages/client/Book.tsx';
import HomePage from './pages/client/home.tsx';
import { App } from 'antd';
import { AppProvider } from 'components/context/app.context';
import ProtectedRoute from '@/components/auth';

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
        path: "/book",
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
        path: "/checkout",
        element: (
          <ProtectedRoute>
            checkout
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            admin
          </ProtectedRoute>
        ),
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
        <RouterProvider router={router} />
      </AppProvider>
    </App>
  </StrictMode>,
)
