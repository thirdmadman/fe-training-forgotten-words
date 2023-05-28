import { GlobalConstants } from '../../GlobalConstants';
import { ISettings } from '../interfaces/ISettings';
import { axiosInstance } from './axiosInstance';

export class UserSettingService {
  /**
   * This method uses token
   */
  static getUserSettingById(userId: string) {
    return axiosInstance()
      .get(`${GlobalConstants.API_ENDPOINT_USERS}/${userId}/settings`)
      .then((res) => res.data as ISettings);
  }

  /**
   * This method uses token
   */
  static updateUserSettingById(userId: string, settingsData: ISettings) {
    return axiosInstance()
      .put(`${GlobalConstants.API_ENDPOINT_USERS}/${userId}/settings`, settingsData)
      .then((res) => res.data as ISettings);
  }
}
