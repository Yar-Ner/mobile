import {AnyAction} from 'redux';
import {SettingsStateType} from '../../../../types';

const initialState: SettingsStateType = {
  settings: {
    commonSettings: {
      updateTime: 120000,
      phone: '+79111234567',
    },
    executeTaskSettings: {
      arbitraryExecutionTasks: true,
      chooseWeightTare: false,
    },
    completeTaskSettings: {
      closeTaskWithoutPhotos: false,
      allOrdersComplete: false,
    },
    geoSettings: {
      geoRadius: 5,
      fixTime: 1000,
      countOfAttempt: 3,
      countOfAttemptForCheckingInRadius: 3,
      accuracy: 20,
      allowPhotoOutSideGeo: false,
    },
  },
  attemptsToCloseOrder: 3,
};

export const settingsReducer = (state = initialState, action: AnyAction) => {
  const {payload, type} = action;
  switch (type) {
    case 'SET_SETTINGS':
      return {
        ...state,
        settings: payload.settings,
      };
    case 'SET_ATTEMPT_TO_CLOSE_ORDER':
      return {
        ...state,
        attemptsToCloseOrder: payload.attemptsToCloseOrder,
      };
    default:
      return state;
  }
};
