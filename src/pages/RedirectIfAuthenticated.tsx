import {onAuthStateChanged} from 'firebase/auth';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router';
import {auth} from '../App';

export default function RedirectIfAuthenticated({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        navigate('/', {replace: true});
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) return null;

  return <>{children}</>;
}
