import SQLite, {ResultSet, Transaction} from 'react-native-sqlite-storage';
import {ToastAndroid} from 'react-native';
import {saveToLogFile} from '../../utils/saveLogs';
import {pathToLogFile} from '../../../App';
import {getDateTime} from '../sync/sync';

SQLite.enablePromise(true);

const getConnection = async () => {
  return SQLite.openDatabase(
    {
      name: 'makrab_mobile.db',
      location: 'default',
      createFromLocation: 1,
    },
    () => {},
    (error: any) => {
      let date = getDateTime();
      ToastAndroid.showWithGravity(
        'Произошла ошибка при подключении к БД!',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      saveToLogFile(date, pathToLogFile, 'getConnection', error, '');
    },
  );
};

export const executeQuery = async (
  query: string,
  params: Array<any>,
): Promise<ResultSet> => {
  const db = await getConnection();
  return new Promise((resolve, reject) => {
    db.transaction((trans: any) => {
      trans.executeSql(
        query,
        params,
        (tx: Transaction, results: ResultSet) => {
          resolve(results);
        },
        (error: any) => {
          reject(error);
        },
      );
    });
  });
};

export const clearData = async () => {
  const queries = [
    'DELETE FROM  tasks',
    'DELETE FROM  actions',
    'DELETE FROM  geoobjects',
    'DELETE FROM  alarms',
    'DELETE FROM  contractors',
    'DELETE FROM  tasks_orders',
    'DELETE FROM  tasks_geoobjects',
    'DELETE FROM  contractors_has_geoobjects',
    'DELETE FROM  photos',
  ];
  try {
    for (let i = 0; i < queries.length; i++) {
      await executeQuery(queries[i], []);
    }
  } catch (error) {
    let date = getDateTime();
    saveToLogFile(date, pathToLogFile, 'clearData', error, '');
  }
};

export const clearActionsTable = async () => {
  const query = "DELETE FROM actions WHERE date < datetime('now','-5 day')";
  try {
    await executeQuery(query, []);
  } catch (error) {
    let date = getDateTime();
    saveToLogFile(date, pathToLogFile, 'clearActionsTable', error, '');
  }
};

export const clearRoutesTables = async () => {
  const queries = [
    'DELETE FROM tasks',
    'DELETE FROM  geoobjects',
    'DELETE FROM  tasks_orders',
    'DELETE FROM  tasks_geoobjects',
    'DELETE FROM  contractors_has_geoobjects',
  ];

  try {
    for (let i = 0; i < queries.length; i++) {
      await executeQuery(queries[i], []);
    }
  } catch (error) {
    let date = getDateTime();
    saveToLogFile(date, pathToLogFile, 'clearRoutesTables', error, '');
  }
};
