import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router';
import {useAuth} from '../context/AuthContext';

export default function RedirectIfAuthenticated({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/', {replace: true});
    } else {
      setLoading(false);
    }
  }, [navigate, user]);

  if (loading) return null;

  return <>{children}</>;
}
