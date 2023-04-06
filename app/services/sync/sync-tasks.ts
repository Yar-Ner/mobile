import {saveToLogFile} from '../../utils/saveLogs';
import {pathToLogFile} from '../../../App';
import {ToastAndroid} from 'react-native';
import {OrderStatuses} from '../../utils/statuses';
import {
  getArriveTaskFromAction,
  getCarWeightsFromAction,
  getChangeContainerFromActionsDB,
  getContainerFromActionsDB,
  getLeaveTaskFromAction,
  getTaskIdFromFinishedAction,
  getTaskIdFromStartedAction,
  updateArriveTaskFromActionDB,
  updateCarWeightsFromActionDB, updateChangeContainerStatusInActions, updateContainerStatusInActions,
  updateLeaveTaskFromActionDB,
  updateTaskIdFromFinishedAction,
  updateTaskIdFromStartedAction,
} from '../database/actions-db';
import {syncApi} from '../api/sync-api';
import {getDateTime} from './sync';
import {
  getCompletedOrdersForSync,
  updateCompletedOrdersForSync,
} from '../database/tasks-db';
import {getClosedOrderLocationByOrderId} from '../database/locations-db';

export const syncStartedTasks = async (
  token: string,
  prevDate: string = '',
  date: string = '',
) => {
  try {
    let tasksIds;
    if (prevDate.length && date.length) {
      tasksIds = await getTaskIdFromStartedAction(prevDate, date);
    } else {
      tasksIds = await getTaskIdFromStartedAction();
    }
    for (let i = 0, len = tasksIds.length; i < len; i++) {
      let time = `${tasksIds[i].date} ${tasksIds[i].time}`;
      await syncApi.syncStartTask(token, tasksIds[i].task_id, time);
      await updateTaskIdFromStartedAction(tasksIds[i].task_id);
    }
    return 1;
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(datetime, pathToLogFile, 'syncStartedTasks', error, '');
    ToastAndroid.showWithGravity(
      'Произошла ошибка при синхронизции!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    return -1;
  }
};
export const syncFinishedTasks = async (
  token: string,
  prevDate: string = '',
  date: string = '',
) => {
  try {
    let tasksIds;
    if (prevDate.length && date.length) {
      tasksIds = await getTaskIdFromFinishedAction(prevDate, date);
    } else {
      tasksIds = await getTaskIdFromFinishedAction();
    }
    for (let i = 0, len = tasksIds.length; i < len; i++) {
      let time = `${tasksIds[i].date} ${tasksIds[i].time}`;
      await syncApi.syncFinishTask(token, tasksIds[i].task_id, time, tasksIds[i].odometer);
      await updateTaskIdFromFinishedAction(tasksIds[i].task_id);
    }
    return 1;
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(datetime, pathToLogFile, 'syncFinishedTasks', error, '');
    ToastAndroid.showWithGravity(
      'Произошла ошибка при синхронизции!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    return -1;
  }
};

export const syncFinishedOrders = async (
  token: string,
  prevDate: string = '',
  date: string = '',
) => {
  try {
    let finishedOrder;
    if (prevDate.length && date.length) {
      finishedOrder = await getCompletedOrdersForSync(prevDate, date);
    } else {
      finishedOrder = await getCompletedOrdersForSync();
    }

    let finishedOrderAddressId = 0;

    for (let i = 0, len = finishedOrder.length; i < len; i++) {
      let locations = await getClosedOrderLocationByOrderId(
        finishedOrder[i].order_id,
      );
      let locationResponseId = null;

      if (
        locations.length > 0 &&
        finishedOrderAddressId !== locations[0].address_id
      ) {
        let datetime = `${locations[0]?.date} ${locations[0]?.time}`;
        locationResponseId = await syncApi.syncLocation(
          token,
          locations[0].task_id,
          locations[0].vehicle_id,
          datetime,
          locations[0].lat,
          locations[0].long,
          locations[0].speed,
          locations[0].direction,
          locations[0].altitude,
          locations[0].accuracy,
          locations[0].distance,
        );
        finishedOrderAddressId = finishedOrder[i].address_id;
        await syncApi.syncOrderFinish(
          token,
          finishedOrder[i].task_id,
          finishedOrder[i].order_id,
          locationResponseId,
          OrderStatuses.done,
        );
        await updateCompletedOrdersForSync(
          finishedOrder[i].order_id,
          finishedOrder[i].task_id,
        );
      }
    }
    return 1;
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(datetime, pathToLogFile, 'syncFinishedOrders', error, '');
    ToastAndroid.showWithGravity(
      'Произошла ошибка при синхронизции!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    return -1;
  }
};

export const syncArriveToAddress = async (
  token: string,
  prevDate: string = '',
  date: string = '',
) => {
  try {
    let arrivedTasks;
    if (prevDate.length && date.length) {
      arrivedTasks = await getArriveTaskFromAction(prevDate, date);
    } else {
      arrivedTasks = await getArriveTaskFromAction();
    }
    for (let i = 0, len = arrivedTasks.length; i < len; i++) {
      let datetime = `${arrivedTasks[i]?.date} ${arrivedTasks[i]?.time}`;
      await syncApi.syncArriveTask(
        token,
        arrivedTasks[i].task_id,
        arrivedTasks[i].address_id,
        datetime,
      );
      await updateArriveTaskFromActionDB(
        arrivedTasks[i].task_id,
        arrivedTasks[i].address_id,
        arrivedTasks[i].order_id,
      );
    }
    return 1;
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(datetime, pathToLogFile, 'syncArriveToAddress', error, '');
    ToastAndroid.showWithGravity(
      'Произошла ошибка при синхронизции!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    return -1;
  }
};

export const syncLeaveFromAddress = async (
  token: string,
  prevDate: string = '',
  date: string = '',
) => {
  try {
    let leaveTasks;
    if (prevDate.length && date.length) {
      leaveTasks = await getLeaveTaskFromAction(prevDate, date);
    } else {
      leaveTasks = await getLeaveTaskFromAction();
    }
    for (let i = 0, len = leaveTasks.length; i < len; i++) {
      let time = `${leaveTasks[i].date} ${leaveTasks[i].time}`;
      await syncApi.syncLeaveTask(
        token,
        leaveTasks[i].task_id,
        leaveTasks[i].address_id,
        time,
      );
      await updateLeaveTaskFromActionDB(
        leaveTasks[i].task_id,
        leaveTasks[i].address_id,
        leaveTasks[i].order_id,
      );
    }
    return 1;
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(datetime, pathToLogFile, 'syncLeaveFromAddress', error, '');
    ToastAndroid.showWithGravity(
      'Произошла ошибка при синхронизции!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    return -1;
  }
};

export const syncCarWeights = async (
  token: string,
  prevDate: string = '',
  date: string = '',
) => {
  try {
    let weights: any[] = [];
    if (prevDate.length && date.length) {
      weights = await getCarWeightsFromAction(prevDate, date);
    } else {
      weights = await getCarWeightsFromAction();
    }

    for (let i = 0, len = weights.length; i < len; i++) {
      if (weights[i].loaded_car_weight === 0 || weights[i].empty_car_weight == 0) continue;
      await syncApi.syncWeights(token, weights[i].task_ext_id, weights[i].loaded_car_weight, weights[i].empty_car_weight);
      await updateCarWeightsFromActionDB(weights[i].task_id);
    }
    return 1;
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(datetime, pathToLogFile, 'syncCarWeights', error, '');
    ToastAndroid.showWithGravity(
      'Произошла ошибка при синхронизции!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    console.log('error:', error);
    return -1;
  }
};


export const syncContainers = async (
    token: string,
) => {
  try {
    let containers: any[] = await getContainerFromActionsDB();
    let changeContainers: any[] = await getChangeContainerFromActionsDB();

    for (const container of containers) {
      for (const changeContainer of changeContainers) {
        if ((container.address_id === changeContainer.address_id) && (container.order_id === changeContainer.order_id)) {
          await syncApi.syncContainers(token, container.task_id, container.order_id, container.bunker_value, changeContainer.bunker_value);
          await updateContainerStatusInActions(container.address_id, container.order_id);
          await updateChangeContainerStatusInActions(changeContainer.address_id, changeContainer.order_id);
        }
      }
    }
    return 1;
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(datetime, pathToLogFile, 'syncCarWeights', error, '');
    ToastAndroid.showWithGravity(
        'Произошла ошибка при синхронизции!',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
    );
    console.log('error:', error);
    return -1;
  }
};
