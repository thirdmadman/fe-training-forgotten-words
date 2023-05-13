import { GlobalConstants } from '../../GlobalConstants';
import { IUserStatistic } from '../interfaces/IUserStatistic';
import { axiosInstance } from './axiosInstance';

export class UserStatisticService {
  /**
   * This method uses token
   */
  static getUserStatisticById(id: string) {
    return axiosInstance()
      .get(`${GlobalConstants.API_ENDPOINT_USERS}/${id}/statistics`)
      .then((res) => res.data as IUserStatistic);
  }

  /**
   * This method uses token
   */
  static updateUserStatisticById(id: string, statisticsData: IUserStatistic) {
    return axiosInstance()
      .put(`${GlobalConstants.API_ENDPOINT_USERS}/${id}/statistics`, statisticsData)
      .then((res) => res.data as IUserStatistic);
  }
}
