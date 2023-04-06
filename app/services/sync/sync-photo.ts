import {saveToLogFile} from '../../utils/saveLogs';
import {pathToLogFile} from '../../../App';
import {ToastAndroid} from 'react-native';
import {
  getPhotoFromActionDB,
  updatePhotoFromActionDB,
} from '../database/actions-db';
import {
  getPhotoResponseIdById,
  updatingPhotosResponseIds,
} from '../database/photos-db';
import RNFS from 'react-native-fs';
import {getDateTime} from './sync';
import {getPhotoLocationByOrderId} from '../database/locations-db';
import {syncApi} from '../api/sync-api';

const encodeBase64 = async (filePath: string): Promise<string> => {
  let encodedImage = await RNFS.readFile(filePath, 'base64');
  let encodeBase64String = '';

  if (/\.(jpe?g)$/i.test(filePath)) {
    encodeBase64String = `data:image/jpeg;base64,${encodedImage}`;
  } else if (/\.(png)$/i.test(filePath)) {
    encodeBase64String = `data:image/png;base64,${encodedImage}`;
  }
  return encodeBase64String;
};

export const syncPhoto = async (
  token: string,
  prevDate: string = '',
  date: string = '',
) => {
  try {
    let photos;
    if (prevDate.length && date.length) {
      photos = await getPhotoFromActionDB(prevDate, date);
    } else {
      photos = await getPhotoFromActionDB(prevDate);
    }
    let photo = '';
    let locationId = -1;
    let photoAddressId = 0;
    let photoOrderId = 0;
    for (let i = 0, len = photos.length; i < len; i++) {
      let responseIds = await getPhotoResponseIdById(photos[i].photo_id);
      let location = await getPhotoLocationByOrderId(photos[i].order_id);
      let datetime = `${location[0]?.date} ${location[0]?.time}`;
      let locationResponseId = null;
      if (
        photoAddressId !== location[0].address_id &&
        photoOrderId !== location[0].order_id
      ) {
        locationResponseId = await syncApi.syncLocation(
          token,
          location[0].task_id,
          location[0].vehicle_id,
          datetime,
          location[0].lat,
          location[0].long,
          location[0].speed,
          location[0].direction,
          location[0].altitude,
          location[0].accuracy,
          location[0].distance,
        );
        locationId = locationResponseId;
        photoAddressId = photos[i].address_id;
        photoOrderId = photos[i].order_id;
      }
      if (responseIds[0] === null && !photos[i].uri.includes('http')) {
        photo = await encodeBase64(photos[i].uri);
        let photoId = await syncApi.syncPhoto(
          token,
          photos[i].order_id,
          photos[i].vehicle_id,
          locationId,
          photo,
        );
        await updatingPhotosResponseIds(
          photoId,
          photos[i].order_id,
          photos[i].task_id,
          photos[i].uri,
        );
        await updatePhotoFromActionDB(
          photos[i].order_id,
          photos[i].task_id,
          photos[i].address_id,
        );
      }
    }
    return 1;
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(datetime, pathToLogFile, 'syncPhoto', error, '');
    ToastAndroid.showWithGravity(
      'Произошла ошибка при синхронизции!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    return -1;
  }
};
