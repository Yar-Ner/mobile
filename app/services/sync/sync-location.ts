import {saveToLogFile} from '../../utils/saveLogs';
import {pathToLogFile} from '../../../App';
import {ToastAndroid} from 'react-native';
import {
  getLocationsFromActionDB,
  updateLocationFromActionDB,
} from '../database/actions-db';
import {syncApi} from '../api/sync-api';
import {getDateTime} from './sync';

export const syncLocationsFromDb = async (
  token: string,
  prevDate: string = '',
  date: string = '',
) => {
  try {
    let locations;
    if (prevDate.length && date.length) {
      locations = await getLocationsFromActionDB(prevDate, date);
    } else {
      locations = await getLocationsFromActionDB();
    }

    for (const location of locations) {
      let datetime = `${location?.date} ${location?.time}`;
      await syncApi.syncLocation(
          token,
          location.task_id,
          location.vehicle_id,
          datetime,
          location.lat,
          location.long,
          location.speed,
          location.direction,
          location.altitude,
          location.accuracy,
          location.distance,
      );
      await updateLocationFromActionDB(location.vehicle_id, location.task_id);
    }
    return 1;
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(datetime, pathToLogFile, 'syncLocationFromDB', error, '');
    ToastAndroid.showWithGravity(
      'Произошла ошибка при синхронизции!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    return -1;
  }
};
