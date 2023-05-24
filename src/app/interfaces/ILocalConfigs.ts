import { IAuth } from './IAuth';
import { IStateStore } from './IStateStore';
import { IUserConfigs } from './IUserConfigs';

export interface ILocalConfigs {
  isExists: boolean;
  authData?: IAuth;
  authDataDate?: number;
  stateStore?: IStateStore;
  userConfigs?: IUserConfigs;
}
