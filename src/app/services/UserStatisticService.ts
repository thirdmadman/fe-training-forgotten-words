import { GlobalConstants } from '../../GlobalConstants';
import { IUserStatistic } from '../interfaces/IUserStatistic';
import { axiosInstance } from './axiosInstance';

export class UserStatisticService {
  /**
   * This method uses token
   */
  static getUserStatisticById(userId: string) {
    return axiosInstance()
      .get(`${GlobalConstants.API_ENDPOINT_USERS}/${userId}/statistics`)
      .then((res) => res.data as IUserStatistic);
  }

  /**
   * This method uses token
   */
  static updateUserStatisticById(userId: string, statisticsData: IUserStatistic) {
    return axiosInstance()
      .put(`${GlobalConstants.API_ENDPOINT_USERS}/${userId}/statistics`, statisticsData)
      .then((res) => res.data as IUserStatistic);
  }
}
