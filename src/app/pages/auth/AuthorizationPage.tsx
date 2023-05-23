/* eslint-disable class-methods-use-this */
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GlobalConstants } from '../../../GlobalConstants';
import { SigninService } from '../../services/SigninService';
import { musicPlayer2 } from '../../services/SingleMusicPlayer2';
import { TokenProvider } from '../../services/TokenProvider';
import { UserService } from '../../services/UserService';
import './AuthorizationPage.scss';

export function AuthorizationPage() {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const isExpired = searchParams.get('expired');
  const redirectPath = searchParams.get('path');

  const [emailSignin, setEmailSignin] = useState('');
  const [passwordSignin, setPasswordSignin] = useState('');
  const [isShowRegister, setIsShowRegister] = useState(false);

  const [emailRegister, setEmailRegister] = useState('');
  const [passwordRegister, setPasswordRegister] = useState('');
  const [nameRegister, setNameRegister] = useState('');

  const isUserAuth = !TokenProvider.checkIsExpired();

  const currentTrack = musicPlayer2.getCurrentPlayingTrack();
  if (!currentTrack || currentTrack.indexOf(GlobalConstants.AUTH_MUSIC_NAME) < 0) {
    musicPlayer2.setVolume(0.2);
    musicPlayer2.setPlayList([`${GlobalConstants.MUSIC_PATH + GlobalConstants.AUTH_MUSIC_NAME}`], true);
    musicPlayer2.play().catch(() => {});
  }

  const signIn = (email: string, password: string) => {
    SigninService.auth(email, password)
      .then(() => {
        if (isExpired && redirectPath) {
          navigate(redirectPath);
          return;
        }
        navigate(GlobalConstants.ROUTE_MAIN);
      })
      .catch((error) => {
        console.error(error);
        // this.rootNode.append(String(error));
      });
  };

  const registerUser = (email: string, password: string, userName?: string) => {
    UserService.createUser(email, password, userName)
      .then(() => {
        signIn(email, password);
      })
      .catch((error) => {
        console.error(error);
        // this.authContainer.append(this.errorMessage);
      });
  };

  const signOut = () => {
    TokenProvider.clearAuthData();
    navigate(GlobalConstants.ROUTE_MAIN);
  };

  const getButtonSingnin = () => (
    <button className="auth-form__button" type="button" onClick={() => signIn(emailSignin, passwordSignin)}>
      Start sync
    </button>
  );

  const getButtonExit = () => (
    <button className="auth-form__button" type="button" onClick={() => signOut()}>
      STOP SYNC
    </button>
  );

  const showRegisterPage = () => (
    <div className="auth-page">
      <div className="auth-page__container">
        <div className="auth-page__title">Identity creation</div>
        <div className="auth-page__input-group">
          <div className="auth-page__input-title">UID</div>
          <input
            className="auth-page__input"
            type="username"
            placeholder="any-name"
            value={nameRegister}
            onChange={(e) => setNameRegister(e.target.value)}
          />
        </div>
        <div className="auth-page__input-group">
          <div className="auth-page__input-title">E-mail</div>
          <input
            className="auth-page__input"
            type="email"
            placeholder="notfound@syntax.error"
            value={emailRegister}
            onChange={(e) => setEmailRegister(e.target.value)}
          />
        </div>
        <div className="auth-page__input-group auth-page__input-group__last">
          <div className="auth-page__input-title">Secret</div>
          <input
            className="auth-page__input"
            type="password"
            placeholder="*****"
            value={passwordRegister}
            onChange={(e) => setPasswordRegister(e.target.value)}
          />
        </div>
        <button
          className="auth-form__button"
          type="button"
          onClick={() => registerUser(emailRegister, passwordRegister, nameRegister)}
        >
          Create new
        </button>
        <h3 className="auth-form__text">or</h3>
        <button className="auth-form__button" type="button" onClick={() => setIsShowRegister(false)}>
          Cancel
        </button>
      </div>
    </div>
  );

  const showInputAuth = () => (
    <>
      <div className="auth-page__input-group">
        <div className="auth-page__input-title">E-mail</div>
        <input
          className="auth-page__input"
          type="email"
          placeholder="notfound@syntax.error"
          value={emailSignin}
          onChange={(e) => setEmailSignin(e.target.value)}
        />
      </div>
      <div className="auth-page__input-group auth-page__input-group_last">
        <div className="auth-page__input-title">Secret</div>
        <input
          className="auth-page__input"
          type="password"
          placeholder="*****"
          value={passwordSignin}
          onChange={(e) => setPasswordSignin(e.target.value)}
        />
      </div>
    </>
  );

  const showAuthPage = () => (
    <div className="auth-page">
      <div className="auth-page__container">
        <div className="auth-page__title">{isUserAuth ? 'SYNCHRONIZED' : 'Identity recognizing'}</div>
        {isUserAuth ? '' : showInputAuth()}
        {isUserAuth ? getButtonExit() : getButtonSingnin()}
        <h3 className="auth-form__text">or</h3>
        <button className="auth-form__button" type="button" onClick={() => setIsShowRegister(true)}>
          CREATE NEW
        </button>
      </div>
    </div>
  );

  return isShowRegister ? showRegisterPage() : showAuthPage();
}
