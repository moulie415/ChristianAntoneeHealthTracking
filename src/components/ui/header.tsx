import {Button} from '@/components/ui/button';
import {signOut} from 'firebase/auth';
import {LogIn, LogOut} from 'lucide-react';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router';
import {auth} from '../../App';
import logo from '../../assets/logo.png';
import {useAuth} from '../../context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const user = useAuth();
  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  const navigate = useNavigate();

  const onLogin = () => {
    navigate('/login');
  };

  const onLogout = async () => {
    setShowDialog(false);
    await signOut(auth);
  };
  return (
    <header className="w-full px-4 py-3 bg-white shadow-md flex justify-between items-center">
      {/* <h1 className="text-xl font-bold">🚀 My App</h1> */}
      <img src={logo} width={40} className="" />
      {isLoggedIn ? (
        <>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogDescription>
                  Are you sure you want to log out?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={onLogout}>
                  Logout
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <Button size="icon" onClick={onLogin}>
          <LogIn className="h-5 w-5" />
          <span className="sr-only">Login</span>
        </Button>
      )}
    </header>
  );
};

export default Header;
