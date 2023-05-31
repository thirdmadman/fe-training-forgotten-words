/* eslint-disable class-methods-use-this */
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GlobalConstants } from '../../../GlobalConstants';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  getUserInfoAction,
  hideRegister,
  registerUserAction,
  setEmailRegister,
  setEmailSignIn,
  setNameRegister,
  setPasswordRegister,
  setPasswordSignIn,
  showRegister,
  signInUserAction,
  signOutAction,
} from '../../redux/features/auth/authSlice';
import DataLocalStorageProvider from '../../services/DataLocalStorageProvider';
import { musicPlayer2 } from '../../services/SingleMusicPlayer2';
import { TokenProvider } from '../../services/TokenProvider';
import './AuthorizationPage.scss';

export function AuthorizationPage() {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const isExpiredSate = searchParams.get('expired');
  const redirectPath = searchParams.get('path');

  const {
    emailSignIn,
    passwordSignIn,
    isShowRegister,

    emailRegister,
    passwordRegister,
    nameRegister,

    userShowName,
    userShowEmail,
  } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

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

  const signOut = () => {
    dispatch(signOutAction());
    navigate(GlobalConstants.ROUTE_MAIN);
  };

  const signIn = (email: string, password: string) => {
    dispatch(signInUserAction({ email, password }))
      .then(() => {
        if (isExpiredSate && redirectPath) {
          navigate(redirectPath);
          return;
        }
        navigate(GlobalConstants.ROUTE_MAIN);
      })
      .catch(() => {});
  };

  const registerUser = () => {
    const signInData = { email: emailRegister, password: passwordRegister, userName: nameRegister };
    dispatch(registerUserAction(signInData)).catch(() => {});
  };

  const getButtonSingnin = () => (
    <button className="auth-form__button" type="button" onClick={() => signIn(emailSignIn, passwordSignIn)}>
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
            onChange={(e) => dispatch(setNameRegister(e.target.value))}
          />
        </div>
        <div className="auth-page__input-group">
          <div className="auth-page__input-title">E-mail</div>
          <input
            className="auth-page__input"
            type="email"
            placeholder="notfound@syntax.error"
            value={emailRegister}
            onChange={(e) => dispatch(setEmailRegister(e.target.value))}
          />
        </div>
        <div className="auth-page__input-group auth-page__input-group__last">
          <div className="auth-page__input-title">Secret</div>
          <input
            className="auth-page__input"
            type="password"
            placeholder="*****"
            value={passwordRegister}
            onChange={(e) => dispatch(setPasswordRegister(e.target.value))}
          />
        </div>
        <button className="auth-form__button" type="button" onClick={registerUser}>
          Create new
        </button>
        <h3 className="auth-form__text">or</h3>
        <button className="auth-form__button" type="button" onClick={() => dispatch(hideRegister())}>
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
          value={emailSignIn}
          onChange={(e) => dispatch(setEmailSignIn(e.target.value))}
        />
      </div>
      <div className="auth-page__input-group auth-page__input-group_last">
        <div className="auth-page__input-title">Secret</div>
        <input
          className="auth-page__input"
          type="password"
          placeholder="*****"
          value={passwordSignIn}
          onChange={(e) => dispatch(setPasswordSignIn(e.target.value))}
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

      dispatch(getUserInfoAction(userId)).catch(() => {});
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
        <button className="auth-form__button" type="button" onClick={() => dispatch(showRegister())}>
          CREATE NEW
        </button>
      </div>
    </div>
  );

  return isShowRegister ? showRegisterPage() : showAuthPage();
}
