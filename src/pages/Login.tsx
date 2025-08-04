import {FirebaseError} from 'firebase/app';
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import {useForm, type SubmitHandler} from 'react-hook-form';
import {useLocation, useNavigate} from 'react-router';
import {toast} from 'sonner';
import {auth} from '../App';
import {Button} from '../components/ui/button';
import {Input} from '../components/ui/input';
import {Label} from '../components/ui/label';

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

type Inputs = {
  email: string;
  password: string;
};

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/';

  const googleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate(from, {replace: true});
    } catch (e) {
      if (e instanceof FirebaseError) {
        toast.error(`Error: ${e.code}`);
      }
    }
  };

  const facebookSignIn = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      navigate(from, {replace: true});
    } catch (e) {
      if (e instanceof FirebaseError) {
        toast.error(`Error: ${e.code}`);
      }
    }
  };

  const appleSignIn = async () => {
    try {
      await signInWithPopup(auth, appleProvider);
      navigate(from, {replace: true});
    } catch (e) {
      if (e instanceof FirebaseError) {
        toast.error(`Error: ${e.code}`);
      }
    }
  };

  const {register, handleSubmit} = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async ({email, password}) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      if (e instanceof FirebaseError) {
        toast.error(`Error: ${e.code}`);
      }
    }
  };
  return (
    <div className="max-w-sm space-y-6 m-5 sm:mx-auto">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your email or username below to login to your CA Health account
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email or Username</Label>
            <Input
              id="email"
              type="text"
              placeholder="m@example.com"
              required
              {...register('email')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              {...register('password')}
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </div>
      </form>
      <div className="space-y-2">
        <p className="text-center text-gray-500 dark:text-gray-400">
          Or continue with
        </p>
        <div className="grid grid-cols-3 gap-2">
          <Button onClick={googleSignIn} variant="outline" className="w-full">
            <ChromeIcon className="h-5 w-5 mr-2" />
            Google
          </Button>
          <Button onClick={appleSignIn} variant="outline" className="w-full">
            <AppleIcon className="h-5 w-5 mr-2" />
            Apple
          </Button>
          <Button onClick={facebookSignIn} variant="outline" className="w-full">
            <FacebookIcon className="h-5 w-5 mr-2" />
            Facebook
          </Button>
        </div>
      </div>
    </div>
  );
}

function AppleIcon(props: {className: string}) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
      <path d="M10 2c1 .5 2 2 2 5" />
    </svg>
  );
}

function ChromeIcon(props: {className: string}) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  );
}

function FacebookIcon(props: {className: string}) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
