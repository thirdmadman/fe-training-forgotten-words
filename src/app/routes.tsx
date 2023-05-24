import { Navigate, RouteObject } from 'react-router-dom';
import { GlobalConstants } from '../GlobalConstants';
import WordBook from './pages/wordBook/WordBook';
import { AuthorizationPage } from './pages/auth/AuthorizationPage';
import { SprintPage } from './pages/sprint/SprintPage';
import { AudiocallPage } from './pages/audiocall/AudiocallPage';
import { DiaryPage } from './pages/diary/DiaryPage';
import { Layout } from './pages/Layout';
import { ConfigsPage } from './pages/configs/ConfigsPage';

const routes: RouteObject = {
  element: <Layout />,
  children: [
    {
      path: GlobalConstants.ROUTE_MAIN,

      element: <Navigate to={GlobalConstants.ROUTE_WORDBOOK} />,
    },
    {
      path: GlobalConstants.ROUTE_WORDBOOK,
      element: <WordBook />,
    },
    {
      path: `${GlobalConstants.ROUTE_WORDBOOK}/:level/:page`,

      element: <WordBook />,
    },
    {
      path: GlobalConstants.ROUTE_AUDIOCALL,

      element: <AudiocallPage />,
    },
    {
      path: GlobalConstants.ROUTE_SPRINT,

      element: <SprintPage />,
    },
    {
      path: GlobalConstants.ROUTE_AUTH,

      element: <AuthorizationPage />,
    },
    {
      path: GlobalConstants.ROUTE_DIARY,

      element: <DiaryPage />,
    },
    {
      path: `${GlobalConstants.ROUTE_DIARY}/:page`,

      element: <DiaryPage />,
    },
    {
      path: `${GlobalConstants.ROUTE_CONFIGS}`,

      element: <ConfigsPage />,
    },
    {
      path: '*',

      element: <h1>NOT FOUND</h1>,
    },
  ],
};

export default routes;
