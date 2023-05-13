import { GlobalConstants } from '../../GlobalConstants';
import { IUserSetting } from '../interfaces/IUserSetting';
import { axiosInstance } from './axiosInstance';

export class UserSettingService {
  /**
   * This method uses token
   */
  static getUserSettingById(id: string) {
    return axiosInstance()
      .get(`${GlobalConstants.API_ENDPOINT_USERS}/${id}/settings`)
      .then((res) => res.data as IUserSetting);
  }

  /**
   * This method uses token
   */
  static updateUserSettingById(id: string, statisticsData: IUserSetting) {
    return axiosInstance()
      .put(`${GlobalConstants.API_ENDPOINT_USERS}/${id}/settings`, statisticsData)
      .then((res) => res.data as IUserSetting);
  }
}
