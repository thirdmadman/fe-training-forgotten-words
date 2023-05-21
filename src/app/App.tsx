import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import 'normalize.css';
import './scss/style.scss';
import { GlobalConstants } from '../GlobalConstants';
import WordBook from './components/pages/wordBook/WordBook';
import Menu from './components/common/menu/Menu';
import { AuthorizationPage } from './components/pages/auth/AuthorizationPage';
import { SprintPage } from './components/pages/sprint/SprintPage';
import { AudiocallPage } from './components/pages/audiocall/AudiocallPage';
import { DiaryPage } from './components/pages/diary/DiaryPage';

export default function App() {
  return (
    <HashRouter>
      <Menu />
      <Routes>
        <Route path={GlobalConstants.ROUTE_MAIN} element={<Navigate to={GlobalConstants.ROUTE_WORDBOOK} />} />
        <Route path={GlobalConstants.ROUTE_WORDBOOK} element={<WordBook />} />
        <Route path={`${GlobalConstants.ROUTE_WORDBOOK}/:level/:page`} element={<WordBook />} />
        <Route path={GlobalConstants.ROUTE_SPRINT} element={<SprintPage />} />
        <Route path={GlobalConstants.ROUTE_AUDIOCALL} element={<AudiocallPage />} />
        <Route path={GlobalConstants.ROUTE_AUTH} element={<AuthorizationPage />} />
        <Route path={GlobalConstants.ROUTE_DIARY} element={<DiaryPage />} />
        <Route path="*" element={<h1>NOT FOUND</h1>} />
      </Routes>
    </HashRouter>
  );
}
