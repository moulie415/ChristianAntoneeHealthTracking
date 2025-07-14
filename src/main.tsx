import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router';
import App from './App.tsx';
import './index.css';
import {DailyHabitBuilder} from './pages/DailyHabitBuilder.tsx';
import PainScale from './pages/PainScale.tsx';
import SleepScale from './pages/SleepScale.tsx';
import StressScale from './pages/StressScale.tsx';

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
    Component: StressScale,
  },
  {
    path: '/daily-habit-builder',
    Component: DailyHabitBuilder,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
