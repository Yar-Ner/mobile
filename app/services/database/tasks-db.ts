import {ToastAndroid} from 'react-native';
import {saveToLogFile} from '../../utils/saveLogs';
import {pathToLogFile} from '../../../App';
import {clearActionsByTaskId} from './actions-db';
import {AddressType, ContractorType, OrderType, TaskType} from '../../types';
import {executeQuery} from './db';
import {getDateTime} from '../sync/sync';

export const saveTasksDB = async (tasks: Array<TaskType>) => {
  let taskQuery =
    'INSERT  OR REPLACE INTO tasks (id, vehicles_id, ext_id, number, status, loaded_weight, empty_weight, comment, starttime, endtime) VALUES (?,?,?,?,?,?,?,?,?,?)';
  let getIdsQuery = 'SELECT task_id FROM actions';
  try {
    let resultsQuery = await executeQuery(getIdsQuery, []);
    let rows = resultsQuery.rows;
    let results: number[] = [];
    for (let index = 0; index < rows.length; index++) {
      results.push(rows.item(index).task_id);
    }

    let requestsTasksIds = tasks.map(task => task.id);
    let taskIdInNotRequest =
      results.find(id => !requestsTasksIds.includes(id)) || 0;
    if (taskIdInNotRequest) {
      await clearActionsByTaskId(taskIdInNotRequest);
    }
    for (const task of tasks) {
      await executeQuery(taskQuery, [
        task.id,
        task.vehicles_id,
        task.ext_id,
        task.number,
        task.status,
        task.loaded_weight,
        task.empty_weight,
        task.comment,
        task.starttime,
        task.endtime,
      ]);
      await saveAddressesFromTasksDB(task.addresses, task.id);
    }
  } catch (error) {
    let date = getDateTime();
    saveToLogFile(date, pathToLogFile, 'saveTasksDB', error, '');
  }
};

export const saveAddressesFromTasksDB = async (
  addresses: Array<AddressType>,
  taskId: number,
) => {
  let geoObjectsQuery =
    'INSERT OR REPLACE INTO geoobjects (id, ext_id, name, type, address, lat, long, radius) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  try {
    for (const address of addresses) {
      await executeQuery(geoObjectsQuery, [
        address.id,
        address.ext_id,
        address.name,
        address.type,
        address.address,
        address.lat,
        address.long,
        address.radius,
      ]);
      if (address.hasOwnProperty('contractor')) {
        await saveContractorFromAddressesDB(address.contractor, address.id);
      }
      await saveOrdersFromAddressesDB(
        address.orders || [],
        address.id,
        address.trip_type,
        taskId,
      );
    }
  } catch (error) {
    let date = getDateTime();
    saveToLogFile(date, pathToLogFile, 'saveAddressesFromTasksDB', error, '');
  }
};

export const saveOrdersFromAddressesDB = async (
  orders: Array<OrderType>,
  addressId: number,
  tripType: string,
  taskId: number,
) => {
  let query =
    'INSERT OR REPLACE INTO tasks_orders (id, task_addresses_id, ext_id, action, weight, gross_weight, package_weight, plan_arrival, plan_departure, fact_arrival, fact_departure, payload, volume, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  let tasksGeoObjectsQuery =
    'INSERT OR REPLACE INTO tasks_geoobjects (tasks_id, geoobjects_id, "order", trip_type) VALUES (?, ?, ?, ?)';
  try {
    if (!orders.length) {
      await executeQuery(tasksGeoObjectsQuery, [
        taskId,
        addressId,
        0,
        tripType,
      ]);
      return;
    }
    for (const order of orders) {
      await executeQuery(tasksGeoObjectsQuery, [
        taskId,
        addressId,
        order.id,
        tripType,
      ]);
      await executeQuery(query, [
        order.id,
        order.task_addresses_id,
        order.ext_id,
        order.action,
        order.weight,
        order.gross_weight,
        order.package_weight,
        order.plan_arrival,
        order.plan_departure,
        order.fact_arrival,
        order.fact_departure,
        JSON.stringify(order.payload),
        order.volume,
        order.status,
      ]);
    }
  } catch (error) {
    let date = getDateTime();
    saveToLogFile(date, pathToLogFile, 'saveOrdersFromAddressesDB', error, '');
  }
};

const saveContractorFromAddressesDB = async (
  contractor: ContractorType,
  addressId: number,
) => {
  let query =
    'INSERT OR REPLACE INTO contractors (id, ext_id, name, code) VALUES ( ?, ?, ?, ?)';
  let contractorsGeoObjectsQuery =
    'INSERT OR REPLACE INTO contractors_has_geoobjects (contractors_id, geoobjects_id) VALUES(?, ?)';
  try {
    await executeQuery(query, [
      contractor.id,
      contractor.ext_id,
      contractor.name,
      contractor.code,
    ]);
    await executeQuery(contractorsGeoObjectsQuery, [contractor.id, addressId]);
  } catch (error) {
    let date = getDateTime();
    ToastAndroid.showWithGravity(
      'Произошла ошибка при записи в таблицу contractors!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    saveToLogFile(
      date,
      pathToLogFile,
      'saveContractorFromAddressesDB',
      error,
      '',
    );
  }
};

export const getTasksFromDB = async (id: number = 0): Promise<TaskType[]> => {
  let query;
  let result: TaskType[] = [];

  if (id > 0) {
    query = 'SELECT * FROM tasks WHERE task_id = ?';
  } else {
    query = 'SELECT * FROM tasks';
  }

  try {
    let results;
    if (id > 0) {
      results = await executeQuery(query, [id]);
    } else {
      results = await executeQuery(query, []);
    }

    let rows = results.rows;

    for (let index = 0; index < rows.length; index++) {
      let task: TaskType = {
        id: rows.item(index).id,
        vehicles_id: rows.item(index).vehicles_id,
        ext_id: rows.item(index).ext_id,
        number: rows.item(index).number,
        status: rows.item(index).status,
        comment: rows.item(index).comment,
        starttime: rows.item(index).starttime,
        endtime: rows.item(index).endtime,
        updated: rows.item(index).updated,
        addresses: await getAddressesFromDB(rows.item(index).id),
        empty_weight: rows.item(index).empty_weight,
        loaded_weight: rows.item(index).loaded_weight,
      };
      result.push(task);
    }
  } catch (error) {
    let date = getDateTime();
    saveToLogFile(date, pathToLogFile, 'getTasksFromDB', error, '');
  }

  return result;
};

export const getAddressesFromDB = async (
  taskId: number,
): Promise<AddressType[]> => {
  const query =
    'SELECT DISTINCT geoobjects.id, geoobjects.ext_id, geoobjects.name, geoobjects.type, geoobjects.address, geoobjects.lat, geoobjects.lat, geoobjects.long, geoobjects.radius, tasks_geoobjects.trip_type FROM tasks_geoobjects ' +
    'LEFT JOIN geoobjects ON tasks_geoobjects.geoobjects_id = geoobjects.id  WHERE tasks_id = ?';
  let result: AddressType[] = [];
  try {
    let results = await executeQuery(query, [taskId]);

    let rows = results.rows;

    for (let index = 0; index < rows.length; index++) {
      let address = {
        id: rows.item(index).id,
        ext_id: rows.item(index).ext_id,
        address: rows.item(index).address,
        lat: rows.item(index).lat,
        long: rows.item(index).long,
        radius: rows.item(index).radius,
        orders: await getOrdersByAddressIDFromDB(rows.item(index).id, taskId),
        type: rows.item(index).type,
        trip_type: rows.item(index).trip_type,
        contractor: await getContractorByAddressIDFromDB(rows.item(index).id),
        name: rows.item(index).name,
      };
      result.push(address);
    }
  } catch (error) {
    let date = getDateTime();
    ToastAndroid.showWithGravity(
      'Произошла ошибка при обращении к таблице addresses!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    saveToLogFile(date, pathToLogFile, 'getAddressesFromDB', error, '');
  }

  return result;
};

const getOrdersByAddressIDFromDB = async (
  addressId: number,
  taskId: number,
): Promise<OrderType[]> => {
  const query =
    'SELECT DISTINCT tasks_orders.id, tasks_orders.task_addresses_id, tasks_orders.ext_id, tasks_orders.action, tasks_orders.volume, tasks_orders.weight, tasks_orders.gross_weight, tasks_orders.package_weight, tasks_orders.status, tasks_orders.plan_arrival, tasks_orders.plan_departure, tasks_orders.fact_arrival, tasks_orders.fact_departure, tasks_orders.payload FROM tasks_geoobjects ' +
    'LEFT JOIN tasks_orders ON tasks_geoobjects."order" = tasks_orders.id  WHERE tasks_id = ? AND geoobjects_id = ?';
  let result: OrderType[] = [];
  try {
    let results = await executeQuery(query, [taskId, addressId]);

    let rows = results.rows;

    for (let index = 0; index < rows.length; index++) {
      if (rows.item(index).id !== null) {
        let order: OrderType = {
          id: rows.item(index).id,
          task_addresses_id: rows.item(index).task_addresses_id,
          ext_id: rows.item(index).ext_id,
          action: rows.item(index).action,
          weight: rows.item(index).weight,
          volume: rows.item(index).volume,
          gross_weight: rows.item(index).gross_weight,
          package_weight: rows.item(index).package_weight,
          plan_arrival: rows.item(index).plan_arrival,
          plan_departure: rows.item(index).plan_departure,
          fact_arrival: rows.item(index).fact_arrival,
          fact_departure: rows.item(index).fact_departure,
          status: rows.item(index).status,
          payload: JSON.parse(rows.item(index).payload),
        };
        result.push(order);
      }
    }
  } catch (error) {
    let date = getDateTime();
    saveToLogFile(date, pathToLogFile, 'getOrdersFromDB', error, '');
  }

  return result;
};

const getContractorByAddressIDFromDB = async (
  addressId: number,
): Promise<ContractorType> => {
  const query =
    'SELECT DISTINCT * FROM contractors_has_geoobjects LEFT JOIN contractors ON  contractors_has_geoobjects.contractors_id = contractors.id  WHERE geoobjects_id = ?';
  let result: ContractorType = {
    id: 0,
    ext_id: '',
    name: '',
    code: 0,
  };

  try {
    let results = await executeQuery(query, [addressId]);
    let rows = results.rows;

    for (let index = 0; index < rows.length; index++) {
      result = {
        id: rows.item(index).id,
        ext_id: rows.item(index).ext_id,
        name: rows.item(index).name,
        code: rows.item(index).code,
      };
    }
  } catch (error) {
    let date = getDateTime();
    saveToLogFile(
      date,
      pathToLogFile,
      'getContractorByAddressIDFromDB',
      error,
      '',
    );
  }

  return result;
};

export const getCountRowsFromTasks = async () => {
  const query = 'SELECT count(*) from tasks';

  let result = null;

  try {
    let results = await executeQuery(query, []);
    let rows = results.rows;

    result = rows.item(0);
  } catch (error) {
    let date = getDateTime();
    saveToLogFile(date, pathToLogFile, 'getCountRowsFromTasks', error, '');
  }
  return result;
};

export const getCompletedOrders = async (
  orderId: number,
  addressId: number,
  taskId: number,
): Promise<OrderType[]> => {
  let query =
    'SELECT type FROM actions WHERE order_id = ? AND address_id = ? AND task_id = ? AND type= "completed"';
  let result = [];
  try {
    let results = await executeQuery(query, [orderId, addressId, taskId]);
    let rows = results.rows;
    for (let index = 0; index < rows.length; index++) {
      if (rows.item(index).type === 'completed') {
        result.push(rows.item(index).type);
      }
    }
  } catch (error) {
    let date = getDateTime();
    saveToLogFile(date, pathToLogFile, 'getCompletedOrders', error, '');
  }
  return result;
};

export const getStartedTask = async (taskId: number): Promise<object[]> => {
  let query =
    'SELECT task_id FROM actions WHERE  type = "start" AND task_id = ?';

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
    ToastAndroid.showWithGravity(
      'Произошла ошибка при обращении к таблице actions!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    saveToLogFile(
      date,
      pathToLogFile,
      `Error while getting started task from actions table in getStartedTask method. Error ${error}`,
    );
  }
  return result;
};

export const getFinishedTask = async (taskId: number) => {
  let query =
    'SELECT task_id FROM actions WHERE  type = "finish" AND task_id = ?';

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
    ToastAndroid.showWithGravity(
      'Произошла ошибка при обращении к таблице actions!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    saveToLogFile(date, pathToLogFile, 'getFinishedTask', error, '');
  }
  return result;
};

export const getArriveTimeForAddress = async (
  taskId: number,
  addressId: number,
  orderId: number,
) => {
  let query =
    'SELECT time FROM actions WHERE  type = "arrive" AND task_id = ? AND address_id = ? AND order_id = ?';

  let result = [];

  try {
    let results = await executeQuery(query, [taskId, addressId, orderId]);
    let rows = results.rows;

    for (let index = 0; index < rows.length; index++) {
      result.push(rows.item(index).time);
    }
  } catch (error) {
    let date = getDateTime();
    ToastAndroid.showWithGravity(
      'Произошла ошибка при обращении к таблице actions!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    saveToLogFile(date, pathToLogFile, 'getArriveTimeForAddress', error, '');
  }
  return result;
};

export const getDepartureTimeForAddress = async (
  taskId: number,
  addressId: number,
  orderId: number,
) => {
  let query =
    'SELECT time FROM actions WHERE  type = "leave" AND task_id = ? AND address_id = ? AND order_id = ?';

  let result = [];

  try {
    let results = await executeQuery(query, [taskId, addressId, orderId]);
    let rows = results.rows;

    for (let index = 0; index < rows.length; index++) {
      result.push(rows.item(index).time);
    }
  } catch (error) {
    let date = getDateTime();
    ToastAndroid.showWithGravity(
      'Произошла ошибка при обращении к таблице actions!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    saveToLogFile(date, pathToLogFile, 'getDepartureTimeForAddress', error, '');
  }
  return result;
};

export const getCompletedOrdersForSync = async (
  prevDate: string = '',
  date: string = '',
) => {
  let query;

  if (prevDate.length && date.length) {
    query =
      'SELECT task_id, order_id  FROM actions WHERE time > ? AND time < ?  AND type = "completed" AND synced = "false"';
  } else {
    query =
      'SELECT task_id, order_id FROM actions WHERE  type = "completed" AND synced = "false"';
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
    ToastAndroid.showWithGravity(
      'Произошла ошибка при обращении к таблице actions!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    saveToLogFile(
      datetime,
      pathToLogFile,
      'getCompletedOrdersForSync',
      error,
      '',
    );
  }
  return result;
};

export const updateCompletedOrdersForSync = async (
  order_id: number,
  task_id: number,
) => {
  let query =
    'UPDATE actions SET synced = "true" WHERE  type = "completed" AND synced = "false" AND order_id = ? AND task_id = ?';

  try {
    await executeQuery(query, [order_id, task_id]);
  } catch (error) {
    let datetime = getDateTime();
    ToastAndroid.showWithGravity(
      'Произошла ошибка при обращении к таблице actions!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    saveToLogFile(
      datetime,
      pathToLogFile,
      'updateCompletedOrdersForSync',
      error,
      '',
    );
  }
};
