import {catchingAxiosErrors, instance} from './api';
import {ResponseSettingsType} from '../../types';

export const settingsApi = {
  getDefaultSettings(token: string, userId: number) {
    return instance
      .get<Array<ResponseSettingsType>>(`settings/user/${userId}`, {
        headers: {
          token: token,
        },
      })
      .then(res => res.data)
      .catch(error => {
        throw new Error(catchingAxiosErrors(error));
      });
  },
  getUserSettings(token: string) {
    return instance
      .get<Array<ResponseSettingsType>>('api/user/config', {
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
