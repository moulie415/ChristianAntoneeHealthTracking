import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router';
import App from './App.tsx';
import './index.css';
import PainScale from './pages/PainScale.tsx';
import SleepScale from './pages/SleepScale.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
  },
  {
    path: '/pain-scale',
    Component: PainScale,
  },
  {
    path: '/sleep-scale',
    Component: SleepScale,
  },
  {
    path: '/stress-scale',
    Component: App,
  },
  {
    path: '/daily-habit-builder',
    Component: App,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
