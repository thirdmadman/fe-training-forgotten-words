/* eslint-disable class-methods-use-this */
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GlobalConstants } from '../../../GlobalConstants';
import DataLocalStorageProvider from '../../services/DataLocalStorageProvider';
import { SigninService } from '../../services/SigninService';
import { musicPlayer2 } from '../../services/SingleMusicPlayer2';
import { TokenProvider } from '../../services/TokenProvider';
import { UserService } from '../../services/UserService';
import { UserSettingService } from '../../services/UserSettingService';
import './AuthorizationPage.scss';

interface IAuthPageState {
  emailSignin: string;
  passwordSignin: string;
  isShowRegister: boolean;

  emailRegister: string;
  passwordRegister: string;
  nameRegister: string;

  userShowName: string;
  userShowEmail: string;
}

export function AuthorizationPage() {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const isExpiredSate = searchParams.get('expired');
  const redirectPath = searchParams.get('path');

  const initialState = {
    emailSignin: '',
    passwordSignin: '',
    isShowRegister: false,

    emailRegister: '',
    passwordRegister: '',
    nameRegister: '',

    userShowName: '',
    userShowEmail: '',
  };

  const [state, setState] = useState<IAuthPageState>(initialState);

  const {
    emailSignin,
    passwordSignin,
    isShowRegister,

    emailRegister,
    passwordRegister,
    nameRegister,

    userShowName,
    userShowEmail,
  } = state;

  const isUserAuth = !TokenProvider.checkIsExpired();

  const currentTrack = musicPlayer2.getCurrentPlayingTrack();
  if (!currentTrack || currentTrack.indexOf(GlobalConstants.AUTH_MUSIC_NAME) < 0) {
    const userConfigs = DataLocalStorageProvider.getData();

    const musicVolumeMultiplier = userConfigs.userConfigs.musicLevel;
    const musicVolume = musicVolumeMultiplier * 0.2;

    musicPlayer2.setVolume(musicVolume);
    musicPlayer2.setPlayList([`${GlobalConstants.MUSIC_PATH + GlobalConstants.AUTH_MUSIC_NAME}`], true);
    musicPlayer2.play().catch(() => {});
  }

  const signIn = (email: string, password: string) => {
    SigninService.auth(email, password)
      .then((auth) => {
        const { userId } = auth;
        UserSettingService.getUserSettingById(userId)
          .then((settings) => {
            if (settings.optional) {
              const configs = { ...DataLocalStorageProvider.getData() };
              configs.userConfigs = settings.optional;
              DataLocalStorageProvider.setData(configs);
            }
          })
          .catch((e) => console.error(e));

        if (isExpiredSate && redirectPath) {
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
            onChange={(e) => setState({ ...state, nameRegister: e.target.value })}
          />
        </div>
        <div className="auth-page__input-group">
          <div className="auth-page__input-title">E-mail</div>
          <input
            className="auth-page__input"
            type="email"
            placeholder="notfound@syntax.error"
            value={emailRegister}
            onChange={(e) => setState({ ...state, emailRegister: e.target.value })}
          />
        </div>
        <div className="auth-page__input-group auth-page__input-group__last">
          <div className="auth-page__input-title">Secret</div>
          <input
            className="auth-page__input"
            type="password"
            placeholder="*****"
            value={passwordRegister}
            onChange={(e) => setState({ ...state, passwordRegister: e.target.value })}
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
        <button
          className="auth-form__button"
          type="button"
          onClick={() => setState({ ...state, isShowRegister: false })}
        >
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
          onChange={(e) => setState({ ...state, emailSignin: e.target.value })}
        />
      </div>
      <div className="auth-page__input-group auth-page__input-group_last">
        <div className="auth-page__input-title">Secret</div>
        <input
          className="auth-page__input"
          type="password"
          placeholder="*****"
          value={passwordSignin}
          onChange={(e) => setState({ ...state, passwordSignin: e.target.value })}
        />
      </div>
    </>
  );

  const showUserInformation = () => {
    if (userShowName === '' && userShowEmail === '') {
      const isExpired = TokenProvider.checkIsExpired();
      const userId = TokenProvider.getUserId();

      if (isExpired || !userId) {
        return '';
      }

      UserService.getUserById(userId)
        .then((user) => {
          setState({ ...state, userShowName: user.name, userShowEmail: user.email });
        })
        .catch((e) => console.error(e));
    }

    return (
      <div className="user-information">
        <div className="user-information__group">
          <div className="user-information__title">You</div>
          <div className="user-information__text user-information__text_username">{userShowName}</div>
        </div>
        <div className="user-information__group">
          <div className="user-information__title">Yor email</div>
          <div className="user-information__text user-information__text_email">{userShowEmail}</div>
        </div>
      </div>
    );
  };

  const showAuthPage = () => (
    <div className="auth-page">
      <div className="auth-page__container">
        <div className="auth-page__title">{isUserAuth ? 'SYNCHRONIZED' : 'Identity recognizing'}</div>
        {isUserAuth ? '' : showInputAuth()}
        {isUserAuth ? showUserInformation() : ''}
        {isUserAuth ? getButtonExit() : getButtonSingnin()}
        <h3 className="auth-form__text">or</h3>
        <button
          className="auth-form__button"
          type="button"
          onClick={() => setState({ ...state, isShowRegister: true })}
        >
          CREATE NEW
        </button>
      </div>
    </div>
  );

  return isShowRegister ? showRegisterPage() : showAuthPage();
}
