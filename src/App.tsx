import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {initializeApp} from 'firebase/app';
import {initializeAppCheck, ReCaptchaV3Provider} from 'firebase/app-check';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getFunctions} from 'firebase/functions';
import {useEffect} from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router';
import {Toaster} from 'sonner';
import Layout from './components/Layout';
import RedirectIfAuthenticated from './components/RedirectIfAuthenticated';
import {RequireAuth} from './components/RequireAuth';
import {AuthProvider} from './context/AuthContext';
import {firebaseConfig} from './FIREBASE_CONFIG';
import {DailyHabitBuilder} from './pages/DailyHabitBuilder';
import Home from './pages/Home';
import Login from './pages/Login';
import PainScale from './pages/PainScale';
import Signup from './pages/SignUp';
import SleepScale from './pages/SleepScale';
import StressScale from './pages/StressScale';

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
        path: 'signup',
        element: (
          <RedirectIfAuthenticated>
            <Signup />
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
export const functions = getFunctions(app);
export const db = getFirestore(app);

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

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
