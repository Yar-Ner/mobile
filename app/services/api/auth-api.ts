import {catchingAxiosErrors, instance} from './api';
import {ResponseContainerType} from "../../types";
const qs = require('qs');

type LoginType = {
  id: number;
  token: string;
  fullname: string;
};

type UserInfoType = {
  id: number;
  username: string;
  fullname: string;
  token: string;
};

type GetCar = {
  id: number;
  name: string;
  number: string;
  description: string;
  color: string;
  weight: number;
  type: number;
  containers?: Array<ResponseContainerType>;
};

export const authApi = {
  getToken(user: string, password: string) {
    let data = qs.stringify({
      login: user,
      password: password,
    });
    return instance
      .post<LoginType>('/auth/login', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params: {
          login: user,
          password: password,
        },
      })
      .then(res => res.data.token)
      .catch(error => {
        throw new Error(catchingAxiosErrors(error));
      });
  },
  getUserInfo(token: string) {
    return instance
      .get<UserInfoType>('/auth/info', {
        headers: {
          token: token,
        },
      })
      .then(res => res.data)
      .catch(error => {
        throw new Error(catchingAxiosErrors(error));
      });
  },
  getUserCars(token: string) {
    return instance
      .get<Array<GetCar>>('/api/user/vehicles', {
        headers: {
          token: token,
        },
      })
      .then(res => res.data)
      .catch(error => {
        throw new Error(catchingAxiosErrors(error));
      });
  },
};
