import {AnyAction, Dispatch} from 'redux';
import {tasksApi} from '../../../../services/api/tasks-api';
import {clearRoutesTables} from '../../../../services/database/db';
import {
  getTasksFromDB,
  saveTasksDB,
} from '../../../../services/database/tasks-db';
import {
  setTasksActionCreator,
  setCurrentAddressActionCreator,
  setCurrentTaskIdActionCreator,
  setOrdersCompleteActionCreator,
  setTasksCompleteActionCreator,
  addContainerActionCreator,
  setCompletedAddressActionCreator,
  setSelectedTaskActionCreator,
} from '../../../actionCreators/tasksActionCreators';
import ErrorAlert from '../../../../components/ErrorAlert/ErorAlert';
import {saveToLogFile} from '../../../../utils/saveLogs';
import {pathToLogFile} from '../../../../../App';
import {getDateTime} from '../../../../services/sync/sync';
import {
  CompletedAddressType,
  CompletedOrderType,
  ContainerType,
  TaskType,
} from '../../../../types';
import {syncCarWeights} from '../../../../services/sync/sync-tasks';
import store from '../../../store';

export const getTasks = (token: string) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    let responseTasks = null;
    try {
      let carId = store.getState().carsState.car.id;
      responseTasks = await tasksApi.getTasks(token, carId);
      await syncCarWeights(token);
      await clearRoutesTables();
      await saveTasksDB(responseTasks.data);
      let dbTasks = await getTasksFromDB();
      dispatch(setTasksActionCreator(dbTasks));
    } catch (error) {
      let datetime = getDateTime();
      ErrorAlert('Произошла ошибка при получении списка задач с сервера!');
      saveToLogFile(datetime, pathToLogFile, 'getTasks', error, '');
      let dbTasks = await getTasksFromDB();
      dispatch(setTasksActionCreator(dbTasks));
      return -1;
    }
  };
};

export const setOrdersComplete = (orders: Array<CompletedOrderType>) => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(setOrdersCompleteActionCreator(orders));
  };
};

export const setTasksComplete = (tasks: Array<number>) => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(setTasksCompleteActionCreator(tasks));
  };
};

export const setCurrentTaskId = (id: number | null) => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(setCurrentTaskIdActionCreator(id));
  };
};

export const setSelectedTask = (task: TaskType) => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(setSelectedTaskActionCreator(task));
  };
};

export const setCurrentAddress = (
  taskId: number | null,
  addressId: number | null,
) => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(setCurrentAddressActionCreator(taskId, addressId));
  };
};

export const addContainer = (container: ContainerType) => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(addContainerActionCreator(container));
  };
};

export const setCompletedAddresses = (
  completedAddresses: Array<CompletedAddressType>,
) => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(setCompletedAddressActionCreator(completedAddresses));
  };
};
