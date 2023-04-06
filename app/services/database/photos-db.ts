import {ToastAndroid} from 'react-native';
import {saveToLogFile} from '../../utils/saveLogs';
import {pathToLogFile} from '../../../App';
import {Photo} from '../../types';
import {executeQuery} from './db';
import {getDateTime} from '../sync/sync';

export const savePhotosDB = async (photos: Array<Photo>) => {
  let query =
    'INSERT  OR REPLACE INTO photos (id, order_id, uri, task_id, address_id) VALUES (?, ?, ?, ?, ?)';

  try {
    for (const photo of photos) {
      await executeQuery(query, [
        photo.id,
        photo.orderId,
        photo.uri,
        photo.taskId,
        photo.addressId,
      ]);
    }
  } catch (error) {
    let date = getDateTime();
    saveToLogFile(date, pathToLogFile, 'savePhotosDB', error, '');
  }
};

export const savePhotoDB = async (photo: Photo) => {
  let query =
    'INSERT  OR REPLACE INTO photos (id, order_id, uri, task_id, address_id) VALUES (?, ?, ?, ?, ?)';

  try {
    await executeQuery(query, [
      photo.id,
      photo.orderId,
      photo.uri,
      photo.taskId,
      photo.addressId,
    ]);
  } catch (error) {
    let date = getDateTime();
    ToastAndroid.showWithGravity(
      'Произошла ошибка при записи в таблицу photos!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    saveToLogFile(
      date,
      pathToLogFile,
      'saveContractorFromAddressesDB',
      error,
      '',
    );
  }
};

export const getPhotosFromDB = async (
  taskId: number,
  addressId: number,
  orderId: number,
): Promise<Array<Photo>> => {
  const query =
    'SELECT * FROM photos WHERE task_id = ? AND address_id = ? AND order_id = ?';
  let result: Array<Photo> = [];

  try {
    let results = await executeQuery(query, [taskId, addressId, orderId]);
    let rows = results.rows;

    for (let index = 0; index < rows.length; index++) {
      let photo: Photo = {
        id: rows.item(index).id,
        taskId: rows.item(index).task_id,
        addressId: rows.item(index).address_id,
        orderId: rows.item(index).order_id,
        uri: rows.item(index).uri,
        responseId: rows.item(index).response_id,
      };
      result.push(photo);
    }
  } catch (error) {
    let date = getDateTime();
    saveToLogFile(date, pathToLogFile, 'getPhotosFromDB', error, '');
  }

  return result;
};

export const getPhotoResponseIdById = async (photoId: string) => {
  const query = 'SELECT response_id FROM photos WHERE id = ?';
  let results = [];
  try {
    let resultsQuery = await executeQuery(query, [photoId]);
    for (let index = 0; index < resultsQuery.rows.length; index++) {
      results.push(resultsQuery.rows.item(index).response_id);
    }
  } catch (error) {
    let date = getDateTime();
    saveToLogFile(date, pathToLogFile, 'getPhotoResponseIdById', error, '');
  }
  return results;
};

export const updatingPhotosResponseIds = async (
  responseId: number,
  orderId: number,
  taskId: number,
  photo: string,
) => {
  const query =
    'UPDATE photos SET response_id = ? WHERE  order_id = ? AND task_id = ? AND uri = ?';
  try {
    await executeQuery(query, [responseId, orderId, taskId, photo]);
  } catch (error) {
    let date = getDateTime();
    ToastAndroid.showWithGravity(
      'Произошла ошибка при обновлении таблицы photo!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    saveToLogFile(date, pathToLogFile, 'updatingPhotosResponseIds', error, '');
  }
};

export const removePhotoFromDBByID = async (
  photoId: string | undefined | number,
  address_id: number | undefined,
  task_id: number | undefined,
  order_id: number | undefined,
) => {
  try {
    let deletePhotoQuery = 'DELETE FROM photos WHERE id = ?';
    let deleteFromActionTableQuery =
      'DELETE FROM actions WHERE photo_id = ? AND type = "photo" AND address_id = ? AND task_id  = ? AND order_id = ?';
    await executeQuery(deletePhotoQuery, [photoId]);
    if (
      address_id !== undefined &&
      task_id !== undefined &&
      order_id !== undefined
    ) {
      await executeQuery(deleteFromActionTableQuery, [
        photoId,
        address_id,
        task_id,
        order_id,
      ]);
    }
  } catch (error) {
    let date = getDateTime();
    ToastAndroid.showWithGravity(
      'Произошла ошибка при удалении фотографии из базы!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    saveToLogFile(date, pathToLogFile, 'removePhotoFromDBByID', error, '');
  }
};
