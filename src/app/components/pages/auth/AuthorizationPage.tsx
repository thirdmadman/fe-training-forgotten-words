/* eslint-disable class-methods-use-this */
import { useState } from 'react';
import { SigninService } from '../../../services/SigninService';
import { TokenProvider } from '../../../services/TokenProvider';
import { UserService } from '../../../services/UserService';
import './AuthorizationPage.scss';

export function AuthorizationPage() {
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // onCreateButtonClick = () => {};

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // onCancelButtonClick = () => {};

  // private redirectPage = GlobalConstants.ROUTE_WORDBOOK;

  // constructor(path: string) {
  //   super();
  //   this.rootNode = dch('div', ['auth-page']);

  //   const currentPath = path.split('/');
  //   const redirectPage = path.split('?path=')[1];

  //   if (currentPath[1] === 'expired?path=') {
  //     this.redirectPage = redirectPage;
  //   }

  //   this.showSignIn();
  // }

  // showSignIn() {
  //   this.rootNode.innerHTML = '';

  //   const mainTitleSignIn = dch('div', ['auth-page__title'], 'Identity recognizing');

  //   const inputGroupEmail = dch('div', ['auth-page__input-group']);
  //   const emailInputTitle = dch('div', ['auth-page__input-title'], 'E-mail');
  //   const emailInput = dch('input', ['auth-page__input']) as HTMLInputElement;
  //   emailInput.setAttribute('type', 'email');
  //   emailInput.setAttribute('placeholder', 'notfound@syntax.error');
  //   inputGroupEmail.append(emailInputTitle, emailInput);

  //   const inputGroupPassword = dch('div', ['auth-page__input-group', 'auth-page__input-group__last']);
  //   const passwordInputTitle = dch('div', ['auth-page__input-title'], 'Secret');
  //   const passwordInput = dch('input', ['auth-page__input']) as HTMLInputElement;
  //   passwordInput.setAttribute('type', 'password');
  //   passwordInput.setAttribute('placeholder', '*****');
  //   inputGroupPassword.append(passwordInputTitle, passwordInput);

  //   const signInButton = dch('button', ['auth-form__button'], 'Start sync');
  //   signInButton.onclick = () => {
  //     const emailValue = emailInput.value;
  //     const passwordValue = passwordInput.value;
  //     this.signIn(emailValue, passwordValue);
  //   };

  //   const text = dch('h3', ['auth-form__text'], 'or');

  //   const openRegisterButton = dch('button', ['auth-form__button'], 'CREATE NEW');
  //   openRegisterButton.onclick = () => {
  //     this.showRegister();
  //   };

  //   const exitButton = dch('button', ['auth-form__button'], 'STOP SYNC');
  //   exitButton.onclick = () => {
  //     this.signOut();
  //   };

  //   const pageContainer = dch('div', ['auth-page__container']);
  //   if (!TokenProvider.checkIsExpired()) {
  //     pageContainer.append(
  //       mainTitleSignIn,
  //       exitButton,
  //       text,
  //       openRegisterButton,
  //     );
  //   } else {
  //     pageContainer.append(
  //       mainTitleSignIn,
  //       inputGroupEmail,
  //       inputGroupPassword,
  //       signInButton,
  //       text,
  //       openRegisterButton,
  //     );
  //   }
  //   this.rootNode.append(pageContainer);
  // }

  // showRegister() {
  //   this.rootNode.innerHTML = '';

  //   const mainTitleRegistration = dch('div', ['auth-page__title'], 'Identity creation');

  //   const inputGroupName = dch('div', ['auth-page__input-group']);
  //   const nameInputTitle = dch('div', ['auth-page__input-title'], 'UID');
  //   const nameInput = dch('input', ['auth-page__input']) as HTMLInputElement;
  //   nameInput.setAttribute('type', 'username');
  //   nameInput.setAttribute('placeholder', 'any-name');
  //   inputGroupName.append(nameInputTitle, nameInput);

  //   const inputGroupEmail = dch('div', ['auth-page__input-group']);
  //   const emailInputTitle = dch('div', ['auth-page__input-title'], 'E-mail');
  //   const emailInput = dch('input', ['auth-page__input']) as HTMLInputElement;
  //   emailInput.setAttribute('type', 'email');
  //   emailInput.setAttribute('placeholder', 'notfound@syntax.error');
  //   inputGroupEmail.append(emailInputTitle, emailInput);

  //   const inputGroupPassword = dch('div', ['auth-page__input-group', 'auth-page__input-group__last']);
  //   const passwordInputTitle = dch('div', ['auth-page__input-title'], 'Secret');
  //   const passwordInput = dch('input', ['auth-page__input']) as HTMLInputElement;
  //   passwordInput.setAttribute('type', 'password');
  //   passwordInput.setAttribute('placeholder', '*****');
  //   inputGroupPassword.append(passwordInputTitle, passwordInput);

  //   const registerButton = dch('button', ['auth-form__button'], 'create new');
  //   registerButton.onclick = () => {
  //     const emailValue = emailInput.value;
  //     const passwordValue = passwordInput.value;
  //     const nameValue = nameInput.value;
  //     this.registerUser(emailValue, passwordValue, nameValue);
  //   };

  //   const text = dch('h3', ['auth-form__text'], 'or');

  //   const cancelButton = dch('button', ['auth-form__button'], 'Cancel');
  //   cancelButton.onclick = () => {
  //     this.showSignIn();
  //   };

  //   const pageContainer = dch('div', ['auth-page__container']);
  //   pageContainer.append(
  //     mainTitleRegistration,
  //     inputGroupName,
  //     inputGroupEmail,
  //     inputGroupPassword,
  //     registerButton,
  //     text,
  //     cancelButton,
  //   );

  //   this.rootNode.append(pageContainer);
  // }

  const [emailSignin, setEmailSignin] = useState('');
  const [passwordSignin, setPasswordSignin] = useState('');
  const [isShowRegister, setIsShowRegister] = useState(false);

  const [emailRegister, setEmailRegister] = useState('');
  const [passwordRegister, setPasswordRegister] = useState('');
  const [nameRegister, setNameRegister] = useState('');

  const isUserAuth = !TokenProvider.checkIsExpired();

  const signIn = (email: string, password: string) => {
    SigninService.auth(email, password)
      .then(() => {
        // PathBus.setCurrentPath(`${this.redirectPage}`);
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
    // PathBus.setCurrentPath(PathBus.getCurrentPath());
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
        <div className="auth-page__title">Identity recognizing</div>
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
