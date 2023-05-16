import { Component } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import MainPage from './components/pages/MainPage';
import 'normalize.css';
import './scss/style.scss';
import { GlobalConstants } from '../GlobalConstants';
import WordBook from './components/pages/wordBook/WordBook';
import Menu from './components/common/menu/Menu';

export default class App extends Component {
  render() {
    console.log(`${GlobalConstants.ROUTE_WORDBOOK}/:level/:page"`);
    return (
      <HashRouter>
        <Menu />
        <Routes>
          <Route path={GlobalConstants.ROUTE_MAIN} element={<MainPage />} />
          <Route path={GlobalConstants.ROUTE_WORDBOOK} element={<WordBook />} />
          <Route path={`${GlobalConstants.ROUTE_WORDBOOK}/:level/:page`} element={<WordBook />} />
          <Route path="*" element={<h1>NOT FOUND</h1>} />
        </Routes>
      </HashRouter>
    );
  }
}
