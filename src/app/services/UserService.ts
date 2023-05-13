import { GlobalConstants } from '../../GlobalConstants';
import { IAuth } from '../interfaces/IAuth';
import { ICreatedUser } from '../interfaces/ICreatedUser';
import { IUser } from '../interfaces/IUser';
import { axiosInstance } from './axiosInstance';

export class UserService {
  /**
   * This method uses token
   */
  static getUserById(id: string) {
    return axiosInstance()
      .get(`${GlobalConstants.API_ENDPOINT_USERS}/${id}`)
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
  static updateUser(email: string, password: string, id: string) {
    return axiosInstance()
      .put(`${GlobalConstants.API_ENDPOINT_USERS}/${id}`, {
        email,
        password,
      })
      .then((res) => res.data as IUser);
  }

  /**
   * This method uses token
   */
  static deleteUser(id: string) {
    return axiosInstance().delete(`${GlobalConstants.API_ENDPOINT_USERS}/${id}`);
  }

  /**
   * This method uses token
   */
  static refreshUserToken(id: string) {
    return axiosInstance()
      .get(`${GlobalConstants.API_ENDPOINT_USERS}/${id}/tokens`)
      .then((res) => res.data as IAuth);
  }
}
