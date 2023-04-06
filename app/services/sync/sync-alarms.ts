import {saveToLogFile} from '../../utils/saveLogs';
import {pathToLogFile} from '../../../App';
import {ToastAndroid} from 'react-native';
import {
  getAlarmsFromAction,
  updateAlarmsFromActionDB,
} from '../database/actions-db';
import {alarmsApi} from '../api/alarms-api';
import {getDateTime} from './sync';

export const syncAlarms = async (
  token: string,
  prevDate: string = '',
  date: string = '',
) => {
  try {
    let alarms;
    if (prevDate.length && date.length) {
      alarms = await getAlarmsFromAction(prevDate, date);
    } else {
      alarms = await getAlarmsFromAction();
    }
    for (let i = 0, len = alarms.length; i < len; i++) {
      if (
        alarms[i].vehicle_id !== 0 &&
        alarms[i].alarm_id !== 0 &&
        alarms[i].location_id !== 0
      ) {
        await alarmsApi.sendAlarm(
          token,
          alarms[i].vehicle_id,
          alarms[i].alarm_id,
          alarms[i].location_id,
          0,
        );
        await updateAlarmsFromActionDB(
          alarms[i].vehicle_id,
          alarms[i].alarm_id,
        );
      }
    }
    return 1;
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(
      datetime,
      pathToLogFile,
      `Error while sync alarms in method syncAlarms. ${error}`,
    );
    saveToLogFile(datetime, pathToLogFile, 'syncAlarms', error, '');
    ToastAndroid.showWithGravity(
      'Произошла ошибка при синхронизции!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    return -1;
  }
};
