import { GlobalConstants } from '../../GlobalConstants';
import { IAuth } from '../interfaces/IAuth';
import { axiosInstance } from './axiosInstance';
import { TokenProvider } from './TokenProvider';

export class SigninService {
  static auth(email: string, password: string) {
    return axiosInstance(true)
      .post(`${GlobalConstants.API_ENDPOINT_SIGNIN}`, {
        email,
        password,
      })
      .then((res) => {
        const data = res.data as IAuth;
        TokenProvider.setAuthData(data);
        return data;
      });
  }
}
