import {FirebaseError} from 'firebase/app';
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
} from 'firebase/auth';
import {useState} from 'react';
import {useForm, type SubmitHandler} from 'react-hook-form';
import {Link, useLocation, useNavigate} from 'react-router';
import {toast} from 'sonner';
import {auth} from '../App';
import {Button} from '../components/ui/button';
import {Input} from '../components/ui/input';
import {Label} from '../components/ui/label';
import {Spinner} from '../components/ui/spinner';

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

type Inputs = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async ({email, password}) => {
    try {
      setLoading(true);
      const {user} = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      if (!user.emailVerified) {
        await sendEmailVerification(user);
      }
      toast.success(
        `Sign-up successful!${user.emailVerified ? '' : ' Please check your email to verify your account.'}`,
      );
      navigate(from, {replace: true});
    } catch (e) {
      if (e instanceof FirebaseError) {
        toast.error(`Error: ${e.code}`);
      }
    }
    setLoading(false);
  };

  const googleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      navigate(from, {replace: true});
    } catch (e) {
      if (e instanceof FirebaseError) {
        toast.error(`Error: ${e.code}`);
      }
    }
    setLoading(false);
  };

  const facebookSignIn = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, facebookProvider);
      navigate(from, {replace: true});
    } catch (e) {
      if (e instanceof FirebaseError) {
        toast.error(`Error: ${e.code}`);
      }
    }
    setLoading(false);
  };

  const appleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, appleProvider);
      navigate(from, {replace: true});
    } catch (e) {
      if (e instanceof FirebaseError) {
        toast.error(`Error: ${e.code}`);
      }
    }
    setLoading(false);
  };

  const password = watch('password');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-sm space-y-6 m-5 sm:mx-auto">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Sign up with your email or use a social provider below.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
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
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              required
              {...register('confirmPassword', {
                validate: value =>
                  value === password || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
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

// --- ICONS ---

function AppleIcon(props: {className: string}) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor">
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
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor">
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
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
