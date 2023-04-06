import {AnyAction, Dispatch} from 'redux';
import {authApi} from '../../../../services/api/auth-api';
import ErrorAlert from '../../../../components/ErrorAlert/ErorAlert';
import {saveToLogFile} from '../../../../utils/saveLogs';
import {pathToLogFile} from '../../../../../App';
import {setLoadingActionCreator} from '../../../actionCreators/uiActionCreators';
import {User, UserPositionType} from '../../../../types';
import {
  getDriverFromStorage,
  saveDriverInStorage,
} from '../../../../services/storage';
import {
  getDriverNameActionCreator,
  logInActionCreator,
  logOutActionCreator,
  setTargetAddressActionCreator,
  setUserPositionActionCreator,
} from '../../../actionCreators/userActionCreators';
import {getDateTime} from '../../../../services/sync/sync';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {clearData} from '../../../../services/database/db';
import {setSettings} from '../../settings/actions/settingsActions';

const setDriver = async (
  token: string,
  driver: User,
  dispatch: Dispatch<AnyAction>,
) => {
  try {
    let user = {
      id: driver.id,
      username: driver.username,
      fullname: driver.fullname,
      token: token,
    };
    await saveDriverInStorage(user);
    dispatch(logInActionCreator(user));
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(datetime, pathToLogFile, 'setDriver', error, '');
    ErrorAlert('Произошла ошибка при назначении водителя');
  }
};

export const logIn = (user: string, password: string) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      dispatch(setLoadingActionCreator(true));
      const token = await authApi.getToken(user, password);
      const driver = await authApi.getUserInfo(token);
      await setDriver(token, driver, dispatch);
      setSettings(token);
      //@ts-ignore
      dispatch(setSettings(token));
      dispatch(setLoadingActionCreator(false));
    } catch (error) {
      dispatch(setLoadingActionCreator(false));
      if (error?.response) {
        switch (error.response.status) {
          case 404:
            ErrorAlert('Пользователь с такими данными не найден!');
            return;
          default:
            ErrorAlert('Произошла ошибка при входе!');
            return;
        }
      } else if (error?.request) {
        let datetime = getDateTime();
        saveToLogFile(datetime, pathToLogFile, 'logIn', error, '');
      } else {
        let datetime = getDateTime();
        saveToLogFile(datetime, pathToLogFile, 'logIn', '', 'Network Error');
        ErrorAlert('Произошла ошибка при подлкючении!');
      }
    }
  };
};

export const logOut = () => {
  return async (dispatch: any) => {
    try {
      await clearData();
      const allKeys = await AsyncStorage.getAllKeys();
      for (const key of allKeys) {
        await AsyncStorage.removeItem(key);
      }
      dispatch(logOutActionCreator());
    } catch (error) {
      let datetime = getDateTime();
      saveToLogFile(datetime, pathToLogFile, 'logOut', error, '');
      ErrorAlert('Произошла ошибка при выходе из уч.записи!');
    }
  };
};

export const getDriverName = () => {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      const user = await getDriverFromStorage();
      if (user !== undefined) {
        dispatch(getDriverNameActionCreator(user.fullname));
      }
    } catch (error) {
      let datetime = getDateTime();
      saveToLogFile(datetime, pathToLogFile, 'getDriverName', error, '');
    }
  };
};

export const setUserPosition = (position: UserPositionType) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      dispatch(setUserPositionActionCreator(position));
    } catch (error) {
      let datetime = getDateTime();
      saveToLogFile(datetime, pathToLogFile, 'setUserPosition', error, '');
    }
  };
};

export const setTargetAddress = (lat: number, lon: number) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      let targetAddress = {
        lat: lat,
        lon: lon,
      };
      dispatch(setTargetAddressActionCreator(targetAddress));
    } catch (error) {
      let datetime = getDateTime();
      saveToLogFile(datetime, pathToLogFile, 'setTargetAddress', error, '');
    }
  };
};
