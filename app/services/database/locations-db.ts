import {saveToLogFile} from '../../utils/saveLogs';
import {pathToLogFile} from '../../../App';
import {executeQuery} from './db';
import {getDateTime} from '../sync/sync';

export const getPhotoLocationByOrderId = async (orderId: number) => {
  const query =
    'SELECT task_id, vehicle_id, date, time, lat, long, speed, direction, distance, altitude, accuracy, address_id, time FROM actions WHERE type = "location" AND status ="photo" AND order_id=? ';

  let result = [];

  try {
    let results;
    results = await executeQuery(query, [orderId]);

    let rows = results.rows;

    for (let index = 0; index < rows.length; index++) {
      result.push(rows.item(index));
    }
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(datetime, pathToLogFile, 'getLocationFromActionDB', error, '');
  }
  return result;
};


export const getClosedOrderLocationByOrderId = async (orderId: number) => {
  const query =
      'SELECT task_id, vehicle_id, date, time, lat, long, speed, direction, distance, altitude, accuracy, address_id, time FROM actions WHERE type = "location" AND status ="closed_order" AND order_id=? ';

  let result = [];

  try {
    let results;
    results = await executeQuery(query, [orderId]);

    let rows = results.rows;

    for (let index = 0; index < rows.length; index++) {
      result.push(rows.item(index));
    }
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(datetime, pathToLogFile, 'getClosedOrderLocationByOrderId', error, '');
  }
  return result;
};
