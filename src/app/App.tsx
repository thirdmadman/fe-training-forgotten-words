import { createHashRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';

import 'normalize.css';
import './scss/style.scss';
import routes from './routes';
import { store } from './store';
import { saveState } from './services/local-storage-service';

const router = createHashRouter([routes]);
store.subscribe(() => saveState(store.getState()));

export default function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}
