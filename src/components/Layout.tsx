import {Outlet} from 'react-router';
import Header from './ui/header';

export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
