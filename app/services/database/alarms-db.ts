import {ToastAndroid} from 'react-native';
import {saveToLogFile} from '../../utils/saveLogs';
import {pathToLogFile} from '../../../App';
import {executeQuery} from './db';
import {AlarmType} from '../../types';
import {getDateTime} from '../sync/sync';

export const saveAlarm = async (
  id: number,
  name: string,
  type: string = '',
  icon: string = '',
) => {
  let query =
    'INSERT OR REPLACE INTO alarms (id, type, icon, name) VALUES (?, ?, ?, ?)';
  try {
    await executeQuery(query, [id, type, icon, name]);
  } catch (error) {
    let date = getDateTime();
    ToastAndroid.showWithGravity(
      'Произошла ошибка при записи в таблицу alarms!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    saveToLogFile(date, pathToLogFile, 'saveAlarm', error, '');
  }
};
export const getAlarmsFromDB = async (id: number = 0) => {
  let query;
  let result = [];

  if (id > 0) {
    query = 'SELECT * FROM alarms WHERE id = ?';
  } else {
    query = 'SELECT * FROM alarms';
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
      let alarm: AlarmType = {
        id: rows.item(index).id,
        type: rows.item(index).type,
        icon: rows.item(index).icon,
        name: rows.item(index).name,
      };
      result.push(alarm);
    }
  } catch (error) {
    let date = getDateTime();
    ToastAndroid.showWithGravity(
      'Произошла ошибка при получении тревог из БД!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    saveToLogFile(date, pathToLogFile, 'getAlarmsFromDB', error, '');
  }

  return result;
};

export const getCountRowsFromAlarms = async () => {
  const query = 'SELECT count(*) from alarms LIMIT 1';

  let result = null;

  try {
    let results = await executeQuery(query, []);
    let rows = results.rows;
    result = rows.item(0);
  } catch (error) {
    let date = getDateTime();
    saveToLogFile(date, pathToLogFile, 'getCountRowsFromAlarms', error, '');
  }
  return result['count(*)'];
};
