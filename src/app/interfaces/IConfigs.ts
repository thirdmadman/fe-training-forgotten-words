import { IAuth } from './IAuth';

export interface IConfigs {
  isExists: boolean;
  authData?: IAuth;
  authDataDate?: number;
}
