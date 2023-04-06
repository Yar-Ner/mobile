import {catchingAxiosErrors, instance} from './api';
import {ResponseSettingsType, SyncResponseType} from '../../types';

const qs = require('qs');

export const syncApi = {
  syncFinishTask(token: string, taskId: string, time: string, odometer: number) {
    let data = qs.stringify({
      tasks_id: taskId,
      time: time,
      odometer: odometer,
    });
    return instance
      .post<SyncResponseType>(`/api/tasks/${taskId}/finish`, data, {
        headers: {
          token: token,
        },
      })
      .then(res => res.data.id)
      .catch(error => {
        throw new Error(catchingAxiosErrors(error));
      });
  },
  syncStartTask(token: string, taskId: string, time: string) {
    let data = qs.stringify({
      tasks_id: taskId,
      time: time,
    });
    return instance
      .post<SyncResponseType>(`/api/tasks/${taskId}/start`, data, {
        headers: {
          token: token,
        },
      })
      .then(res => res.data.id)
      .catch(error => {
        throw new Error(catchingAxiosErrors(error));
      });
  },
  syncPauseTask(token: string, taskId: string) {
    return instance
      .post<SyncResponseType>(`/api/tasks/${taskId}/finish`, {
        headers: {
          token: token,
        },
      })
      .then(res => res.data.id)
      .catch(error => {
        throw new Error(catchingAxiosErrors(error));
      });
  },
  syncArriveTask(
    token: string,
    taskId: string,
    addressId: string,
    time: string,
  ) {
    let data = qs.stringify({
      tasks_id: taskId,
      address_id: addressId,
      time: time,
    });
    return instance
      .post<SyncResponseType>(`/api/tasks/${taskId}/arrive`, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          token: token,
        },
      })
      .then(res => res.data.id)
      .catch(error => {
        throw new Error(catchingAxiosErrors(error));
      });
  },
  syncLeaveTask(
    token: string,
    taskId: string,
    addressId: string,
    time: string,
  ) {
    let data = qs.stringify({
      tasks_id: taskId,
      address_id: addressId,
      time: time,
    });
    return instance
      .post<SyncResponseType>(`/api/tasks/${taskId}/leave`, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          token: token,
        },
      })
      .then(res => res.data.id)
      .catch(error => {
        throw new Error(catchingAxiosErrors(error));
      });
  },
  syncOrderFinish(
    token: string,
    taskId: number,
    orderId: number,
    locationId: number,
    status: string,
  ) {
    let data = qs.stringify({
      tasks_id: taskId,
      order_id: orderId,
      location_id: locationId,
      status: status,
    });
    return instance
      .post<SyncResponseType>(`/api/tasks/${taskId}/status/${status}`, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          token: token,
        },
      })
      .then(res => res.data.id)
      .catch(error => {
        throw new Error(catchingAxiosErrors(error));
      });
  },
  syncPhoto(
    token: string,
    orderId: number,
    vehicleId: number,
    locationId: number,
    photo: string,
  ) {
    let data = qs.stringify({
      orders_id: orderId,
      vehicle_id: vehicleId,
      location_id: locationId,
      photo: photo,
    });
    return instance
      .post<SyncResponseType>('/api/photo', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          token: token,
        },
      })
      .then(res => res.data.id)
      .catch(error => {
        throw new Error(catchingAxiosErrors(error));
      });
  },
  syncLocation(
    token: string,
    taskId: number,
    vehicleId: number,
    time: string,
    lat: number,
    long: number,
    speed: number,
    direction: number,
    altitude: number,
    accuracy: number,
    distance: number,
  ) {
    let data = qs.stringify({
      tasks_id: taskId,
      vehicle_id: vehicleId,
      time,
      lat,
      long,
      speed,
      direction,
      altitude,
      accuracy,
      distance,
    });
    return instance
      .post<SyncResponseType>('/api/monitoring/location', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          token: token,
        },
      })
      .then(res => res.data.id)
      .catch(error => {
        throw new Error(catchingAxiosErrors(error));
      });
  },
  syncWeights(token: string, extTaskId: string, loaded_weight: number, empty_weight: number) {
    let data = qs.stringify({
      loaded_weight: loaded_weight,
      empty_weight: empty_weight,
    });
    return instance
      .post<SyncResponseType>(
        `/api/tasks/${extTaskId}/weight`,
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            token: token,
          },
        },
      )
      .then(res => res.data.id)
      .catch(error => {
        throw new Error(catchingAxiosErrors(error));
      });
  },

  sendSettings(
    token: string,
    userId: number,
    settings: Array<ResponseSettingsType>,
  ) {
    const formData = new FormData();

    formData.append('settings', JSON.stringify(settings));

    return instance
      .post(`/settings/user/${userId}/save`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          token: token,
        },
      })
      .then(res => res.data)
      .catch(error => {
        throw new Error(catchingAxiosErrors(error));
      });
  },

  syncContainers(token: string, taskId: number, orderId: number, containerId: number, changeContainerId: number) {
    let data = qs.stringify({
      order_id: orderId,
      hopper: containerId,
      replacement_hopper: changeContainerId,
    });

    return instance
        .post<SyncResponseType>(
            `/api/tasks/${taskId}/payload`,
            data,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: token,
              },
            },
        )
        .then(res => res.data.id)
        .catch(error => {
          throw new Error(catchingAxiosErrors(error));
        });
  }
};
