import {AnyAction, combineReducers} from 'redux';
import {userReducer} from './modules/user/reducers/userReducer';
import {uiReducer} from './modules/ui/reducers/uiReducer';
import {tasksReducer} from './modules/tasks/reducers/tasksReducer';
import {syncReducer} from './modules/sync/reducers/syncReducer';
import {settingsReducer} from './modules/settings/reducers/settingsReducer';
import {photosReducer} from './modules/photos/reducers/photosReducer';
import {carsReducer} from './modules/cars/reducers/carsReducer';
import {alarmsReducer} from './modules/alarms/reducers/alarmsReducer';

const appReducer = combineReducers({
  userState: userReducer,
  uiState: uiReducer,
  tasksState: tasksReducer,
  syncState: syncReducer,
  settingsState: settingsReducer,
  photosState: photosReducer,
  carsState: carsReducer,
  alarmsState: alarmsReducer,
});

const rootReducer = (state: any, action: AnyAction) => {
  const {type, payload} = action;
  console.log('payload:', payload);

  switch (type) {
    case 'LOG_OUT':
      return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
