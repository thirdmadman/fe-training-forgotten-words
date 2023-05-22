import { Outlet } from 'react-router-dom';
import Menu from '../components/menu/Menu';

export function Layout() {
  return (
    <>
      <Menu />
      <Outlet />
    </>
  );
}
