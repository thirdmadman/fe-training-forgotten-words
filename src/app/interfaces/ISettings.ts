import { IUserConfigs } from './IUserConfigs';

export interface ISettings {
  id?: string;
  wordsPerDay: number;
  optional: IUserConfigs;
}
