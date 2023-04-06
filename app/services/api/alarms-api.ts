import {catchingAxiosErrors, instance} from './api';
import {AlarmType, SyncResponseType} from '../../types';

const qs = require('qs');

export const alarmsApi = {
  sendAlarm(
    token: string,
    vehicleId: number,
    alarmId: number,
    locationId: number,
    photoId: number,
  ) {
    let data = qs.stringify({
      vehicle_id: vehicleId,
      alarm_id: alarmId,
      location_id: locationId,
      photo_id: photoId,
    });
    return instance
      .post<SyncResponseType>('/api/alarm', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          token: token,
        },
      })
      .then(res => res.data)
      .catch(error => {
        throw new Error(catchingAxiosErrors(error));
      });
  },
  getAlarms: function (token: string) {
    return instance
      .get<Array<AlarmType>>('/api/alarms', {
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
