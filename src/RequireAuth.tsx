import {onAuthStateChanged, type User} from 'firebase/auth';
import {useEffect, useState, type ReactNode} from 'react';
import {Navigate, useLocation} from 'react-router';
import {auth} from './App';
import {Spinner} from './components/ui/spinner';

interface RequireAuthProps {
  children: ReactNode;
}

export function RequireAuth({children}: RequireAuthProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  console.log(user);

  if (!user) {
    // Save the current location so we can redirect back after login
    return <Navigate to="/login" state={{from: location}} replace />;
  }

  return <>{children}</>;
}
