import { GlobalConstants } from '../../GlobalConstants';
import { IAuth } from '../interfaces/IAuth';
import DataLocalStorageProvider from './DataLocalStorageProvider';
import { PathBus } from './PathBus';

export class TokenProvider {
  private static authData: IAuth | undefined;

  private static authDataDate: number | undefined;

  static getUserId() {
    if (this.checkIsAuthDataExists() && this.authData?.userId) {
      return this.authData.userId;
    }
    return null;
  }

  static redirectIfTokenExpired() {
    if (TokenProvider.checkIsExpired()) {
      const currentPath = PathBus.getCurrentPath();
      this.clearAuthData();
      PathBus.setCurrentPath(`${GlobalConstants.ROUTE_AUTH}?expired=true&path=${currentPath}`);
      return true;
    }
    return false;
  }

  static checkIsExpired() {
    if (this.checkIsAuthDataExists() && this.authDataDate) {
      const expiresIn = new Date(this.authDataDate);
      expiresIn.setHours(expiresIn.getHours() + 4);
      return new Date().getTime() > expiresIn.getTime();
    }
    return true;
  }

  private static checkIsAuthDataExists() {
    let result = false;
    if (this.authData && this.authDataDate) {
      result = true;
    } else {
      const configs = DataLocalStorageProvider.getData();
      if (configs?.authData && configs?.authDataDate) {
        this.authData = { ...configs.authData };
        this.authDataDate = configs.authDataDate;
        result = true;
      }
    }
    return result;
  }

  static getToken() {
    if (this.checkIsAuthDataExists() && this.authData?.token) {
      return this.authData.token;
    }
    return null;
  }

  static setAuthData(data: IAuth) {
    const configs = DataLocalStorageProvider.getData();
    if (configs) {
      configs.authData = { ...data };
      configs.authDataDate = new Date().getTime();
      DataLocalStorageProvider.setData(configs);
    }
    this.authData = { ...data };
    this.authDataDate = new Date().getTime();
  }

  static refreshToken() {
    throw new Error('Not implemented');
  }

  static clearAuthData() {
    this.authDataDate = undefined;
    this.authData = undefined;
    DataLocalStorageProvider.destroy();
  }
}
