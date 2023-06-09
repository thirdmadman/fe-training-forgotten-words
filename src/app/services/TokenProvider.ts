import { GlobalConstants } from '../../GlobalConstants';
import { IAuth } from '../interfaces/IAuth';
import { IAuthData } from '../interfaces/IAuthData';
import DataLocalStorageProvider from './DataLocalStorageProvider';

const AUTH_TOKEN_EXPIRES_HOURS = 4;

export class TokenProvider {
  private static authData: IAuthData | undefined;

  static getUserId() {
    if (this.checkIsAuthDataExists() && this.authData?.authResponse.userId) {
      return this.authData.authResponse.userId;
    }
    return null;
  }

  private static checkIsAuthDataExists() {
    let result = false;
    if (this.authData) {
      result = true;
    } else {
      const configs = DataLocalStorageProvider.getData();
      if (configs?.authData) {
        this.authData = { ...configs.authData };
        result = true;
      }
    }
    return result;
  }

  static checkIsExpired() {
    if (this.checkIsAuthDataExists() && this.authData?.authDataDate) {
      const expiresIn = new Date(this.authData?.authDataDate);
      expiresIn.setHours(expiresIn.getHours() + AUTH_TOKEN_EXPIRES_HOURS);
      return new Date().getTime() > expiresIn.getTime();
    }
    return true;
  }

  static clearAuthData() {
    this.authData = undefined;
    DataLocalStorageProvider.destroy();
  }

  static redirectIfTokenExpired() {
    if (TokenProvider.checkIsExpired()) {
      const currentPath = window.location.hash;
      this.clearAuthData();
      window.location.hash = `${GlobalConstants.ROUTE_AUTH}?expired=true&path=${currentPath}`;
      return true;
    }
    return false;
  }

  static getToken() {
    if (this.checkIsAuthDataExists() && this.authData?.authResponse.token) {
      return this.authData.authResponse.token;
    }
    return null;
  }

  static setAuthData(data: IAuth) {
    const configs = DataLocalStorageProvider.getData();
    if (configs) {
      const authData = {
        authResponse: { ...data },
        authDataDate: new Date().getTime(),
      } as IAuthData;

      configs.authData = authData;
      DataLocalStorageProvider.setData(configs);
    }

    const authData = {
      authResponse: { ...data },
      authDataDate: new Date().getTime(),
    } as IAuthData;

    this.authData = authData;
  }

  static refreshToken() {
    throw new Error('Not implemented');
  }
}
