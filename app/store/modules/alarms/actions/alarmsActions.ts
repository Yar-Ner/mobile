import {AnyAction, Dispatch} from 'redux';
import {alarmsApi} from '../../../../services/api/alarms-api';
import {
  getAlarmsFromDB,
  saveAlarm,
} from '../../../../services/database/alarms-db';
import {setAlarmsActionCreator} from '../../../actionCreators/alarmsActionCreators';
import {saveToLogFile} from '../../../../utils/saveLogs';
import {pathToLogFile} from '../../../../../App';
import ErrorAlert from '../../../../components/ErrorAlert/ErorAlert';
import {getDateTime} from '../../../../services/sync/sync';

export const getAlarms = (token: string) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      let alarms = await alarmsApi.getAlarms(token);
      for (const alarm of alarms) {
        await saveAlarm(alarm.id, alarm.name, alarm.type, alarm.icon);
      }
      let result = await getAlarmsFromDB();
      dispatch(setAlarmsActionCreator(result));
      return 1;
    } catch (error) {
      let datetime = getDateTime();
      let result = await getAlarmsFromDB();
      dispatch(setAlarmsActionCreator(result));
      saveToLogFile(datetime, pathToLogFile, 'getAlarms', error, '');
      ErrorAlert('Произошла ошибка при получении списка тревог!');
      return -1;
    }
  };
};
