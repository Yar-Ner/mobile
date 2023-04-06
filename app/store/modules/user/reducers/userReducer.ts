import {AnyAction} from 'redux';

const initialState = {
  user: {
    id: 0,
    username: '',
    token: '',
    fullname: '',
  },
  targetAddress: {
    lat: 0,
    lon: 0,
  },
  userPosition: {
    lat: 0,
    lon: 0,
    accuracy: 0,
    speed: 0,
    altitude: 0,
    direction: 0,
    distance: 0,
  },
};

export const userReducer = (state = initialState, action: AnyAction) => {
  const {payload, type} = action;
  switch (type) {
    case 'LOG_IN':
      return {
        ...state,
        user: payload.user,
      };
    case 'SET_USER_POSITION':
      return {
        ...state,
        userPosition: payload.userPosition,
      };
    case 'SET_TARGET_ADDRESS':
      return {
        ...state,
        targetAddress: payload.targetAddress,
      };
    default:
      return state;
  }
};
