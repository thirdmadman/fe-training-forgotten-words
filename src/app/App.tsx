import { createHashRouter, RouterProvider } from 'react-router-dom';
import 'normalize.css';
import './scss/style.scss';
import routes from './routes';

const router = createHashRouter([routes]);

export default function App() {
  return <RouterProvider router={router} />;
}
