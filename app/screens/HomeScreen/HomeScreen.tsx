import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  PermissionsAndroid,
  SafeAreaView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import HomeScreenStyles from './HomeScreen.styles';
import {SelectedAssignType} from '../../components/Assign/Assign';
import {HomeNavigationProps} from '../../navigation/utils/NavigationProps';
import {useNavigation, useRoute} from '@react-navigation/native';
import {AppColors} from '../../theme';
import {useDispatch, useSelector} from 'react-redux';
import TopTabNavigator from '../../navigation/TopTabNavigator';
import {QualityNetworkIcon, ReloadIconMini} from '../../../assets/icons';
import ErrorAlert from '../../components/ErrorAlert/ErorAlert';
import Geolocation from 'react-native-geolocation-service';
import {
  addAction,
  getCarWeightsFromActionById,
} from '../../services/database/actions-db';
import store, {RootState} from '../../store/store';
import WarningAlert from '../../components/WarningAlert/WarningAlert';
// @ts-ignore
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {TaskStatuses} from '../../utils/statuses';
import OneSignal from 'react-native-onesignal';
import Device from 'react-native-device-detection';
import {pathToLogFile} from '../../../App';
import {saveToLogFile} from '../../utils/saveLogs';
import {
  AlarmType,
  Car,
  CompletedAddressType,
  OrderType,
  SettingsType,
  TaskType,
  UserPositionType,
} from '../../types';
import {
  setAttemptToCloseOrder,
  setSettings,
} from '../../store/modules/settings/actions/settingsActions';
import {
  setShowMobileSideBar,
  updateMessageCounter,
} from '../../store/modules/ui/actions/uiActions';
import {syncWithServer} from '../../store/modules/sync/actions/syncActions';
import {
  getDate,
  getDateTime,
  getTime,
  getTimeWithoutSeconds,
} from '../../services/sync/sync';
import {
  getTasks,
  setSelectedTask,
} from '../../store/modules/tasks/actions/tasksActions';
import {setUserPosition} from '../../store/modules/user/actions/userActions';
import {getAlarms} from '../../store/modules/alarms/actions/alarmsActions';
import {syncApi} from '../../services/api/sync-api';
import {alarmsApi} from '../../services/api/alarms-api';
// @ts-ignore
import HasHms from 'react-native-has-hms';
import useInterval from '../../hooks/useInterval';
import {getDistance} from 'geolib';
import RNLocation, {Subscription} from 'react-native-location';
import {WeightInput} from '../../components/WeightInput/WeightInput';
import {isCurrentAddressLast} from '../../utils/isCurrentAddressLast';
import SuccessModal from '../../components/SuccessModal/SuccessModal';
import AlarmsModal from '../../components/AlarmsModal/AlarmsModal';
import InputModal from '../../components/InputModal/InputModal';
import TabletStackNavigator from '../../navigation/TabletStackNavigator';
import {AlarmButton} from '../../components/AlarmButton/AlarmButton';
import TaskList from '../../components/TaskList/TaskList';

export const HomeScreen: React.FC = () => {
  const route = useRoute<HomeNavigationProps>();
  const navigation = useNavigation();
  const isShowMobileSideBar = useSelector<RootState, boolean>(
    state => state.uiState.showMobileSideBar,
  );
  const token = useSelector<RootState, string>(
    state => state.userState.user.token,
  );
  const isStartSynced = useSelector<RootState, boolean>(
    state => state.syncState.isStartSynced,
  );
  const tasks = useSelector<RootState, Array<TaskType>>(
    state => state.tasksState.tasks,
  );
  const car = useSelector<RootState, Car>(state => state.carsState.car);
  const syncTime = useSelector<RootState, string>(
    state => state.syncState.syncTime,
  );
  const settings = useSelector<RootState, SettingsType>(
    state => state.settingsState.settings,
  );
  const alarms = useSelector<RootState, Array<AlarmType>>(
    state => state.alarmsState.alarms,
  );
  const completedAddresses = useSelector<
    RootState,
    Array<CompletedAddressType>
  >(state => state.tasksState.completedAddresses);

  const dispatch = useDispatch();
  const [selectedAssign, setSelectedAssign] = useState<TaskType>({
    id: 0,
    ext_id: '',
    addresses: [],
    comment: '',
    empty_weight: 0,
    endtime: '',
    loaded_weight: 0,
    number: '',
    starttime: '',
    status: '',
    updated: '',
    vehicles_id: '',
  });
  const [isShowAlarms, setIsShowAlarms] = useState(false);
  const [visibleSuccess, setVisibleSuccess] = useState(false);
  const endWeightInitialState = {
    assignId: 0,
    value: '0',
  };
  const [endLoadedCarWeight, setEndLoadedCarWeight] = useState(
    endWeightInitialState,
  );
  const [endEmptyCarWeight, setEndEmptyCarWeight] = useState(
    endWeightInitialState,
  );

  const [emptyWeightCarTextError, setEmptyWeightCarTextError] = useState('');
  const [loadedWeightCarTextError, setLoadedWeightCarTextError] = useState('');

  const [isShowChangeEmptyCarWeightModal, showChangeEmptyCarWeightModal] =
    useState(false);
  const [isShowChangeLoadedCarWeightModal, showChangeLoadedCarWeightModal] =
    useState(false);

  const [showScreen, setShowScreen] = useState(false);
  const userPosition = useSelector<RootState, UserPositionType>(
    state => state.userState.userPosition,
  );

  const [hmsIsAvailable, setHmsIsAvailable] = useState(false);
  const [hasGMSLocationPermission, setGMSLocationPermission] = useState(false);
  const watchID = useRef(0);
  const hmsWatchID = useRef<Subscription>();
  const taskStatus = useRef(TaskStatuses.done);

  const [strength, setStrength] = useState(3);

  //get tasks from api
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      dispatch(getTasks(token));
      setSettings(token);
    }
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    if (car.id !== 0 && mounted) {
      dispatch(setAttemptToCloseOrder(settings.geoSettings.countOfAttempt));
    }
    return () => {
      mounted = false;
    };
  }, [car.id, dispatch, settings.geoSettings.countOfAttempt, token]);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      ReactNativeForegroundService.start({
        id: 144,
        title: 'Макраб',
        message: 'Приложение работает в фоновом режиме',
      });
    }
    return () => {
      mounted = false;
    };
  }, []);

  OneSignal.setNotificationOpenedHandler(notification => {
    console.log('OneSignal: notification opened:', notification);
    dispatch(updateMessageCounter(0));
    // @ts-ignore
    navigation.navigate('ChatScreen');
  });

  const hasGoogleMobileServices = async () => {
    return await HasHms.isGMSAvailable();
  };

  useEffect(() => {
    hasGoogleMobileServices().then((isAvailable: boolean) => {
      if (isAvailable) {
        requestGMSLocationPermission().catch(error => {
          let date = getDateTime();
          saveToLogFile(
            date,
            pathToLogFile,
            'requestGMSLocationPermission',
            error,
            '',
          );
        });
      } else {
        setHmsIsAvailable(true);
      }
    });
  }, []);

  useEffect(() => {
    if (hmsIsAvailable) {
      RNLocation.configure({
        distanceFilter: 1, // Meters
        desiredAccuracy: {
          ios: 'best',
          android: 'highAccuracy',
        },
        //@ts-ignore
        androidProvider: 'standard',
        interval: 5000, // Milliseconds
        fastestInterval: 2000, // Milliseconds
        maxWaitTime: 5000, // Milliseconds
      });

      RNLocation.requestPermission({
        ios: 'always', // or 'always'
        android: {
          detail: 'fine', // or 'fine'
          rationale: {
            title: 'We need to access your location',
            message: 'We use your location to show where you are on the map',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          },
        },
      }).then(granted => {
        if (granted) {
          getHMSLocationUpdates(car.id);
        }
      });
    }
  }, [hmsIsAvailable]);

  useInterval(
    () => {
      let time = getTimeWithoutSeconds();
      dispatch(syncWithServer(time, token));
    },
    settings.commonSettings.updateTime >= 10000
      ? settings.commonSettings.updateTime
      : 120000,
  );

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      calculatePackageWeightFromAssign(selectedAssign);
    }
    return () => {
      mounted = false;
    };
  }, [selectedAssign]);

  const requestGMSLocationPermission = async () => {
    try {
      const grantedPermissions = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      ]);
      if (
        grantedPermissions['android.permission.ACCESS_FINE_LOCATION'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        grantedPermissions['android.permission.ACCESS_BACKGROUND_LOCATION']
      ) {
        setGMSLocationPermission(true);
      } else {
        ErrorAlert('Доступ к местоположению запрещен');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    if (hasGMSLocationPermission) {
      getGMSLocationUpdates(car.id);
    }
  }, [hasGMSLocationPermission]);

  const saveToActionsUserPosition = (
    position: UserPositionType,
    taskStatus: string,
    taskId: number,
    addressId: number,
    carId: number,
  ) => {
    let time = getTime();
    let datetime = getDateTime();
    addAction({
      type: 'location',
      time: time,
      taskId: taskStatus === TaskStatuses.process ? taskId : 0,
      addressId:
        taskStatus === TaskStatuses.process &&
        !isCurrentAddressLast(taskId, completedAddresses)
          ? addressId
          : 0,
      vehicleId: carId,
      lat: position.lat,
      long: position.lon,
      speed: position.speed !== null ? position.speed : 0,
      direction: position.direction !== null ? position.direction : 0,
      distance: position.distance,
      accuracy: position.accuracy,
      altitude: position.altitude !== null ? position.altitude : 0,
      status: taskStatus,
      synced: 'false',
    });
    saveToLogFile(
      datetime,
      pathToLogFile,
      'setUserPosition',
      '',
      JSON.stringify(position),
    );
  };

  const getGMSLocationUpdates = (_carId: number | null) => {
    watchID.current = Geolocation.watchPosition(
      position => {
        let currentTaskId = store.getState().tasksState.currentTaskId;
        let currentAddress = store.getState().tasksState.currentAddress;
        taskStatus.current =
          currentTaskId !== null && currentTaskId !== -1
            ? TaskStatuses.process
            : TaskStatuses.done;
        if (
          _carId !== null &&
          getDistance(
            {latitude: userPosition.lat, longitude: userPosition.lon},
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          ) > 0
        ) {
          dispatch(
            setUserPosition({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
              accuracy: position.coords.accuracy,
              speed: position.coords.speed,
              altitude: position.coords.altitude,
              distance: 2,
              direction: position.coords.heading,
            }),
          );
          saveToActionsUserPosition(
            {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
              accuracy: position.coords.accuracy,
              speed: position.coords.speed,
              altitude: position.coords.altitude,
              distance: 2,
              direction: position.coords.heading,
            },
            taskStatus.current,
            currentTaskId,
            currentAddress.addressId,
            _carId,
          );
        }
      },
      error => {
        let date = getDateTime();
        // See error code charts below.
        saveToLogFile(date, pathToLogFile, 'getGMSLocationsUpdates', error, '');
      },
      {
        accuracy: {android: 'high'},
        enableHighAccuracy: true,
        distanceFilter: 1,
        forceRequestLocation: true,
        interval: 5000,
        fastestInterval: 2000,
      },
    );
  };

  const getHMSLocationUpdates = (_carId: number | null) => {
    hmsWatchID.current = RNLocation.subscribeToLocationUpdates(locations => {
      let currentTaskId = store.getState().tasksState.currentTaskId;
      let currentAddress = store.getState().tasksState.currentAddress;
      taskStatus.current =
        currentTaskId !== null && currentTaskId !== -1
          ? TaskStatuses.process
          : TaskStatuses.done;
      console.log('get hms location, status:', taskStatus.current);
      if (
        _carId !== null &&
        getDistance(
          {latitude: userPosition.lat, longitude: userPosition.lon},
          {latitude: locations[0].latitude, longitude: locations[0].longitude},
        ) > 0
      ) {
        dispatch(
          setUserPosition({
            lat: locations[0].latitude,
            lon: locations[0].longitude,
            accuracy: locations[0].accuracy,
            speed: locations[0].speed,
            altitude: locations[0].altitude,
            distance: 2,
            direction: locations[0].course,
          }),
        );
        saveToActionsUserPosition(
          {
            lat: locations[0].latitude,
            lon: locations[0].longitude,
            accuracy: locations[0].accuracy,
            speed: locations[0].speed,
            altitude: locations[0].altitude,
            distance: 2,
            direction: 5,
          },
          taskStatus.current,
          currentTaskId,
          currentAddress.addressId,
          _carId,
        );
      }
    });
  };

  useEffect(() => {
    if (!settings.executeTaskSettings.arbitraryExecutionTasks) {
      WarningAlert(
        'Активирована настройка выполнения заданий по порядку! ' +
          'Выполняйте задания по порядку, чтобы они были зафиксированы',
      );
    }
  }, [settings.executeTaskSettings.arbitraryExecutionTasks]);

  useEffect(() => {
    if (userPosition.accuracy < 20) {
      setStrength(3);
    } else if (userPosition.accuracy >= 20 && userPosition.accuracy < 500) {
      setStrength(2);
    } else if (userPosition.accuracy > 500) {
      setStrength(1);
    }
  }, [userPosition.accuracy]);
  useEffect(() => {
    const timer = setInterval(() => {
      setShowScreen(true);
    }, 3000);
    return () => clearInterval(timer);
  });
  //
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getCarWeightsFromActionById(selectedAssign.id).then(result => {
        if (result.length) {
          setEndEmptyCarWeight({
            assignId: selectedAssign.id,
            value: result[result.length - 1].empty_car_weight.toString(),
          });
          setEndLoadedCarWeight({
            assignId: selectedAssign.id,
            value: result[result.length - 1].loaded_car_weight.toString(),
          });
        } else {
          setEndEmptyCarWeight({
            assignId: selectedAssign.id,
            value: '0',
          });
          setEndLoadedCarWeight({
            assignId: selectedAssign.id,
            value: '0',
          });
        }
      });
    }

    return () => {
      mounted = false;
    };
  }, [selectedAssign]);

  const hideMobileSideBar = () => {
    dispatch(setShowMobileSideBar(false));
  };

  //
  const handleSelectAssign = (task: SelectedAssignType) => {
    setSelectedAssign(task);
    hideMobileSideBar();
    dispatch(setSelectedTask(task));
    // @ts-ignore
    navigation.navigate('TaskScreen');
  };

  const handleSelectedAlarm = async (alarm?: AlarmType) => {
    setIsShowAlarms(false);
    try {
      if (car.id === null || alarm === undefined) {
        ToastAndroid.showWithGravity(
          'Не удалось отправить тревогу!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        return;
      }
      let time = getTime();
      let date = getDate();
      let locationRequestId = await syncApi.syncLocation(
        token,
        selectedAssign.id,
        car.id,
        `${date} ${time}`,
        userPosition.lat,
        userPosition.lon,
        userPosition.speed || 0,
        userPosition.direction || 0,
        userPosition.altitude || 0,
        userPosition.accuracy,
        userPosition.distance,
      );
      let locationId = locationRequestId;
      await alarmsApi.sendAlarm(token, car.id, alarm.id, locationId, 0);
      await addAction({
        type: 'alarm',
        time: time,
        vehicleId: car.id,
        alarmId: alarm.id,
        locationId: locationId,
        synced: 'false',
      });
      setVisibleSuccess(true);
    } catch (error) {
      ToastAndroid.showWithGravity(
        'Не удалось отправить тревогу!',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };
  const handleCloseSuccessModal = () => {
    setVisibleSuccess(false);
  };

  const calculatePackageWeightFromAssign = (assign: TaskType): string => {
    let weight: number = 0;
    if (assign.addresses !== undefined) {
      // @ts-ignore
      let orders = [].concat(...assign.addresses.map(item => item.orders));

      orders.forEach((item: OrderType) => {
        weight += item.weight;
      });
      return weight.toFixed(1);
    }
    return weight.toString();
  };

  const calculateVariance = (
    loadedCarWeight: number,
    carWeight: number,
    packageWeight: number,
  ) => {
    let variance = (loadedCarWeight - carWeight - packageWeight).toFixed(2);
    return parseFloat(variance) < 0 ? 0 : parseFloat(variance);
  };
  const renderSyncStatus = (_syncTime: string, _isStartSync: boolean) => {
    if (!_isStartSync) {
      let time = '';
      if (_syncTime === 'Не удалось синхронизировать') {
        time = _syncTime;
      } else if (_syncTime.length) {
        time = `синхронизировано в ${_syncTime}`;
      }

      return (
        <View style={HomeScreenStyles.syncStatusContainer}>
          <Text
            style={[
              HomeScreenStyles.syncStatusTextError,
              _syncTime !== 'Не удалось синхронизировать' &&
                HomeScreenStyles.syncStatusText,
            ]}>
            {time}
          </Text>
        </View>
      );
    } else if (_isStartSync) {
      return (
        <View style={HomeScreenStyles.syncStatusContainer}>
          <Text style={HomeScreenStyles.syncStatusText}>синхронизация</Text>
          <ReloadIconMini />
        </View>
      );
    } else {
      return <View />;
    }
  };

  const handleCloseShowChangeEmptyCarWeightModal = (value: string) => {
    if (isNaN(parseFloat(value))) {
      setEmptyWeightCarTextError('Введенное значение не число');
      return;
    }

    if (!selectedAssign) {
      WarningAlert('Вы не можете изменить значение! Выберите МЛ');
      return;
    }
    setEndEmptyCarWeight({
      assignId: selectedAssign.id,
      value: value,
    });
    setEmptyWeightCarTextError('');
    let time = getTime();
    addAction({
      type: 'change_weights',
      time: time,
      taskId: selectedAssign.id,
      vehicleId: car.id || 0,
      emptyCarWeight: parseFloat(value),
      loadedCarWeight: parseFloat(endLoadedCarWeight.value),
      taskExtId: selectedAssign.ext_id,
      status: selectedAssign.status,
      synced: 'false',
    });
    showChangeEmptyCarWeightModal(false);
  };

  const handleCloseShowLoadedChangeCarWeightModal = (value: string) => {
    if (isNaN(parseFloat(value))) {
      setLoadedWeightCarTextError('Введенное значение не число');
      return;
    }

    if (!selectedAssign) {
      WarningAlert('Вы не можете изменить значение! Выберите МЛ');
      return;
    }
    setEndLoadedCarWeight({
      assignId: selectedAssign.id,
      value: value,
    });
    setLoadedWeightCarTextError('');
    let time = getTime();
    addAction({
      type: 'change_weights',
      time: time,
      taskId: selectedAssign.id,
      vehicleId: car.id || 0,
      emptyCarWeight: parseFloat(endEmptyCarWeight.value),
      loadedCarWeight: parseFloat(value),
      taskExtId: selectedAssign.ext_id,
      status: selectedAssign.status,
      synced: 'false',
    });
    showChangeLoadedCarWeightModal(false);
  };

  const buildLayout = (isTablet: boolean) => {
    if (!isTablet) return <TopTabNavigator />;

    return (
      <View style={HomeScreenStyles.content}>
        {route.params?.screen !== 'MapScreen' && (
          <View style={HomeScreenStyles.tabletSideBar}>
            <TaskList
              data={tasks}
              selectedTask={selectedAssign}
              onSelect={handleSelectAssign}
            />
            <AlarmButton
              onPress={() => {
                dispatch(getAlarms(token));
                setIsShowAlarms(true);
              }}
            />
          </View>
        )}
        <TabletStackNavigator />
      </View>
    );
  };

  return (
    <SafeAreaView style={HomeScreenStyles.SafeArea}>
      {!showScreen ? (
        <ActivityIndicator
          size="large"
          color={AppColors.Red}
          style={HomeScreenStyles.assignsLoader}
        />
      ) : (
        <>
          {!Device.isTablet && (
            <View
              style={
                isShowMobileSideBar
                  ? HomeScreenStyles.phoneSideBarContainer
                  : HomeScreenStyles.hiddenMobileSideBar
              }>
              <View style={HomeScreenStyles.phoneSideBar}>
                <TaskList
                  data={tasks}
                  selectedTask={selectedAssign}
                  onSelect={handleSelectAssign}
                />
                <AlarmButton
                  onPress={() => {
                    dispatch(getAlarms(token));
                    setIsShowAlarms(true);
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() => hideMobileSideBar()}
                style={HomeScreenStyles.phoneSideBarOverlay}
              />
            </View>
          )}
          {buildLayout(Device.isTablet)}
          <View style={HomeScreenStyles.footer}>
            <View
              style={[
                HomeScreenStyles.footerLine,
                HomeScreenStyles.footerWeightLine,
              ]}>
              <WeightInput
                label="Груженый"
                disable={true}
                value={
                  selectedAssign.loaded_weight
                    ? selectedAssign.loaded_weight
                    : 0
                }
              />
              <WeightInput
                label="Пустой"
                disable={true}
                value={
                  selectedAssign.empty_weight ? selectedAssign.empty_weight : 0
                }
              />
              <WeightInput label="Чистый" disable={true} value={0} />
            </View>
            <View style={HomeScreenStyles.footerLine}>
              <WeightInput
                label="Груженый"
                disable={false}
                value={endLoadedCarWeight.value}
                onPress={() => {
                  showChangeLoadedCarWeightModal(true);
                }}
              />
              <WeightInput
                label="Пустой"
                disable={false}
                value={endEmptyCarWeight.value}
                onPress={() => showChangeEmptyCarWeightModal(true)}
              />
            </View>
            <View style={HomeScreenStyles.footerLine}>
              <WeightInput
                label="Груз"
                disable={true}
                textColor={AppColors.ButtonTextColor}
                value={calculatePackageWeightFromAssign(selectedAssign)}
              />
              <WeightInput
                label="Расхождение"
                textColor={AppColors.Red}
                disable={true}
                value={calculateVariance(
                  +endLoadedCarWeight.value,
                  +endEmptyCarWeight.value,
                  parseFloat(calculatePackageWeightFromAssign(selectedAssign)),
                )}
              />
            </View>
            <View style={HomeScreenStyles.footerLine}>
              <View>
                <QualityNetworkIcon
                  width={Device.isTablet ? 51 : 34}
                  height={Device.isTablet ? 16 : 20}
                  signal={strength}
                />
              </View>
              {renderSyncStatus(syncTime, isStartSynced)}
            </View>
          </View>
          <SuccessModal
            title="Тревога зафиксирована"
            description="В ближайшее время с вами свяжется логист"
            isVisible={visibleSuccess}
            handleClose={handleCloseSuccessModal}
          />
          <InputModal
            title="Ввод веса груженого автомобиля"
            keyBoardType="numeric"
            isVisible={isShowChangeLoadedCarWeightModal}
            inputError={loadedWeightCarTextError}
            handleClose={() => showChangeLoadedCarWeightModal(false)}
            submitValue={value =>
              handleCloseShowLoadedChangeCarWeightModal(value)
            }
          />
          <InputModal
            title="Ввод веса порожнего автомобиля"
            keyBoardType="numeric"
            isVisible={isShowChangeEmptyCarWeightModal}
            inputError={emptyWeightCarTextError}
            handleClose={() => showChangeEmptyCarWeightModal(false)}
            submitValue={value =>
              handleCloseShowChangeEmptyCarWeightModal(value)
            }
          />
          <AlarmsModal
            title="Что произошло?"
            data={alarms}
            isVisible={isShowAlarms}
            handleSelected={handleSelectedAlarm}
            handleClose={() => setIsShowAlarms(false)}
          />
        </>
      )}
    </SafeAreaView>
  );
};
