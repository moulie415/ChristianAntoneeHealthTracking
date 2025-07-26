import {initializeApp} from 'firebase/app';
import {initializeAppCheck, ReCaptchaV3Provider} from 'firebase/app-check';
import {getAuth} from 'firebase/auth';
import {useEffect} from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router';
import {Toaster} from 'sonner';
import {firebaseConfig} from './FIREBASE_CONFIG';
import Layout from './Layout';
import {DailyHabitBuilder} from './pages/DailyHabitBuilder';
import Home from './pages/Home';
import Login from './pages/Login';
import PainScale from './pages/PainScale';
import RedirectIfAuthenticated from './pages/RedirectIfAuthenticated';
import SleepScale from './pages/SleepScale';
import StressScale from './pages/StressScale';
import {RequireAuth} from './RequireAuth';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: (
          <RedirectIfAuthenticated>
            <Login />
          </RedirectIfAuthenticated>
        ),
      },
      {
        path: 'pain-scale',
        element: (
          <RequireAuth>
            <PainScale />
          </RequireAuth>
        ),
      },
      {
        path: 'sleep-scale',
        element: (
          <RequireAuth>
            <SleepScale />
          </RequireAuth>
        ),
      },
      {
        path: 'stress-scale',
        element: (
          <RequireAuth>
            <StressScale />
          </RequireAuth>
        ),
      },
      {
        path: 'daily-habit-builder',
        element: (
          <RequireAuth>
            <DailyHabitBuilder />
          </RequireAuth>
        ),
      },
    ],
  },
]);

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

function App() {
  useEffect(() => {
    // @ts-expect-error for dev purposes
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.MODE === 'development';
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(
        import.meta.env.VITE_RECAPTCHA_SITE_KEY,
      ),

      // Optional argument. If true, the SDK automatically refreshes App Check
      // tokens as needed.
      isTokenAutoRefreshEnabled: true,
    });
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
