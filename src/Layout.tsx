import {Outlet} from 'react-router';
import Header from './components/ui/header';

export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
