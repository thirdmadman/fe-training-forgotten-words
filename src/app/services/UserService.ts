import { GlobalConstants } from '../../GlobalConstants';
import { IAuth } from '../interfaces/IAuth';
import { ICreatedUser } from '../interfaces/ICreatedUser';
import { IUser } from '../interfaces/IUser';
import { axiosInstance } from './axiosInstance';

export class UserService {
  /**
   * This method uses token
   */
  static getUserById(userId: string) {
    return axiosInstance()
      .get(`${GlobalConstants.API_ENDPOINT_USERS}/${userId}`)
      .then((res) => res.data as IUser);
  }

  static createUser(email: string, password: string, name: string = email) {
    return axiosInstance(true)
      .post(`${GlobalConstants.API_ENDPOINT_USERS}`, {
        name,
        email,
        password,
      })
      .then((res) => res.data as ICreatedUser);
  }

  /**
   * This method uses token
   */
  static updateUser(email: string, password: string, userId: string) {
    return axiosInstance()
      .put(`${GlobalConstants.API_ENDPOINT_USERS}/${userId}`, {
        email,
        password,
      })
      .then((res) => res.data as IUser);
  }

  /**
   * This method uses token
   */
  static deleteUser(userId: string) {
    return axiosInstance().delete(`${GlobalConstants.API_ENDPOINT_USERS}/${userId}`);
  }

  /**
   * This method uses token
   */
  static refreshUserToken(userId: string) {
    return axiosInstance()
      .get(`${GlobalConstants.API_ENDPOINT_USERS}/${userId}/tokens`)
      .then((res) => res.data as IAuth);
  }
}
