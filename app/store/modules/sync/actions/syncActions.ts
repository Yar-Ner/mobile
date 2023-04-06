import {saveToLogFile} from '../../../../utils/saveLogs';
import {pathToLogFile} from '../../../../../App';
import {
  setStartSyncActionCreator,
  setSyncTimeActionCreator,
} from '../../../actionCreators/syncActionCreators';
import {getTasks} from '../../tasks/actions/tasksActions';
import {getAlarms} from '../../alarms/actions/alarmsActions';
import {getDateTime, syncActions} from '../../../../services/sync/sync';
import {setSettings} from '../../settings/actions/settingsActions';

const setSyncTimeToFailed = (dispatch: any) => {
  dispatch(setStartSyncActionCreator(true));
  dispatch(setSyncTimeActionCreator('Не удалось синхронизировать'));
  dispatch(setStartSyncActionCreator(false));
};

export const syncWithServer = (time: string, token: string) => {
  return async (dispatch: any) => {
    try {
      let datetime = getDateTime();
      saveToLogFile(datetime, pathToLogFile, '', '', 'Start sync with server');
      dispatch(setStartSyncActionCreator(true));
      let resultsOfSyncActions = await syncActions(token);
      if (resultsOfSyncActions.indexOf(-1) !== -1) {
        setSyncTimeToFailed(dispatch);
        return;
      }
      let getDataResults = await Promise.all([
        dispatch(getTasks(token)),
        dispatch(getAlarms(token)),
        dispatch(setSettings(token)),
      ]);
      if (getDataResults.indexOf(-1) !== -1) {
        setSyncTimeToFailed(dispatch);
        return;
      }
      dispatch(setStartSyncActionCreator(false));
      dispatch(setSyncTimeActionCreator(time));
    } catch (error) {
      let datetime = getDateTime();
      saveToLogFile(datetime, pathToLogFile, 'syncWithServer', error);
      dispatch(setSyncTimeActionCreator('Не удалось синхронизировать'));
      dispatch(setStartSyncActionCreator(false));
    }
  };
};

/*export const startSyncWithInterval = (
  updateTime: number,
  dispatch: any,
  token: string,
) => {
  return async (dispatch: any) => {
    try {
      let datetime = getDateTime();
      saveToLogFile(
        datetime,
        pathToLogFile,
        '',
        '',
        'Synchronization with the server at intervals',
      );
      console.log('start syncing');
      dispatch(setStartSyncActionCreator(true));
      let date = new Date().toLocaleTimeString();
      let prevDate = new Date(
        new Date().getTime() - (updateTime || 0),
      ).toLocaleTimeString();
      let result = await syncActions(token, prevDate, date);
      if (result?.indexOf(-1) !== -1) {
        dispatch(setStartSyncActionCreator(true));
        dispatch(setSyncTimeActionCreator('Не удалось синхронизировать'));
        return;
      }
      dispatch(getTasks(token));
      dispatch(getAlarms(token));
      await getSettingsFromStorage();
      dispatch(setStartSyncActionCreator(false));
      dispatch(setSyncTimeActionCreator(getTimeWithoutSeconds()));
    } catch (error) {
      let datetime = getDateTime();
      saveToLogFile(datetime, pathToLogFile, 'startSyncWithInterval', error);
      dispatch(setSyncTimeActionCreator('Не удалось синхронизировать'));
    }
  };
};*/
