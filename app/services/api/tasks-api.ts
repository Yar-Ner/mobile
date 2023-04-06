import {catchingAxiosErrors, instance} from './api';
import {TaskType} from '../../types';

type ResponseTasksType = {
  data: Array<TaskType>;
  pos: number;
  total_count: number;
};

export const tasksApi = {
  getTasks(token: string, vehicleId: number, start = 0) {
    return instance
      .get<ResponseTasksType>('/tasks', {
        headers: {
          token: token,
        },
        params: {
          start: start,
          count: '1000',
          'filter[vehicles_id]': vehicleId,
        },
      })
      .then(res => res.data)
      .catch(error => {
        throw new Error(catchingAxiosErrors(error));
      });
  },
};
