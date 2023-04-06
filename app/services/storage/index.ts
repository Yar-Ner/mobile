import RNAsyncStorageFlipper from 'rn-async-storage-flipper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {saveToLogFile} from '../../utils/saveLogs';
import {pathToLogFile} from '../../../App';
import ErrorAlert from '../../components/ErrorAlert/ErorAlert';
import {Car, SettingsType, User} from '../../types';
import {getDateTime} from '../sync/sync';

RNAsyncStorageFlipper(AsyncStorage);

export const saveCarInStorage = (car: Car) => {
  return AsyncStorage.setItem('car', JSON.stringify(car));
};

export const saveDriverInStorage = (user: User) => {
  return AsyncStorage.setItem('driver', JSON.stringify(user));
};

export const saveSettingsInStorage = (settings: SettingsType) => {
  return AsyncStorage.setItem('settings', JSON.stringify(settings));
};

export const getDriverFromStorage = (): Promise<User | undefined> => {
  return AsyncStorage.getItem('driver')
    .then(driver => {
      if (typeof driver === 'string') {
        return JSON.parse(driver);
      }
    })
    .catch(error => {
      let datetime = getDateTime();
      saveToLogFile(datetime, pathToLogFile, 'getDriverFromStorage', error, '');
      ErrorAlert(`Произошла ошибка! Код ${error}`);
    });
};

export const getSettingsFromStorage = (): Promise<SettingsType> => {
  return AsyncStorage.getItem('settings')
    .then(settings => {
      if (typeof settings === 'string') {
        return JSON.parse(settings);
      }
    })
    .catch(error => {
      let datetime = getDateTime();
      saveToLogFile(
        datetime,
        pathToLogFile,
        'getSettingsFromStorage',
        error,
        '',
      );
      ErrorAlert(`Произошла ошибка! Код ${error}`);
    });
};
