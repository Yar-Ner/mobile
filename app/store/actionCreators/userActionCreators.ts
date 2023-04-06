import {User, UserPositionType, TargetAddressType} from '../../types';

export const logInActionCreator = (user: User) => {
  return {
    type: 'LOG_IN',
    payload: {user: user},
  };
};
export const logOutActionCreator = () => {
  return {
    type: 'LOG_OUT',
  };
};

export const getDriverNameActionCreator = (name: string) => {
  return {
    type: 'GET_DRIVER_NAME',
    payload: {driverName: name},
  };
};

export const setUserPositionActionCreator = (position: UserPositionType) => {
  return {
    type: 'SET_USER_POSITION',
    payload: {
      userPosition: {
        lat: position.lat,
        lon: position.lon,
        accuracy: position.accuracy,
        altitude: position.altitude,
        distance: position.distance,
        speed: position.speed,
        direction: position.direction,
      },
    },
  };
};

export const setTargetAddressActionCreator = (
  targetAddress: TargetAddressType,
) => {
  return {
    type: 'SET_TARGET_ADDRESS',
    payload: {
      targetAddress: targetAddress,
    },
  };
};
