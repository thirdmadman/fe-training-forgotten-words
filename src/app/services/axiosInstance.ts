import axios from 'axios';
import { GlobalConstants } from '../../GlobalConstants';
import { TokenProvider } from './TokenProvider';

export function axiosInstance(isIgnoreToken = false) {
  if (!isIgnoreToken) {
    if (TokenProvider.redirectIfTokenExpired()) {
      throw new Error('Token expired');
    }
  }
  const instance = axios.create({
    baseURL: GlobalConstants.API_URL,
    headers: { Authorization: `bearer ${String(TokenProvider.getToken())}` },
  });
  return instance;
}
