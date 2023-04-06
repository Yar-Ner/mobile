import {ToastAndroid} from 'react-native';
import {saveToLogFile} from '../../utils/saveLogs';
import {pathToLogFile} from '../../../App';
import {executeQuery} from './db';
import {Photo} from '../../types';
import {getDate, getDateTime} from '../sync/sync';

export const addAction = async ({
  type = '',
  time = '',
  taskId = 0,
  addressId = 0,
  locationId = 0,
  orderId = 0,
  uri = '',
  vehicleId = 0,
  alarmId = 0,
  photoId = '',
  lat = 0,
  long = 0,
  speed = 0,
  direction = 0,
  distance = 0,
  accuracy = 0,
  altitude = 0,
  emptyCarWeight = 0,
  loadedCarWeight = 0,
  taskExtId = '',
  addressExtId = '',
  orderExtId = '',
  status = '',
  odometer = 0,
  bunkerValue = 1,
  bunkerType = '',
  synced = '',
}) => {
  const query =
    'INSERT INTO actions ' +
    '(task_id, type, time, address_id, location_id, order_id, uri, vehicle_id, alarm_id, photo_id, ' +
    'lat, long, speed, direction, distance, accuracy, altitude, date, empty_car_weight, loaded_car_weight, ' +
    'task_ext_id, address_ext_id, order_ext_id, status, odometer, bunker_value, bunker_type, synced) ' +
    'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  let date = getDate();
  try {
    if (type.length && time.length) {
      await executeQuery(query, [
        taskId,
        type,
        time,
        addressId,
        locationId,
        orderId,
        uri,
        vehicleId,
        alarmId,
        photoId,
        lat,
        long,
        speed,
        direction,
        distance,
        accuracy,
        altitude,
        date,
        emptyCarWeight,
        loadedCarWeight,
        taskExtId,
        addressExtId,
        orderExtId,
        status,
        odometer,
        bunkerValue,
        bunkerType,
        synced,
      ]);
    }
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(datetime, pathToLogFile, 'addAction', error, '');
  }
};

export const getTaskIdFromFinishedAction = async (
  prevDate: string = '',
  date: string = '',
) => {
  let query;

  if (prevDate.length && date.length) {
    query =
      'SELECT task_id, time, date, odometer FROM actions WHERE time > ? AND time < ?  AND type = "finish" AND synced = "false"';
  } else {
    query =
      'SELECT task_id, time, date, odometer FROM actions WHERE  type = "finish" AND synced = "false"';
  }

  let result = [];

  try {
    let results;
    if (prevDate.length && date.length) {
      results = await executeQuery(query, [prevDate, date]);
    } else {
      results = await executeQuery(query, []);
    }
    let rows = results.rows;

    for (let index = 0; index < rows.length; index++) {
      result.push(rows.item(index));
    }
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(
      datetime,
      pathToLogFile,
      'getTaskIdFromFinishedAction',
      error,
      '',
    );
  }
  return result;
};

export const updateTaskIdFromFinishedAction = async (task_id: string) => {
  let query =
    'UPDATE actions SET synced = "true" WHERE  type = "finish" AND synced = "false" AND task_id = ?';

  try {
    await executeQuery(query, [task_id]);
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(
      datetime,
      pathToLogFile,
      'updateTaskIdFromStartedAction',
      error,
      '',
    );
  }
};

export const getLocationsFromActionDB = async (
  prevDate: string = '',
  date: string = '',
) => {
  let query;

  if (prevDate.length && date.length) {
    query =
      'SELECT  task_id, vehicle_id, time, date, lat, long, speed, direction, distance, altitude, accuracy, time FROM actions WHERE synced = "false" AND time > ? AND time < ?  AND type = "location"';
  } else {
    query =
      'SELECT task_id, vehicle_id, time, date, lat, long, speed, direction, distance, altitude, accuracy, time FROM actions WHERE type = "location" AND synced = "false"';
  }

  let result = [];

  try {
    let results;
    if (prevDate.length && date.length) {
      results = await executeQuery(query, [prevDate, date]);
    } else {
      results = await executeQuery(query, []);
    }
    let rows = results.rows;

    for (let index = 0; index < rows.length; index++) {
      result.push(rows.item(index));
    }
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(
      datetime,
      pathToLogFile,
      'getLocationFromActionDB',
      error,
      '',
    );
  }
  return result;
};
export const updateLocationFromActionDB = async (
  vehicle_id: number,
  task_id: number,
) => {
  let query =
    'UPDATE actions SET synced = "true" WHERE  type = "location" AND synced = "false" AND vehicle_id = ? AND task_id = ?';

  try {
    await executeQuery(query, [vehicle_id, task_id]);
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(
      datetime,
      pathToLogFile,
      'updateLocationsFromActionDB',
      error,
      '',
    );
  }
};

export const getTaskIdFromStartedAction = async (
  prevDate: string = '',
  date: string = '',
) => {
  let query;

  if (prevDate.length && date.length) {
    query =
      'SELECT task_id, date, time FROM actions WHERE time > ? AND time < ?  AND type = "start" AND synced = "false"';
  } else {
    query =
      'SELECT task_id, date, time FROM actions WHERE  type = "start" AND synced = "false"';
  }

  let result = [];

  try {
    let results;
    if (prevDate.length && date.length) {
      results = await executeQuery(query, [prevDate, date]);
    } else {
      results = await executeQuery(query, []);
    }
    let rows = results.rows;

    for (let index = 0; index < rows.length; index++) {
      result.push(rows.item(index));
    }
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(
      datetime,
      pathToLogFile,
      'getTaskIdFromStartedAction',
      error,
      '',
    );
  }
  return result;
};

export const updateTaskIdFromStartedAction = async (task_id: string) => {
  let query =
    'UPDATE actions SET synced = "true" WHERE  type = "start" AND synced = "false" AND task_id = ?';

  try {
    await executeQuery(query, [task_id]);
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(
      datetime,
      pathToLogFile,
      'updateTaskIdFromStartedAction',
      error,
      '',
    );
  }
};

export const getPhotoFromActionDB = async (
  prevDate: string = '',
  date: string = '',
) => {
  let query;

  if (prevDate.length && date.length) {
    query =
      'SELECT task_id, order_id, uri, photo_id, vehicle_id, address_id FROM actions WHERE time > ? AND synced = "false" AND time < ? AND type = "photo" AND uri <> ""';
  } else {
    query =
      'SELECT task_id, order_id, uri, photo_id, vehicle_id, address_id FROM actions WHERE synced = "false" AND synced = "false" AND type = "photo" AND uri <> "" ';
  }

  let result = [];

  try {
    let results;
    if (prevDate.length && date.length) {
      results = await executeQuery(query, [prevDate, date]);
    } else {
      results = await executeQuery(query, []);
    }
    let rows = results.rows;

    for (let index = 0; index < rows.length; index++) {
      result.push(rows.item(index));
    }
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(datetime, pathToLogFile, 'getPhotoFromActionDB', error, '');
  }
  return result;
};

export const updatePhotoFromActionDB = async (
  order_id: string,
  task_id: string,
  address_id: string,
) => {
  let query =
    'UPDATE actions SET synced = "true" WHERE  type = "photo" AND synced = "false" AND order_id = ? AND task_id = ? AND address_id = ?';

  try {
    await executeQuery(query, [order_id, task_id, address_id]);
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(
      datetime,
      pathToLogFile,
      'updatePhotoFromActionDB',
      error,
      '',
    );
  }
};

export const getPhotosFromActionDb = async (
  orderId: number,
  addressId: number,
  taskId: number,
): Promise<Photo[]> => {
  let query =
    'SELECT uri, task_id, address_id, photo_id, vehicle_id FROM actions WHERE order_id = ? AND address_id = ? AND task_id = ? AND type = "photo"';
  let result = [];
  try {
    let results = await executeQuery(query, [orderId, addressId, taskId]);
    let rows = results.rows;

    for (let index = 0; index < rows.length; index++) {
      let photo = {
        id: rows.item(index).photo_id,
        taskId: rows.item(index).task_id,
        addressId: rows.item(index).address_id,
        uri: rows.item(index).uri,
        vehicle_id: rows.item(index).vehicle_id,
      };

      result.push(photo);
    }
  } catch (error) {
    let date = getDateTime();
    saveToLogFile(date, pathToLogFile, 'getTaskIdFromStartedAction', error, '');
  }
  return result;
};

export const getArriveTaskFromAction = async (
  prevDate: string = '',
  date: string = '',
) => {
  let query;

  if (prevDate.length && date.length) {
    query =
      'SELECT task_id, address_id, location_id, time, order_id, date  FROM actions WHERE time > ? AND time < ? AND synced = "false" AND type = "arrive"';
  } else {
    query =
      'SELECT task_id, address_id, location_id, time, order_id, date FROM actions WHERE  type = "arrive" AND synced = "false"';
  }

  let result = [];

  try {
    let results;
    if (prevDate.length && date.length) {
      results = await executeQuery(query, [prevDate, date]);
    } else {
      results = await executeQuery(query, []);
    }
    let rows = results.rows;

    for (let index = 0; index < rows.length; index++) {
      result.push(rows.item(index));
    }
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(
      datetime,
      pathToLogFile,
      'getArriveTaskFromAction',
      error,
      '',
    );
  }
  return result;
};

export const updateArriveTaskFromActionDB = async (
  task_id: string,
  address_id: string,
  order_id: string,
) => {
  let query =
    'UPDATE actions SET synced = "true" WHERE  type = "arrive" AND synced = "false" AND task_id = ? AND address_id = ? AND order_id = ?';

  try {
    await executeQuery(query, [task_id, address_id, order_id]);
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(
      datetime,
      pathToLogFile,
      'updateArriveTaskFromActionDB',
      error,
      '',
    );
  }
};

export const getLeaveTaskFromAction = async (
  prevDate: string = '',
  date: string = '',
) => {
  let query;

  if (prevDate.length && date.length) {
    query =
      'SELECT task_id, address_id, location_id, order_id, time, date  FROM actions WHERE time > ? AND time < ? AND synced = "false"  AND type = "leave"';
  } else {
    query =
      'SELECT task_id, address_id, location_id, order_id, time, date FROM actions WHERE  type = "leave" AND synced = "false"';
  }

  let result = [];

  try {
    let results;
    if (prevDate.length && date.length) {
      results = await executeQuery(query, [prevDate, date]);
    } else {
      results = await executeQuery(query, []);
    }
    let rows = results.rows;

    for (let index = 0; index < rows.length; index++) {
      result.push(rows.item(index));
    }
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(datetime, pathToLogFile, 'getLeaveTaskFromAction', error, '');
  }
  return result;
};

export const updateLeaveTaskFromActionDB = async (
  task_id: string,
  address_id: string,
  order_id: string,
) => {
  let query =
    'UPDATE actions SET synced = "true" WHERE  type = "leave" AND synced = "false" AND task_id = ? AND address_id = ? AND order_id = ?';

  try {
    await executeQuery(query, [task_id, address_id, order_id]);
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(
      datetime,
      pathToLogFile,
      'updateLeaveTaskFromActionDB',
      error,
      '',
    );
  }
};

export const getAlarmsFromAction = async (
  prevDate: string = '',
  date: string = '',
) => {
  let query;

  if (prevDate.length && date.length) {
    query =
      'SELECT alarm_id, vehicle_id, location_id  FROM actions WHERE time > ? AND time < ? AND type = "alarm" AND synced = "false"';
  } else {
    query =
      'SELECT alarm_id, vehicle_id, location_id  FROM actions WHERE type = "alarm" AND synced = "false"';
  }

  let result = [];

  try {
    let results;
    if (prevDate.length && date.length) {
      results = await executeQuery(query, [prevDate, date]);
    } else {
      results = await executeQuery(query, []);
    }
    let rows = results.rows;

    for (let index = 0; index < rows.length; index++) {
      result.push(rows.item(index));
    }
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(datetime, pathToLogFile, 'getAlarmsFromAction', error, '');
  }
  return result;
};

export const updateAlarmsFromActionDB = async (
  vehicle_id: number,
  alarm_id: number,
) => {
  let query =
    'UPDATE actions SET synced = "true" WHERE  type = "alarm" AND synced = "false" AND vehicle_id = ? AND alarm_id = ?';

  try {
    await executeQuery(query, [vehicle_id, alarm_id]);
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(
      datetime,
      pathToLogFile,
      'updateAlarmsFromActionDB',
      error,
      '',
    );
  }
};

export const getCarWeightsFromAction = async (
  prevDate: string = '',
  date: string = '',
) => {
  let query;

  if (prevDate.length && date.length) {
    query =
      'SELECT task_id, empty_car_weight, loaded_car_weight, task_ext_id  FROM actions WHERE time > ? AND time < ?  AND type = "change_weights" AND synced = "false"';
  } else {
    query =
      'SELECT task_id, empty_car_weight, loaded_car_weight, task_ext_id FROM actions WHERE  type = "change_weights" AND synced = "false"';
  }

  let result = [];

  try {
    let results;
    if (prevDate.length && date.length) {
      results = await executeQuery(query, [prevDate, date]);
    } else {
      results = await executeQuery(query, []);
    }
    let rows = results.rows;

    for (let index = 0; index < rows.length; index++) {
      result.push(rows.item(index));
    }
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(
      datetime,
      pathToLogFile,
      'getCarWeightsFromAction',
      error,
      '',
    );
  }
  return result;
};

export const updateCarWeightsFromActionDB = async (
    task_id: number,
) => {
  let query =
      'UPDATE actions SET synced = "true" WHERE  type = "change_weights" AND synced = "false" AND task_id = ?';

  try {
    await executeQuery(query, [task_id]);
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(
        datetime,
        pathToLogFile,
        'updateCarWeightsFromActionDB',
        error,
        '',
    );
  }
};

export const getCarWeightsFromActionById = async (taskId: number) => {
  let query;
  query =
    'SELECT empty_car_weight, loaded_car_weight, task_ext_id, vehicle_id, status  FROM actions WHERE task_id = ? AND type = "change_weights"';

  let result = [];

  try {
    let results;
    results = await executeQuery(query, [taskId]);
    let rows = results.rows;

    for (let index = 0; index < rows.length; index++) {
      result.push(rows.item(index));
    }
  } catch (error) {
    let date = getDateTime();
    saveToLogFile(
      date,
      pathToLogFile,
      'getCarWeightsFromActionById',
      error,
      '',
    );
  }
  return result;
};

export const clearActionsByTaskId = async (taskIdForDelete: number) => {
  try {
    let deleteTaskQuery = 'DELETE FROM tasks WHERE id = ?';
    let query = 'DELETE FROM actions WHERE task_id = ?';
    await executeQuery(deleteTaskQuery, [taskIdForDelete]);
    await executeQuery(query, [taskIdForDelete]);
  } catch (error) {
    let date = getDateTime();
    ToastAndroid.showWithGravity(
      'Произошла ошибка при очистке журнала!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    saveToLogFile(date, pathToLogFile, 'clearActionsByTaskId', error, '');
  }
};

export const clearFinishedAction = async (taskId: number) => {
  try {
    let query = 'DELETE FROM actions WHERE task_id = ? AND type = "finish"';
    await executeQuery(query, [taskId]);
  } catch (error) {
    let date = getDateTime();
    ToastAndroid.showWithGravity(
      'Произошла ошибка при очистке журнала!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    saveToLogFile(date, pathToLogFile, 'clearFinishedAction', error, '');
  }
};

export const clearCompletedAction = async (
  taskId: number,
  addressId: number,
  orderId: number,
) => {
  try {
    let query =
      'DELETE FROM actions WHERE task_id = ? AND order_id = ? AND address_id = ? AND type = "completed"';
    await executeQuery(query, [taskId, orderId, addressId]);
  } catch (error) {
    let date = getDateTime();
    ToastAndroid.showWithGravity(
      'Произошла ошибка при очистке журнала!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    saveToLogFile(date, pathToLogFile, 'clearCompletedAction', error, '');
  }
};

export const getLocationidFromActionDB = async (
  carId: number,
  taskId: number,
  lat: number,
  long: number,
) => {
  let query =
    'SELECT id FROM actions WHERE type = "location" AND synced = "false" AND vehicle_id = ? AND task_id = ? AND lat = ? AND long = ?';

  let result = [];

  try {
    let results = await executeQuery(query, [carId, taskId, lat, long]);

    let rows = results.rows;
    console.log('result location:', results.rows.item(0));
    for (let index = 0; index < rows.length; index++) {
      result.push(rows.item(index).id);
    }
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(
      datetime,
      pathToLogFile,
      'getLocationIdFromActionDB',
      error,
      '',
    );
  }
  return result;
};

export const getSettingsActionFromDB = async () => {
  let query =
      'SELECT id FROM actions WHERE type = "settings" AND synced = "false"';

  let result = [];

  try {
    let results = await executeQuery(query, []);
    let rows = results.rows;
    for (let index = 0; index < rows.length; index++) {
      result.push(rows.item(index).id);
    }
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(
        datetime,
        pathToLogFile,
        'getSettingsActionFromDB',
        error,
        '',
    );
  }
  return result;
}

export const updateSettingsStatusInActions = async () => {
  let query =
      'UPDATE actions SET synced = "true" WHERE  type = "settings" AND synced = "false"';

  try {
    await executeQuery(query, []);
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(
        datetime,
        pathToLogFile,
        'updateSettingsStatusInActions',
        error,
        '',
    );
  }
};

export const getContainersFromActionsDB =  async (addressId: number, orderId: number) => {
  let query =
      'SELECT bunker_value, bunker_type  FROM actions WHERE type = "container" AND order_id = ? AND address_id = ? AND  synced = "false"';

  let result = [];

  try {
    let results = await executeQuery(query, [orderId, addressId]);
    let rows = results.rows;
    for (let index = 0; index < rows.length; index++) {
      result.push(rows.item(index));
    }
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(
        datetime,
        pathToLogFile,
        'getContainerFromActionsDB',
        error,
        '',
    );
  }
  return result;
}

export const getContainerFromActionsDB =  async () => {
  let query =
      'SELECT bunker_value, task_id, order_id, address_id  FROM actions WHERE type = "container" AND bunker_type = "bunker" AND  synced = "false"';

  let result = [];

  try {
    let results = await executeQuery(query, []);
    let rows = results.rows;
    for (let index = 0; index < rows.length; index++) {
      result.push(rows.item(index));
    }
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(
        datetime,
        pathToLogFile,
        'getContainerFromActionsDB',
        error,
        '',
    );
  }
  return result;
}

export const getChangeContainerFromActionsDB =  async () => {
  let query =
      'SELECT bunker_value, task_id, order_id, address_id  FROM actions WHERE type = "container" AND bunker_type = "change"  AND  synced = "false"';

  let result = [];

  try {
    let results = await executeQuery(query, []);
    let rows = results.rows;
    for (let index = 0; index < rows.length; index++) {
      result.push(rows.item(index));
    }
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(
        datetime,
        pathToLogFile,
        'getContainerFromActionsDB',
        error,
        '',
    );
  }
  return result;
}

export const updateContainerStatusInActions = async (addressId: number, orderId: number) => {
  let query =
      'UPDATE actions SET synced = "true" WHERE  type = "container" AND bunker_type = "bunker" AND address_id = ? AND order_id = ? AND synced = "false"';

  try {
    await executeQuery(query, [addressId, orderId]);
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(
        datetime,
        pathToLogFile,
        'updateContainerStatusInActions',
        error,
        '',
    );
  }
};

export const updateChangeContainerStatusInActions = async (addressId: number, orderId: number) => {
  let query =
      'UPDATE actions SET synced = "true" WHERE  type = "container" AND bunker_type = "change" AND address_id = ? AND order_id = ? AND synced = "false"';

  try {
    await executeQuery(query, [addressId, orderId]);
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(
        datetime,
        pathToLogFile,
        'updateChangeContainerStatusInActions',
        error,
        '',
    );
  }
};


