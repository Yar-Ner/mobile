import React, {useEffect, useState} from 'react';
import {
  FlatList,
  PermissionsAndroid,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import OrderCardStyles from './OrderCard.styles';
import {AppColors} from '../../theme';
import {
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import ErrorAlert from '../ErrorAlert/ErorAlert';
// @ts-ignore
import {AddPhotoIcon} from '../../../assets/icons/AddPhotoIcon/AddPhotoIcon';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store/store';

import {
  addAction,
  getContainersFromActionsDB,
} from '../../services/database/actions-db';
import {getCompletedOrders} from '../../services/database/tasks-db';
import {getPhotosFromDB, savePhotoDB} from '../../services/database/photos-db';
import {removePhotoFromDBByID} from '../../services/database/photos-db';
import {OrderStatuses} from '../../utils/statuses';
import Device from 'react-native-device-detection';
import PhotoButton from '../PhotoButton/PhotoButton';
import ConfirmButton from '../ConfirmButton/ConfirmButton';
import PhotoCard from '../PhotoCard/PhotoCard';
import AddressText from '../AddressText/AddressText';
import {
  ContainerType,
  //ContainerType,
  CurrentAddressType,
  PayLoadType,
  Photo,
  ResponseContainerType,
  //ResponseContainerType,
  ResponsePhoto,
  SettingsType,
  UserPositionType,
} from '../../types';
import {photosApi} from '../../services/api/photos-api';
import {API_URL} from '../../services/api/api';
import {getTime} from '../../services/sync/sync';
import {
  DropDownComponent,
  DropDownComponentDataType,
} from '../DropDownComponent/DropDownComponent';
import {
  addContainer,
  setCurrentAddress,
} from '../../store/modules/tasks/actions/tasksActions';
import DialogModal from '../DialogModal/DialogModal';
import ChooseModal from '../ChooseModal/ChooseModal';
import PhotosModal from '../PhotosModal/PhotosModal';

type OrderCardType = {
  id: number;
  typeOfOrder: string;
  weight: number;
  volume: number;
  handleOrderComplete: Function;
  selectedId: number | undefined;
  addressId?: number;
  assignId?: number;
  assignStarted: boolean;
  assignFinished: boolean;
  navigation: any;
  checkInRadius: Function;
  extendedRadius: number;
  startTime: string;
  endTime: string;
  status: string;
  payload?: PayLoadType;
  isInRadius: boolean;
  addressName: string;
  address: string | undefined;
  addressLat: number | null;
  addressLong: number | null;
  arrivalTime: string;
  departureTime: string;
};

export const OrderCard: React.FC<OrderCardType> = ({
  id,
  typeOfOrder,
  weight,
  volume,
  payload,
  handleOrderComplete,
  selectedId,
  addressId,
  assignId,
  assignStarted,
  assignFinished,
  navigation,
  checkInRadius,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  extendedRadius,
  startTime,
  endTime,
  status,
  addressName,
  address,
  addressLat,
  addressLong,
  isInRadius,
  arrivalTime,
  departureTime,
}) => {
  const [isChooseTypeOfPhotoRecording, setIsChooseTypeOfPhotoRecording] =
    useState(false);
  const [isShowAddPhotoPhoneModal, setIsShowAddPhotoPhoneModal] =
    useState(false);
  const [isCloseOrder, setIsCloseOrder] = useState(false);
  const [complitingOrder, setComplitingOrder] = useState(false);
  const photosFromState = useSelector<RootState, Array<Photo>>(
    state => state.photosState.photos,
  );
  const settings = useSelector<RootState, SettingsType>(
    state => state.settingsState.settings,
  );
  const token = useSelector<RootState, string>(
    state => state.userState.user.token,
  );
  const currentAddress = useSelector<RootState, CurrentAddressType>(
    state => state.tasksState.currentAddress,
  );
  const carId = useSelector<RootState, number | null>(
    state => state.carsState.car.id,
  );
  const carType = useSelector<RootState, number | null>(
    state => state.carsState.car.type,
  );
  const containers = useSelector<RootState, Array<ResponseContainerType>>(
    state => state.carsState.car.containers,
  );
  const [photos, setPhotos] = useState<Array<Photo>>(photosFromState);
  const [containersState, setContainersState] =
    useState<Array<DropDownComponentDataType>>();
  const [changeContainerValue, setChangeContainerValue] = useState('');
  const [containerValue, setContainerValue] = useState('');
  const [photosCounter, setPhotosCounter] = useState(0);
  const userPosition = useSelector<RootState, UserPositionType>(
    state => state.userState.userPosition,
  );

  const dispatch = useDispatch();

  let photosForTask = photos.filter(photo => photo.taskId === assignId);

  const libraryOptions: ImageLibraryOptions = {
    mediaType: 'photo',
    includeBase64: false,
    quality: 0.4,
    maxWidth: 1200,
    maxHeight: 600,
    selectionLimit: 0,
  };

  const cameraOptions: CameraOptions = {
    saveToPhotos: true,
    mediaType: 'photo',
    includeBase64: false,
    quality: 0.4,
    maxWidth: 1200,
    maxHeight: 600,
  };

  useEffect(() => {
    checkInRadius(
      id,
      assignId,
      currentAddress,
      assignStarted,
      assignFinished,
      startTime,
      endTime,
      arrivalTime,
      departureTime,
    );
  }, [
    startTime,
    endTime,
    id,
    currentAddress,
    isInRadius,
    assignStarted,
    assignFinished,
    assignId,
    arrivalTime,
    departureTime,
  ]);

  useEffect(() => {
    setContainersState([
      ...containers.map(container => ({
        label: container.name,
        value: container.id.toString(),
      })),
    ]);
  }, []);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getContainersFromActionsDB(addressId || 0, id).then(results => {
        if (results.length) {
          let bunker = results.find(
            container => container.bunker_type === 'bunker',
          );
          let changeContainer = results.find(
            container => container.bunker_type === 'change',
          );

          setContainerValue(bunker.bunker_value);
          setChangeContainerValue(changeContainer.bunker_value);
        } else {
          setContainerValue(payload?.hopper || '');
          setChangeContainerValue(payload?.replacement_hopper || '');
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, []);

  const getPhotos = async (
    order_id: number,
    _addressId: number,
    taskId: number,
  ) => {
    let result: Array<Photo> = [];
    let filteredResult: Array<Photo> = [];
    try {
      const photosResponse = await photosApi.getPhotos(token, order_id);
      const _photos: Array<ResponsePhoto> = photosResponse.data;
      const responsePhotosIds: Array<number | undefined> = [];

      for (const photo of _photos) {
        if (photo.id !== undefined) {
          await savePhotoDB({
            id: photo.id.toString(),
            addressId: _addressId,
            taskId,
            orderId: order_id,
            uri: `${API_URL}${photo.url}`,
          });
          responsePhotosIds.push(photo.id);
        }
      }
      result = await getPhotosFromDB(taskId, _addressId, order_id);
      filteredResult = result.filter(photo => {
        if (photo.id !== undefined) {
          return (
            responsePhotosIds.indexOf(parseInt(photo.id)) === -1 &&
            photo.orderId === order_id &&
            photo.addressId === addressId
          );
        }
      });
      if (!filteredResult.length) {
        filteredResult = result;
      }
    } catch (error) {
      result = await getPhotosFromDB(taskId, _addressId, order_id);
      filteredResult = result.filter(
        photo =>
          photo.id !== photo.responseId &&
          photo.orderId === order_id &&
          photo.addressId === _addressId,
      );
    }
    return filteredResult;
  };

  const getCompletedStatus = async (
    order_id: number,
    address_id: number,
    task_id: number,
  ) => {
    return await getCompletedOrders(order_id, address_id, task_id);
  };
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (status === OrderStatuses.done) {
        setComplitingOrder(true);
        completeOrder(id, false, true);
      } else {
        getCompletedStatus(id, addressId || 0, assignId || 0).then(result => {
          if (result.length) {
            setComplitingOrder(true);
            completeOrder(id, true, false);
          }
        });
      }
    }
    return () => {
      mounted = false;
    };
  }, [dispatch, addressId, assignId, id, status]);

  useEffect(() => {
    let mounted = true;
    if (addressId !== undefined && assignId !== undefined && mounted) {
      getPhotos(id, addressId, assignId).then(result => setPhotos(result));
    }

    return () => {
      mounted = false;
    };
  }, [id, addressId, assignId, status, addressId]);

  const makePhoto = () => {
    if (!assignStarted) {
      ErrorAlert('Вы не начали выполнение маршрута!');
      return;
    }

    if (
      assignStarted &&
      currentAddress.addressId !== addressId &&
      !settings.executeTaskSettings.arbitraryExecutionTasks
    ) {
      ErrorAlert('Вы выполняете другое задание!');
      return;
    }

    if (
      assignStarted &&
      currentAddress.addressId !== addressId &&
      currentAddress.taskId !== assignId &&
      !settings.executeTaskSettings.arbitraryExecutionTasks
    ) {
      ErrorAlert('Вы выполняете другой маршрутный лист!');
      return;
    }
    if (
      assignStarted &&
      !isInRadius &&
      !settings.geoSettings.allowPhotoOutSideGeo
    ) {
      ErrorAlert('Вы Находитесь вне радиуса!');
      return;
    }

    if (Device.isTablet) {
      setIsChooseTypeOfPhotoRecording(true);
    } else {
      setIsShowAddPhotoPhoneModal(true);
    }
  };

  const closeOrder = () => {
    if (!assignStarted) {
      ErrorAlert('Вы не начали выполнение маршрута!');
      return;
    }
    if (
      assignStarted &&
      currentAddress.addressId !== addressId &&
      currentAddress.taskId !== assignId &&
      !settings.executeTaskSettings.arbitraryExecutionTasks
    ) {
      ErrorAlert('Вы выполняете другое задание!');
      return;
    }
    if (id === selectedId || (assignStarted && !isInRadius)) {
      ErrorAlert('Вы Находитесь вне радиуса!');
      return;
    }

    if (settings.executeTaskSettings.arbitraryExecutionTasks) {
      dispatch(setCurrentAddress(assignId || -1, addressId || -1));
    }
    setIsCloseOrder(true);
  };

  const getStoragePermissions = async () => {
    let result: boolean;
    try {
      const writeGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Приложение МАКРАБ запрашивает доступ к хранилищу',
          message: 'Приложение МАКРАБ запрашивает разрешение на запись файлов',
          buttonNeutral: 'Спросить позже',
          buttonNegative: 'Отмена',
          buttonPositive: 'OK',
        },
      );
      const readGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Приложение МАКРАБ запрашивает доступ к хранилищу',
          message: 'Приложение МАКРАБ запрашивает доступ к хранилищу',
          buttonNeutral: 'Спросить позже',
          buttonNegative: 'Отмена',
          buttonPositive: 'OK',
        },
      );
      result =
        writeGranted === PermissionsAndroid.RESULTS.GRANTED &&
        readGranted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      result = false;
    }
    return result;
  };

  const chooseFromGallery = async () => {
    if (photosForTask?.length > 10) {
      ErrorAlert('Вы не можете выбрать больше 10 фото');
      return;
    }
    await launchImageLibrary(libraryOptions, response => {
      if (response.didCancel) {
        ErrorAlert('Вы отменили выбор фото');
      } else if (response.errorCode === 'camera_unavailable') {
        ErrorAlert('Камера недоступна');
      } else if (response.errorCode === 'permission') {
        ErrorAlert('Не был получен доступ к камере');
      } else if (response.errorCode === 'others') {
        ErrorAlert(`Произошла ошибка ${response.errorMessage}`);
      } else {
        let tempPhotos: Array<Photo> = [];
        response.assets?.forEach(asset => {
          let photo: Photo = {
            id: asset.fileName,
            taskId: assignId,
            addressId: addressId,
            orderId: id,
            uri: asset.uri,
          };
          tempPhotos.push(photo);
          if (Device.isTablet && photo.uri?.length && photo.id?.length) {
            savePhotoDB(photo).then(() => {});
            let time = getTime();
            addAction({
              type: 'location',
              time: time,
              taskId: assignId,
              orderId: id,
              vehicleId: carId || 0,
              addressId: addressId,
              lat: userPosition.lat,
              long: userPosition.lon,
              speed: userPosition.speed !== null ? userPosition.speed : 0,
              direction:
                userPosition.direction !== null ? userPosition.direction : 0,
              distance: userPosition.distance,
              accuracy: userPosition.accuracy,
              altitude:
                userPosition.altitude !== null ? userPosition.altitude : 0,
              status: 'photo',
              synced: 'false',
            });
            addAction({
              type: 'photo',
              time: time,
              taskId: photo.taskId,
              addressId: photo.addressId,
              orderId: id,
              uri: photo.uri,
              photoId: photo.id,
              vehicleId: carId || 0,
              synced: 'false',
            });
          }
        });
        setPhotosCounter(tempPhotos.length);
        setPhotos(photos.concat(tempPhotos));
      }
    });
  };
  const openCamera = async () => {
    let hasStoragePermissions = await getStoragePermissions();
    if (hasStoragePermissions) {
      await launchCamera(cameraOptions, response => {
        if (response.didCancel) {
          ErrorAlert('Вы отменили съемку');
        } else if (response.errorCode === 'camera_unavailable') {
          ErrorAlert('Камера недоступна');
        } else if (response.errorCode === 'permission') {
          ErrorAlert('Не был получен доступ к камере');
        } else if (response.errorCode === 'others') {
          ErrorAlert(`Произошла ошибка ${response.errorMessage}`);
        } else {
          let tempPhotos: Array<Photo> = [];
          response.assets?.forEach(asset => {
            let photo: Photo = {
              id: asset.fileName,
              taskId: assignId,
              addressId: addressId,
              orderId: id,
              uri: asset.uri,
            };
            tempPhotos.push(photo);
            if (Device.isTablet && photo.uri?.length && photo.id?.length) {
              savePhotoDB(photo).then(() => {});
              let time = getTime();
              addAction({
                type: 'location',
                time: time,
                taskId: assignId,
                orderId: id,
                addressId: addressId,
                vehicleId: carId || 0,
                lat: userPosition.lat,
                long: userPosition.lon,
                speed: userPosition.speed !== null ? userPosition.speed : 0,
                direction:
                  userPosition.direction !== null ? userPosition.direction : 0,
                distance: userPosition.distance,
                accuracy: userPosition.accuracy,
                altitude:
                  userPosition.altitude !== null ? userPosition.altitude : 0,
                status: 'photo',
                synced: 'false',
              });
              addAction({
                type: 'photo',
                time: time,
                taskId: photo.taskId,
                addressId: photo.addressId,
                orderId: id,
                uri: photo.uri,
                photoId: photo.id,
                vehicleId: carId || 0,
                synced: 'false',
              });
            }
          });
          setPhotosCounter(tempPhotos.length);
          setPhotos(photos.concat(tempPhotos));
        }
      });
    } else {
      ErrorAlert('Вы не дали доступ к хранилищу файлов');
    }
  };

  const takePicture = async () => {
    if (photosForTask?.length > 10) {
      ErrorAlert('Вы не можете выбрать больше 10 фото');
      return;
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          buttonNegative: 'Отмена',
          buttonNeutral: 'Спросить позже',
          buttonPositive: 'ОК',
          title: 'Makrab',
          message: 'Makrab требуется доступ к вашей камере',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await openCamera();
      } else {
        ErrorAlert('Доступ к местоположению запрещен');
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const removePhoto = (
    photoId: string | number | undefined,
    uri: string | undefined,
  ) => {
    if (complitingOrder) {
      ErrorAlert('Вы не можете удалить фото!');
      return;
    }
    removePhotoFromDBByID(photoId, addressId, assignId, id).catch(error =>
      console.log('remove photo error:', error),
    );
    setPhotos(photosForTask?.filter(image => image.uri !== uri));
    handleOrderComplete(id, 'removed');
  };

  const getTypeOrder = (type: string) => {
    switch (type) {
      case 'deliver':
        return 'Доставить';
      case 'delivergrab':
        return 'Доставить и вывезти';
      case 'grabdeliver':
        return 'Вывезти и доставить';
      case 'change':
        return 'Заменить';
      case 'grab':
        return 'Забрать';
      case 'transportation':
        return 'Транспортировка';
    }
  };
  const completeOrder = (
    orderId: number,
    fromDB: boolean = false,
    fromServer: boolean = false,
  ) => {
    if (
      settings?.completeTaskSettings.closeTaskWithoutPhotos &&
      assignStarted
    ) {
      let time = getTime();
      addAction({
        type: 'location',
        time: time,
        taskId: assignId,
        orderId: orderId,
        vehicleId: carId || 0,
        addressId: addressId,
        lat: userPosition.lat,
        long: userPosition.lon,
        speed: userPosition.speed !== null ? userPosition.speed : 0,
        direction: userPosition.direction !== null ? userPosition.direction : 0,
        distance: userPosition.distance,
        accuracy: userPosition.accuracy,
        altitude: userPosition.altitude !== null ? userPosition.altitude : 0,
        status: 'closed_order',
        synced: 'false',
      });
      handleOrderComplete(orderId, assignId, 'finished', isInRadius, fromDB);
      //setOrderClosed(true);
      return;
    } else if (fromServer) {
      handleOrderComplete(
        orderId,
        assignId,
        'finished',
        isInRadius,
        fromDB,
        fromServer,
      );
      //setOrderClosed(true);
      return;
    } else if (fromDB) {
      handleOrderComplete(
        orderId,
        assignId,
        'finished',
        isInRadius,
        fromDB,
        fromServer,
      );
      //setOrderClosed(true);
      return;
    } else if (
      photosForTask?.length < 2 &&
      !settings.completeTaskSettings.closeTaskWithoutPhotos
    ) {
      ErrorAlert(
        'Для подтверждения выполнения вам нужно загрузить не менее 2х фото!',
      );
      return;
    } else if (assignStarted) {
      let time = getTime();
      addAction({
        type: 'location',
        time: time,
        taskId: assignId,
        orderId: orderId,
        vehicleId: carId || 0,
        addressId: addressId,
        lat: userPosition.lat,
        long: userPosition.lon,
        speed: userPosition.speed !== null ? userPosition.speed : 0,
        direction: userPosition.direction !== null ? userPosition.direction : 0,
        distance: userPosition.distance,
        accuracy: userPosition.accuracy,
        altitude: userPosition.altitude !== null ? userPosition.altitude : 0,
        status: 'closed_order',
        synced: 'false',
      });
      handleOrderComplete(
        orderId,
        assignId,
        'finished',
        isInRadius,
        fromDB,
        fromServer,
      );
      //setOrderClosed(true);
      return;
    } else {
      ErrorAlert('Вы не начали маршрут!');
      return;
    }
  };

  const handleClosePhotoModal = () => setIsChooseTypeOfPhotoRecording(false);
  const handleCloseSuccessAddPhotoModal = () => {
    let time = getTime();
    addAction({
      type: 'location',
      time: time,
      taskId: assignId,
      orderId: id,
      addressId: addressId,
      vehicleId: carId || 0,
      lat: userPosition.lat,
      long: userPosition.lon,
      speed: userPosition.speed !== null ? userPosition.speed : 0,
      direction: userPosition.direction !== null ? userPosition.direction : 0,
      distance: userPosition.distance,
      accuracy: userPosition.accuracy,
      altitude: userPosition.altitude !== null ? userPosition.altitude : 0,
      status: 'photo',
      synced: 'false',
    });
    photos.forEach(photo => {
      addAction({
        type: 'photo',
        time: time,
        taskId: photo.taskId,
        addressId: photo.addressId,
        orderId: id,
        uri: photo.uri,
        photoId: photo.id,
        vehicleId: carId || 0,
        synced: 'false',
      });
      savePhotoDB(photo).then(() => {});
    });
    setIsShowAddPhotoPhoneModal(false);
  };

  const handleCloseAddPhotoModal = () => {
    setPhotos(photos.slice(0, photos.length - photosCounter));
    setIsShowAddPhotoPhoneModal(false);
  };

  const getStylesForSuccessButton = () => {
    if (
      id === selectedId &&
      settings?.completeTaskSettings.closeTaskWithoutPhotos &&
      assignStarted &&
      isInRadius
    ) {
      return OrderCardStyles.buttonSuccessContainer;
    }

    if (
      (id === selectedId && assignStarted) ||
      (id === selectedId && assignFinished)
    ) {
      return OrderCardStyles.buttonSuccessContainer;
    }

    if (
      settings?.completeTaskSettings.closeTaskWithoutPhotos &&
      assignStarted &&
      isInRadius
    ) {
      return OrderCardStyles.buttonActiveContainer;
    }

    if (
      photosForTask?.length < 2 &&
      !settings?.completeTaskSettings.closeTaskWithoutPhotos &&
      assignStarted
    ) {
      return OrderCardStyles.buttonSuccessContainerInactive;
    }

    if (photosForTask?.length >= 2 && assignStarted) {
      return OrderCardStyles.buttonActiveContainer;
    }

    if (assignStarted && complitingOrder) {
      return OrderCardStyles.buttonSuccessContainer;
    }
    if (assignFinished && complitingOrder) {
      return OrderCardStyles.buttonSuccessContainer;
    }

    return OrderCardStyles.buttonContainer;
  };

  const getIconColorSuccessButton = () => {
    if (
      id === selectedId &&
      settings?.completeTaskSettings.closeTaskWithoutPhotos &&
      assignStarted &&
      isInRadius
    ) {
      return AppColors.Success;
    }

    if (
      (id === selectedId && assignStarted) ||
      (id === selectedId && assignFinished)
    ) {
      return AppColors.Success;
    }

    if (
      photosForTask?.length < 2 &&
      !settings?.completeTaskSettings.closeTaskWithoutPhotos &&
      assignStarted
    ) {
      return AppColors.InactiveButton;
    }

    if (photosForTask?.length >= 2 && assignStarted && !complitingOrder) {
      return AppColors.Active;
    }

    if (assignStarted && complitingOrder) {
      return AppColors.Success;
    }

    if (assignFinished && complitingOrder) {
      return AppColors.Success;
    }

    return AppColors.TaskColor;
  };

  const getStyleForContainer = () => {
    if (id === selectedId && photosForTask?.length >= 2 && assignStarted) {
      return OrderCardStyles.taskContainerCompleted;
    }

    if (
      id === selectedId &&
      settings?.completeTaskSettings.closeTaskWithoutPhotos &&
      assignStarted
    ) {
      return OrderCardStyles.taskContainerCompleted;
    }

    if (id === selectedId && photosForTask?.length >= 2 && assignFinished) {
      return OrderCardStyles.taskContainerCompleted;
    }

    if (assignStarted && complitingOrder) {
      return OrderCardStyles.taskContainerCompleted;
    }

    if (assignFinished && complitingOrder) {
      return OrderCardStyles.taskContainerCompleted;
    }

    if (
      assignStarted &&
      !settings?.executeTaskSettings.arbitraryExecutionTasks &&
      currentAddress.addressId === addressId &&
      currentAddress.taskId === assignId
    ) {
      return OrderCardStyles.taskContainerActive;
    }

    return OrderCardStyles.taskContainer;
  };

  const getStylesForPhotoButtonContainer = () => {
    if (
      assignStarted &&
      settings?.completeTaskSettings.closeTaskWithoutPhotos &&
      complitingOrder
    ) {
      return OrderCardStyles.buttonSuccessContainer;
    }

    if (
      assignFinished &&
      settings?.completeTaskSettings.closeTaskWithoutPhotos &&
      complitingOrder
    ) {
      return OrderCardStyles.buttonSuccessContainer;
    }

    if (id === selectedId && photosForTask?.length >= 2 && assignStarted) {
      return OrderCardStyles.buttonSuccessContainer;
    }

    if (
      id === selectedId &&
      settings?.completeTaskSettings.closeTaskWithoutPhotos &&
      assignStarted
    ) {
      return OrderCardStyles.buttonSuccessContainer;
    }

    if (
      settings?.completeTaskSettings.closeTaskWithoutPhotos &&
      assignStarted &&
      isInRadius
    ) {
      return OrderCardStyles.buttonActiveContainer;
    }

    if (
      id === selectedId &&
      settings?.completeTaskSettings.closeTaskWithoutPhotos &&
      assignStarted &&
      isInRadius
    ) {
      return OrderCardStyles.buttonActiveContainer;
    }

    if (id === selectedId && photosForTask?.length >= 2 && assignFinished) {
      return OrderCardStyles.buttonSuccessContainer;
    }

    if (assignStarted && complitingOrder) {
      return OrderCardStyles.buttonSuccessContainer;
    }

    if (assignFinished && complitingOrder) {
      return OrderCardStyles.buttonSuccessContainer;
    }

    return OrderCardStyles.buttonContainer;
  };

  const getColorForPhotoButtonIcon = () => {
    if (
      assignStarted &&
      settings?.completeTaskSettings.closeTaskWithoutPhotos &&
      complitingOrder
    ) {
      return AppColors.Success;
    }

    if (
      assignFinished &&
      settings?.completeTaskSettings.closeTaskWithoutPhotos &&
      complitingOrder
    ) {
      return AppColors.Success;
    }

    if (id === selectedId && photosForTask?.length >= 2 && assignStarted) {
      return AppColors.Success;
    }

    if (
      id === selectedId &&
      settings?.completeTaskSettings.closeTaskWithoutPhotos &&
      assignStarted
    ) {
      return AppColors.Success;
    }

    if (id === selectedId && photosForTask?.length >= 2 && assignFinished) {
      return AppColors.Success;
    }
    if (assignStarted && complitingOrder) {
      return AppColors.Success;
    }

    if (assignFinished && complitingOrder) {
      return AppColors.Success;
    }

    return AppColors.TaskColor;
  };

  const showOnMap = (latitude: number | null, longitude: number | null) => {
    if (latitude === null || longitude === null) {
      navigation.navigate('HomeScreen', {
        screen: 'MapScreen',
        params: {lat: 0, lon: 0},
      });
    }

    navigation.navigate('HomeScreen', {
      screen: 'MapScreen',
      params: {lat: latitude, lon: longitude},
    });
  };

  const getStyleForTaskTitle = () => {
    if (id === selectedId && photosForTask?.length >= 2 && assignStarted) {
      return OrderCardStyles.taskTitleSuccess;
    }

    if (
      id === selectedId &&
      settings?.completeTaskSettings.closeTaskWithoutPhotos &&
      assignStarted
    ) {
      return OrderCardStyles.taskTitleSuccess;
    }

    if (
      assignStarted &&
      !settings?.executeTaskSettings.arbitraryExecutionTasks &&
      currentAddress.addressId === addressId &&
      currentAddress.taskId === assignId
    ) {
      return OrderCardStyles.taskTitleActive;
    }

    return OrderCardStyles.taskTitle;
  };

  const getStyleForPhotoCounter = () => {
    if (id === selectedId && photosForTask?.length >= 2 && assignStarted) {
      return OrderCardStyles.photoCounterSuccessText;
    }
    if (
      id === selectedId &&
      settings?.completeTaskSettings.closeTaskWithoutPhotos &&
      assignStarted
    ) {
      return OrderCardStyles.photoCounterSuccessText;
    }

    if (id === selectedId && photosForTask?.length >= 2 && assignFinished) {
      return OrderCardStyles.photoCounterSuccessText;
    }

    return OrderCardStyles.photoCounterText;
  };

  const handleContainerItem = (item: DropDownComponentDataType) => {
    let container: ContainerType = {
      addressId: addressId || 0,
      orderId: id,
      value: item.value,
    };
    let time = getTime();
    dispatch(addContainer(container));
    addAction({
      type: 'container',
      time: time,
      taskId: assignId,
      addressId: addressId,
      orderId: id,
      bunkerValue: +item.value,
      bunkerType: 'bunker',
      synced: 'false',
    });
  };

  const handleContainerForChangeItem = (item: DropDownComponentDataType) => {
    let containerForChange: ContainerType = {
      addressId: addressId || 0,
      orderId: id,
      value: item.value,
    };
    let time = getTime();
    dispatch(addContainer(containerForChange));
    addAction({
      type: 'container',
      time: time,
      taskId: assignId,
      addressId: addressId,
      orderId: id,
      bunkerValue: +item.value,
      bunkerType: 'change',
      synced: 'false',
    });
  };

  // @ts-ignore
  return (
    <View style={getStyleForContainer()}>
      <View style={OrderCardStyles.hr} />
      <View style={OrderCardStyles.content}>
        <View style={OrderCardStyles.taskInfo}>
          <View style={OrderCardStyles.taskInfoTop}>
            <View style={OrderCardStyles.taskHeader}>
              <View style={OrderCardStyles.titleContainer}>
                <Text style={getStyleForTaskTitle()}>{addressName}</Text>
                {Device.isTablet && (
                  <Text style={{color: AppColors.TaskColor}}>
                    {payload?.cargo_type || 'груз неопределен'}
                  </Text>
                )}
              </View>
              <View style={OrderCardStyles.addressContainer}>
                <AddressText
                  text={address}
                  showOnMap={showOnMap}
                  lat={addressLat}
                  lon={addressLong}
                />
              </View>
            </View>
            <View style={OrderCardStyles.typeOfOrder}>
              <Text style={OrderCardStyles.typeOfOrderText}>
                {getTypeOrder(typeOfOrder)}
              </Text>
              {!Device.isTablet && (
                <Text style={OrderCardStyles.typeOfOrderSubText}>
                  {payload?.cargo_type || 'груз неопределен'}
                </Text>
              )}
              {(carType === 1 || carType === 2 || carType === 3) &&
                containersState !== undefined && (
                  <View style={OrderCardStyles.dropDownsContainer}>
                    <DropDownComponent
                      initialValue={containerValue}
                      disable={!assignStarted}
                      onChange={handleContainerItem}
                      data={containersState}
                      label="Бункер"
                    />
                    <DropDownComponent
                      initialValue={changeContainerValue}
                      disable={!assignStarted}
                      onChange={handleContainerForChangeItem}
                      data={containersState}
                      label="Бункер для замены"
                    />
                  </View>
                )}
            </View>
          </View>
          <View style={OrderCardStyles.taskInfoMain}>
            <View style={OrderCardStyles.measureContainer}>
              <View style={OrderCardStyles.numberOfMeasure}>
                <Text>{weight != null ? weight : volume}</Text>
              </View>
              <View>
                <Text style={OrderCardStyles.measureText}>
                  {weight != null ? 'кг' : 'м3'}
                </Text>
              </View>
            </View>
            <View style={OrderCardStyles.photoContainer}>
              <PhotoButton
                makePhoto={makePhoto}
                isDisabled={assignFinished || complitingOrder}
                photoCounter={photosForTask?.length}
                containerStyle={getStylesForPhotoButtonContainer()}
                iconColor={getColorForPhotoButtonIcon()}
                photoCounterStyle={getStyleForPhotoCounter()}
              />
              {Device.isTablet ? (
                <FlatList
                  style={OrderCardStyles.imagesContainer}
                  data={photos}
                  horizontal={true}
                  renderItem={({item, index}) => (
                    <PhotoCard
                      key={index}
                      id={item.id}
                      photoURI={item.uri}
                      removePhoto={removePhoto}
                    />
                  )}
                />
              ) : (
                <View style={{width: 30}} />
              )}
              <ConfirmButton
                closeOrder={closeOrder}
                isDisabled={assignFinished || complitingOrder}
                containerStyle={getStylesForSuccessButton()}
                iconColor={getIconColorSuccessButton()}
              />
            </View>
          </View>
        </View>
      </View>
      <ChooseModal
        title="Выберите вариант фотофиксации"
        isVisible={isChooseTypeOfPhotoRecording}
        handleClose={handleClosePhotoModal}>
        <TouchableOpacity
          style={OrderCardStyles.buttonModalContainer}
          onPress={() => {
            setIsChooseTypeOfPhotoRecording(false);
            chooseFromGallery();
          }}>
          <Text style={OrderCardStyles.buttonModalText}>
            Выбрать из галереи
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={OrderCardStyles.buttonModalContainer}
          onPress={() => {
            setIsChooseTypeOfPhotoRecording(false);
            takePicture();
          }}>
          <Text style={OrderCardStyles.buttonModalText}>Сделать снимок</Text>
        </TouchableOpacity>
      </ChooseModal>
      <PhotosModal
        title={addressName}
        data={photosForTask}
        isVisible={isShowAddPhotoPhoneModal}
        isTablet={Device.isTablet}
        acceptButtonText="Готово"
        cancelButtonText="Отмена"
        handleClose={handleCloseAddPhotoModal}
        removePhoto={removePhoto}
        onPressAcceptButton={handleCloseSuccessAddPhotoModal}
        onPressDeclineButton={handleCloseAddPhotoModal}
        onPressAddButton={() => {
          setIsChooseTypeOfPhotoRecording(true);
        }}
      />
      <DialogModal
        title={`Вы уверены что хотите\n закрыть задание?`}
        acceptButtonText="Да"
        declineButtonText="Нет"
        isVisible={isCloseOrder}
        handleClose={() => setIsCloseOrder(false)}
        onPressAcceptButton={() => {
          setIsCloseOrder(false);
          completeOrder(id);
        }}
        onPressDeclineButton={() => setIsCloseOrder(false)}
      />
    </View>
  );
};
