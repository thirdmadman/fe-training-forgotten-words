import { HashRouter, Route, Routes } from 'react-router-dom';
import MainPage from './components/pages/MainPage';
import 'normalize.css';
import './scss/style.scss';
import { GlobalConstants } from '../GlobalConstants';
import WordBook from './components/pages/wordBook/WordBook';
import Menu from './components/common/menu/Menu';
import { AuthorizationPage } from './components/pages/auth/AuthorizationPage';
import { SprintPage } from './components/pages/sprint/SprintPage';
import { AudiocallPage } from './components/pages/audiocall/AudiocallPage';

export default function App() {
  return (
    <HashRouter>
      <Menu />
      <Routes>
        <Route path={GlobalConstants.ROUTE_MAIN} element={<MainPage />} />
        <Route path={GlobalConstants.ROUTE_WORDBOOK} element={<WordBook />} />
        <Route path={`${GlobalConstants.ROUTE_WORDBOOK}/:level/:page`} element={<WordBook />} />
        <Route path={GlobalConstants.ROUTE_SPRINT} element={<SprintPage />} />
        <Route path={GlobalConstants.ROUTE_AUDIOCALL} element={<AudiocallPage />} />
        <Route path={GlobalConstants.ROUTE_AUTH} element={<AuthorizationPage />} />
        <Route path="*" element={<h1>NOT FOUND</h1>} />
      </Routes>
    </HashRouter>
  );
}
