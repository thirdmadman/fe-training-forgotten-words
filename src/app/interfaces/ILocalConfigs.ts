import { IAuthData } from './IAuthData';
import { IStateStore } from './IStateStore';
import { IUserConfigs } from './IUserConfigs';

export interface ILocalConfigs {
  isExists: boolean;
  authData?: IAuthData;
  stateStore?: IStateStore;
  userConfigs: IUserConfigs;
  version: number;
}
