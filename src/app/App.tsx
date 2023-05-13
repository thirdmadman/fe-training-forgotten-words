import { Component } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './components/pages/MainPage';
import './scss/style.scss';
import { GlobalConstants } from '../GlobalConstants';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path={GlobalConstants.ROUTE_MAIN} element={<MainPage />} />
          <Route path="*" element={<h1>NOT FOUND</h1>} />
        </Routes>
      </BrowserRouter>
    );
  }
}
