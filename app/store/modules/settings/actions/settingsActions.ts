import {AnyAction, Dispatch} from 'redux';
import {SettingsFromSM, SettingsType} from '../../../../types';
import {
  saveSettingsInStorage,
  getSettingsFromStorage,
} from '../../../../services/storage';
import {
  setAttemptsToCloseOrderActionCreator,
  setSettingsActionCreator,
} from '../../../actionCreators/settingsActionCreators';
import {saveToLogFile} from '../../../../utils/saveLogs';
import {pathToLogFile} from '../../../../../App';
import ErrorAlert from '../../../../components/ErrorAlert/ErorAlert';
import {settingsApi} from '../../../../services/api/settings-api';
import {getDateTime, getTime} from '../../../../services/sync/sync';
import {addAction} from '../../../../services/database/actions-db';

export const setSettingsToStorage = (settings: SettingsType) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      dispatch(setSettingsActionCreator(settings));
      await saveSettingsInStorage(settings);
    } catch (error) {
      let datetime = getDateTime();
      saveToLogFile(datetime, pathToLogFile, 'setSettingsToStorage', error, '');
      ErrorAlert('Произошла ошибка!');
    }
  };
};

export const setLocaleSettings = (settings: SettingsType) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      await saveSettingsInStorage(settings);
      let time = getTime();
      await addAction({
        type: 'settings',
        time: time,
        synced: 'false',
      });
      dispatch(setSettingsActionCreator(settings));
    } catch (error) {
      let datetime = getDateTime();
      saveToLogFile(datetime, pathToLogFile, 'setLocaleSettings', error, '');
      ErrorAlert('Произошла ошибка при установке настроек!');
    }
  };
};

export const setSettings = (token: string) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      let settings: SettingsType = {} as SettingsType;
      let responseDefaultSettings = await settingsApi.getUserSettings(token);

      let defaultSettings: Array<SettingsFromSM> = responseDefaultSettings;

      if (!defaultSettings.length) {
        settings = await getSettingsFromStorage();
        if (settings !== undefined) {
          dispatch(setSettingsActionCreator(settings));
        }
        return;
      }
      settings = {
        commonSettings: {
          updateTime: parseInt(
            defaultSettings.find(setting => setting.handle === 'updateTime')
              ?.val || '120000',
            10,
          ),
          carEmptyWeight: parseInt(
            defaultSettings.find(setting => setting.handle === 'carEmptyWeight')
              ?.val || '1000',
            10,
          ),
          phone:
            defaultSettings.find(setting => setting.handle === 'logistPhone')
              ?.val || '+79111234567',
        },
        executeTaskSettings: {
          arbitraryExecutionTasks: Boolean(
            JSON.parse(
              defaultSettings.find(
                setting => setting.handle === 'arbitraryExecutionTasks',
              )?.val || '0',
            ),
          ),
          chooseWeightTare: Boolean(
            JSON.parse(
              defaultSettings.find(
                setting => setting.handle === 'chooseWeightTare',
              )?.val || '0',
            ),
          ),
        },
        completeTaskSettings: {
          closeTaskWithoutPhotos: Boolean(
            JSON.parse(
              defaultSettings.find(
                setting => setting.handle === 'closeTaskWithoutPhotos',
              )?.val || '0',
            ),
          ),
          allOrdersComplete: Boolean(
            JSON.parse(
              defaultSettings.find(
                setting => setting.handle === 'allOrdersComplete',
              )?.val || '0',
            ),
          ),
        },
        geoSettings: {
          geoRadius: parseInt(
            defaultSettings.find(setting => setting.handle === 'geoRadius')
              ?.val || '5',
            10,
          ),
          fixTime: parseInt(
            defaultSettings.find(setting => setting.handle === 'fixTime')
              ?.val || '1000',
            10,
          ),
          countOfAttempt: parseInt(
            defaultSettings.find(setting => setting.handle === 'countOfAttempt')
              ?.val || '3',
            10,
          ),
          countOfAttemptForCheckingInRadius: parseInt(
            defaultSettings.find(
              setting => setting.handle === 'countOfAttemptForCheckingInRadius',
            )?.val || '3',
            10,
          ),
          accuracy: parseInt(
            defaultSettings.find(setting => setting.handle === 'accuracy')
              ?.val || '25',
            10,
          ),
          allowPhotoOutSideGeo: Boolean(
            JSON.parse(
              defaultSettings.find(
                setting => setting.handle === 'AllowPhotoOutSideGeo',
              )?.val || '0',
            ),
          ),
        },
      };
      dispatch(setSettingsActionCreator(settings));
      await saveSettingsInStorage(settings);
    } catch (error) {
      let datetime = getDateTime();
      let settings = await getSettingsFromStorage();
      if (settings !== undefined) {
        dispatch(setSettingsActionCreator(settings));
      }
      ErrorAlert('Произошла ошибка при получении настроек');
      saveToLogFile(datetime, pathToLogFile, 'setSettings', error, '');
      return -1;
    }
  };
};

export const setAttemptToCloseOrder = (attempt: number) => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(setAttemptsToCloseOrderActionCreator(attempt));
  };
};
