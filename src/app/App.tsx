import { createHashRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';

import 'normalize.css';
import './scss/style.scss';
import routes from './routes';
import { store } from './store';

const router = createHashRouter([routes]);

export default function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}
