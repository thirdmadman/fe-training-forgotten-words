import { GlobalConstants } from '../../GlobalConstants';
import { IUserSetting } from '../interfaces/IUserSetting';
import { axiosInstance } from './axiosInstance';

export class UserSettingService {
  /**
   * This method uses token
   */
  static getUserSettingById(userId: string) {
    return axiosInstance()
      .get(`${GlobalConstants.API_ENDPOINT_USERS}/${userId}/settings`)
      .then((res) => res.data as IUserSetting);
  }

  /**
   * This method uses token
   */
  static updateUserSettingById(userId: string, settingsData: IUserSetting) {
    return axiosInstance()
      .put(`${GlobalConstants.API_ENDPOINT_USERS}/${userId}/settings`, settingsData)
      .then((res) => res.data as IUserSetting);
  }
}
