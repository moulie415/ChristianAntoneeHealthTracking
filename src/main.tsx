import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: '/pain-scale',
    Component: App
  },
    {
    path: '/sleep-scale',
    Component: App
  },
    {
    path: '/stress-scale',
    Component: App
  },
    {
    path: '/daily-habit-builder',
    Component: App
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
