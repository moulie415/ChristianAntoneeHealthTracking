import {FirebaseError} from 'firebase/app';
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import {useState} from 'react';
import {useForm, type SubmitHandler} from 'react-hook-form';
import {Link, useLocation, useNavigate} from 'react-router';
import {
  AppleLoginButton,
  FacebookLoginButton,
  GoogleLoginButton,
} from 'react-social-login-buttons';
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
};

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/';

  const [loading, setLoading] = useState(false);

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

  const {register, handleSubmit} = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async ({email, password}) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);

      navigate(from, {replace: true});
    } catch (e) {
      if (e instanceof FirebaseError) {
        toast.error(`Error: ${e.code}`);
      }
    }
    setLoading(false);
  };

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
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your email below to login to your CA Health account
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
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
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-1">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </form>
      <div className="space-y-2">
        <p className="text-center text-gray-500 dark:text-gray-400">Or</p>

        <GoogleLoginButton
          style={{marginBottom: 15}}
          text="Continue with Google"
          onClick={googleSignIn}
        />
        <AppleLoginButton
          style={{marginBottom: 15}}
          text="Continue with Apple"
          onClick={appleSignIn}
        />
        <FacebookLoginButton
          style={{marginBottom: 15}}
          text="Continue with Facebook"
          onClick={facebookSignIn}
        />
      </div>
    </div>
  );
}
