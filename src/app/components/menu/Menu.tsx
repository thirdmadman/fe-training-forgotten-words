import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GlobalConstants } from '../../../GlobalConstants';
import { musicPlayer2 } from '../../services/SingleMusicPlayer2';
import { TokenProvider } from '../../services/TokenProvider';
import './Menu.scss';

const menuData = [
  {
    title: 'Their memories',
    path: GlobalConstants.ROUTE_WORDBOOK,
    isAuthNeeded: false,
  },
  {
    title: 'Audio decoding',
    path: GlobalConstants.ROUTE_AUDIOCALL,
    isAuthNeeded: false,
  },
  {
    title: 'Meaning resolving',
    path: GlobalConstants.ROUTE_SPRINT,
    isAuthNeeded: false,
  },
  {
    title: 'Diary',
    path: GlobalConstants.ROUTE_DIARY,
    isAuthNeeded: true,
  },
  {
    title: 'Identity Recognizing',
    path: GlobalConstants.ROUTE_AUTH,
    isAuthNeeded: false,
  },
  {
    title: 'Our memories',
    path: GlobalConstants.ROUTE_OUR_MEMORIES,
    isAuthNeeded: true,
  },
  {
    title: 'Ancestors',
    path: GlobalConstants.ROUTE_MAIN,
    isAuthNeeded: false,
  },
  {
    title: 'Configs',
    path: GlobalConstants.ROUTE_CONFIGS,
    isAuthNeeded: false,
  },
];

export default function Menu() {
  const [isHidden, setIsHidden] = useState(true);

  const location = useLocation();

  const isUserAuth = Boolean(TokenProvider.getToken()) && !TokenProvider.checkIsExpired();

  const getMenuLink = (title: string, path: string) => {
    const isSelected = location.pathname === path || (location.pathname.indexOf(path) === 0 && path.length > 1);
    return (
      <li className={isSelected ? 'nav-menu__item nav-menu__item-active' : 'nav-menu__item'} key={path}>
        <Link to={path} className="nav-menu__link" onClick={() => setIsHidden(true)}>
          {title}
        </Link>
      </li>
    );
  };

  let menuLinks = menuData;

  if (!isUserAuth) {
    menuLinks = menuLinks.filter((menuLink) => !menuLink.isAuthNeeded);
  }

  if (!isHidden) {
    document.body.classList.add('hidden_overflow-y');
  } else {
    document.body.classList.remove('hidden_overflow-y');
  }

  useEffect(() => {
    if (!isHidden) {
      musicPlayer2.pause();
    }
  });

  return (
    <div className="menu">
      <div className={isHidden ? 'main main-hidden' : 'main'}>
        <div className="app-name-container">
          <div className="app-name">{GlobalConstants.APP_NAME}</div>
        </div>
        <div className="navigation-container">
          <div className="logo-container" />
          <nav className="nav-menu">
            <ul className="nav-menu__list">
              {menuLinks.map((menuLink) => getMenuLink(menuLink.title, menuLink.path))}
            </ul>
          </nav>
        </div>
        <button
          type="button"
          className="close-button"
          aria-label="close"
          onClick={() => {
            musicPlayer2.play().catch((e) => console.error(e));
            setIsHidden(true);
          }}
        />
      </div>
      <button
        type="button"
        className={isHidden ? 'burger-menu-button' : 'burger-menu-button burger-menu-button-hidden'}
        aria-label="menu"
        onClick={() => setIsHidden(false)}
      />
    </div>
  );
}
