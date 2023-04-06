import {syncApi} from '../api/sync-api';
import {getDateTime} from './sync';
import {saveToLogFile} from '../../utils/saveLogs';
import {pathToLogFile} from '../../../App';
import {ToastAndroid} from 'react-native';
import {ResponseSettingsType} from '../../types';
import store from '../../store/store';
import {getSettingsFromStorage} from '../storage';
import {getSettingsActionFromDB, updateSettingsStatusInActions} from "../database/actions-db";

export const syncSettings = async (token: string) => {
  try {
    let settings = await getSettingsFromStorage();
    let settingsActions = await getSettingsActionFromDB();
    let sendingSettings: Array<ResponseSettingsType> = [];
    let userId = store.getState().userState.user.id;
    if (settingsActions.length) {
        for (let key in settings) {
            for (let subKey in settings[key]) {
                let item: ResponseSettingsType = {} as ResponseSettingsType;
                item.handle = subKey;
                item.val = typeof settings[key][subKey] === 'boolean' ?  JSON.stringify(+settings[key][subKey]) : JSON.stringify(settings[key][subKey]);
                item.main = false;
                sendingSettings.push(item);
            }
        }
        await syncApi.sendSettings(token, userId, sendingSettings);
        await updateSettingsStatusInActions();
    }
    return 1;
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(datetime, pathToLogFile, 'syncSettings', error, '');
    ToastAndroid.showWithGravity(
      'Произошла ошибка при синхронизции!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    return -1;
  }
};
