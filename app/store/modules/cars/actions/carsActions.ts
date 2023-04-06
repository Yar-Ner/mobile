import {AnyAction, Dispatch} from 'redux';
import {authApi} from '../../../../services/api/auth-api';
import ErrorAlert from '../../../../components/ErrorAlert/ErorAlert';
import {saveToLogFile} from '../../../../utils/saveLogs';
import {pathToLogFile} from '../../../../../App';
import {setLoadingActionCreator} from '../../../actionCreators/uiActionCreators';
import {
  getCarsActionCreator,
  saveCarActionCreator,
  updateCarWeightActionCreator,
  updateLoadedCarWeighActionCreator, updateOdometerActionCreator,
} from '../../../actionCreators/carsActionCreators';
import {saveCarInStorage} from '../../../../services/storage';
import {getDateTime} from '../../../../services/sync/sync';
import {Car} from '../../../../types';

export const getCars = (token: string) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      dispatch(setLoadingActionCreator(true));
      const cars = await authApi.getUserCars(token);
      dispatch(getCarsActionCreator(cars));
      dispatch(setLoadingActionCreator(false));
    } catch (error) {
      dispatch(setLoadingActionCreator(false));
      let datetime = getDateTime();
      saveToLogFile(datetime, pathToLogFile, 'getCars', error, '');
      ErrorAlert('Произошла ошибка при получении списка машин!');
    }
  };
};

export const saveCar = (token: string, car: Car) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      dispatch(setLoadingActionCreator(true));
      await saveCarInStorage(car);
      dispatch(saveCarActionCreator(car));
      dispatch(setLoadingActionCreator(false));
    } catch (error) {
      dispatch(setLoadingActionCreator(false));
      let datetime = getDateTime();
      saveToLogFile(datetime, pathToLogFile, 'getCars', error, '');
      ErrorAlert('Произошла ошибка при получении списка машин!');
    }
  };
};

export const setCarWeight = (carWeight: number) => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(updateCarWeightActionCreator(carWeight));
  };
};
export const setLoadedCarWeight = (loadedCarWeight: number) => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(updateLoadedCarWeighActionCreator(loadedCarWeight));
  };
};


export const setOdometerValue = (odometer: number) => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(updateOdometerActionCreator(odometer));
  };
};
