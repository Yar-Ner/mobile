import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  PermissionsAndroid, ToastAndroid,
} from 'react-native';

import {API_YANDEX_MAP_KEY} from '../../../env';
import {
  YaMap,
  CameraPosition,
  Marker,
  Circle,
  Point,
  Animation,
  Polyline,
  RouteInfo,
  DrivingInfo,
} from 'react-native-yamap';
import MapScreenStyles from './MapScreen.styles';
import Icon from 'react-native-vector-icons/Ionicons';
import ErrorAlert from '../../components/ErrorAlert/ErorAlert';
import {AppColors} from '../../theme';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {useRoute} from '@react-navigation/native';
import {TabletMapTaskNavigationProps, PhoneMapTaskNavigationProps} from '../../navigation/utils/NavigationProps';
import {TrafficLightIcon} from '../../../assets/icons/TrafficLightIcon/TrafficLightIcon';
import {AlarmType, Car, TaskType, UserPositionType} from '../../types';
import {AlarmButton} from "../../components/AlarmButton/AlarmButton";
import AlarmsModal from "../../components/AlarmsModal/AlarmsModal";
import {getAlarms} from "../../store/modules/alarms/actions/alarmsActions";
import {addAction} from "../../services/database/actions-db";
import {alarmsApi} from "../../services/api/alarms-api";
import Device from "react-native-device-detection";
import {getDate, getTime} from "../../services/sync/sync";
import {syncApi} from "../../services/api/sync-api";
import SuccessModal from "../../components/SuccessModal/SuccessModal";

YaMap.init(API_YANDEX_MAP_KEY);

export const MapScreen: React.FC = () => {
  const route = useRoute<TabletMapTaskNavigationProps | PhoneMapTaskNavigationProps>();
  const [isFocusUserPosition, setIsFocusUserPosition] = useState(false);
  const [pressedMarker, setPressedMarker] = useState<Array<Point>>([]);
  const [isVisibleSuccess, setVisibleSuccess] = useState<boolean>(false);
  const [selectedRoutePoints, setSelectedRoutePoints] = useState<Point[]>([]);

  const car = useSelector<RootState, Car>(state => state.carsState.car);
  const userPosition = useSelector<RootState, UserPositionType>(
    state => state.userState.userPosition,
  );
  const selectedTask = useSelector<RootState, TaskType>(
      state => state.tasksState.selectedTask
  );
  const [isPaintFinish, setIsPaintFinish] = useState<boolean>(false);
  const [isTrafficVisible, setIsTrafficVisible] = useState<boolean>(true);
  const [isShowUserPosition, setIsShowUserPosition] = useState<boolean>(false);
  const [isShowAlarms, setIsShowAlarms] = useState(false);
  const alarms = useSelector<RootState, Array<AlarmType>>(state => state.alarmsState.alarms);
  const token = useSelector<RootState, string>(
      state => state.userState.user.token,shallowEqual
  );
  const dispatch = useDispatch();

  const map = useRef<YaMap>(null);

  const [tempLat, setTempLat] = useState<number>();
  const [tempLon, setTempLon] = useState<number>();

  useEffect(() => {
    if (map.current) {
      map.current.setTrafficVisible(isTrafficVisible);
      map.current.setCenter({lon: 39.866307, lat: 57.607779, zoom: 10}, 10);
      setIsShowUserPosition(true);
    }
  }, []);

  const findShortRoute = (routes: RouteInfo<DrivingInfo>[]) => {
    let route: RouteInfo<DrivingInfo> | undefined =
      {} as RouteInfo<DrivingInfo>;
    let sections: any[] = [];
    routes.forEach(item => {
      sections.push(...item.sections);
    });

    let max = sections[0]?.routeInfo.distance;

    sections.forEach(section => {
      if (max >= section.routeInfo.distance) {
        route = routes[section.routeIndex];
      } else {
        max = section.routeInfo.distance;
        route = routes[section.routeIndex];
      }
    });

    return route;
  };

  const getRoute = useCallback((points: Point[]) => {
    let result: Point[] = [];
    if (map.current) {
      map.current.findDrivingRoutes(points, event => {
        let shortRoute = findShortRoute(event.nativeEvent.routes);
        let shortRoutePoints = [];

        if (shortRoute?.sections?.length) {
          shortRoutePoints = shortRoute.sections.map(section => section.points);
          result = shortRoutePoints.reduce((prev, curr) => prev.concat(curr));
          setSelectedRoutePoints(result);
        }
      });
    }
    return result;
  }, [map.current]);

  useEffect(() => {
    if (map.current) {
      let userLat = userPosition.lat;
      let userLon = userPosition.lon;
      let navigationLat = route.params?.lat;
      let navigationLon = route.params?.lon;
      if (
        navigationLat !== undefined &&
        navigationLon !== undefined
      ) {
        getRoute([
          {lat: userLat, lon: userLon},
          {lat: navigationLat, lon: navigationLon},
        ]);
        if (navigationLat !== tempLat &&
            navigationLon !== tempLon
        ) {
          map.current.setCenter(
            {
              lat: navigationLat,
              lon: navigationLon,
            },
            17,
            0,
            0,
            5,
            Animation.SMOOTH,
          );
        }
        setTempLat(navigationLat);
        setTempLon(navigationLon);
        setIsPaintFinish(true);
      }
    }
  }, [
    route.params?.lat,
    route.params?.lon,
    userPosition.lat,
    userPosition.lon,
    tempLat,
    tempLon,
    map.current,
  ]);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          buttonNegative: 'Отмена',
          buttonNeutral: 'Спросить позже',
          buttonPositive: 'ОК',
          title: 'Makrab',
          message: 'Makrab требуется доступ к вашему местоположению',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        if (isFocusUserPosition) {
          setIsFocusUserPosition(false);
        } else {
          setIsShowUserPosition(true);
          setIsFocusUserPosition(true);
          map.current?.setZoom(15);
        }
      } else {
        ErrorAlert('Доступ к местоположению запрещен');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getCurrentCameraPosition = () => {
    return new Promise<CameraPosition>(resolve => {
      if (map.current) {
        map.current.getCameraPosition((position: any) => {
          resolve(position);
        });
      }
    });
  };

  const focusUserPosition = useCallback((position: UserPositionType) => {
    getCurrentCameraPosition().then(cameraPosition => {
      if (map.current) {
        map.current.setCenter(
          {lat: position.lat, lon: position.lon},
          cameraPosition.zoom,
          cameraPosition.azimuth,
          cameraPosition.tilt,
          1,
          Animation.SMOOTH,
        );
      }
    });
  }, []);

  useEffect(() => {
    let mounted = true;
    if (isFocusUserPosition && mounted) {
      focusUserPosition(userPosition);
    }
    return () => {
      mounted = false
    };
  }, [focusUserPosition, isFocusUserPosition, userPosition]);

  const zoomUp = async () => {
    const position = await getCurrentCameraPosition();
    if (map.current) {
      map.current.setZoom(position.zoom * 1.1, 0.1);
    }
  };
  const zoomDown = async () => {
    const position = await getCurrentCameraPosition();
    if (map.current) {
      map.current?.setZoom(position.zoom * 0.9, 0.1);
    }
  };
  const pressOnMarker = (lat: number | null, lon: number | null) => {
    if (lat !== null && lon !== null) {
      setPressedMarker([{lat, lon}]);
      zoomToMarker();
    }
  };
  const zoomToMarker = () => {
    if (map.current && pressedMarker) {
      map.current.setCenter(pressedMarker[0], 16, 0, 0, 0.4, Animation.SMOOTH);
    }
  };

  const renderFinishMarker = () => {
    if (
      isPaintFinish &&
      route.params?.lat !== undefined &&
      route.params?.lon !== undefined &&
      map.current
    ) {
      return createFinishMarker(
        route.params?.lat,
        route.params?.lon,
      );
    }
  };

  const createFinishMarker = (finishLat: number, finishLong: number) => {
    if (map.current) {
      return (
        <Marker
          point={{lat: finishLat || 0, lon: finishLong || 0}}
          source={require('../../../assets/images/finish.png')}
        />
      );
    }
  };
  const renderAddressMarkers = useCallback(() => {
    if (map.current && selectedTask.addresses !== undefined && selectedTask.addresses.length) {
      return selectedTask.addresses.map(address => {
        return (
          <Marker
            onPress={() => pressOnMarker(address.lat, address.long)}
            key={address.id}
            point={{lat: address.lat || 0, lon: address.long || 0}}
            source={require('../../../assets/images/marker.png')}
          />
        );
      });
    }
  }, [selectedTask.addresses]);

  const renderPolylines = useCallback(() => {
    if (map.current && selectedRoutePoints.length >= 1) {
      return (
        <Polyline
          points={selectedRoutePoints}
          strokeColor={'#0000FF'}
          strokeWidth={3}
          dashLength={1}
        />
      );
    }
  }, [selectedRoutePoints]);

  const renderAddressCircles = useCallback(() => {
    if (map.current &&  selectedTask.addresses !== undefined && selectedTask.addresses.length) {
      return selectedTask.addresses.map(address => {
        return (
          <Circle
            key={address.id}
            center={{lon: address.long || 0, lat: address.lat || 0}}
            radius={address.radius || 0}
            strokeColor={AppColors.Red}
            fillColor="rgba(255,0,0, 0.1)"
          />
        );
      });
    }
  }, [selectedTask.addresses]);

  const showTraffic = () => {
    if (isTrafficVisible && map.current) {
      map.current.setTrafficVisible(false);
      setIsTrafficVisible(false);
    } else if (!isTrafficVisible && map.current) {
      map.current.setTrafficVisible(true);
      setIsTrafficVisible(true);
    }
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
          selectedTask.id,
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
        await alarmsApi.sendAlarm(
          token,
          car.id,
          alarm.id,
          locationId,
          0,
        );
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

  const buildAlarmButton = (isTablet: boolean) => {
    if (!isTablet) return null;

    return <View style={MapScreenStyles.alarmButtonContainer}>
      <AlarmButton
          onPress={() => {
            dispatch(getAlarms(token));
            setIsShowAlarms(true);
          }}
      />
    </View>
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <YaMap
          ref={map}
          showUserPosition={isShowUserPosition}
          style={MapScreenStyles.map}>
          {renderPolylines()}
          {renderAddressMarkers()}
          {renderAddressCircles()}
          {renderFinishMarker()}
        </YaMap>
        <View style={MapScreenStyles.buttonsContainer}>
          <TouchableOpacity
            onPress={zoomUp}
            style={MapScreenStyles.buttonWrapper}>
            <View style={MapScreenStyles.button}>
              <Icon name={'add-outline'} size={30} color={'#000'} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={zoomDown}
            style={MapScreenStyles.buttonWrapper}>
            <View style={MapScreenStyles.button}>
              <Icon name={'remove-outline'} size={30} color={'#000'} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={requestLocationPermission}
            style={MapScreenStyles.buttonWrapper}>
            <View style={MapScreenStyles.button}>
              <Icon name={'navigate-outline'} size={30} color={'#000'} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={showTraffic}
            style={MapScreenStyles.buttonWrapper}>
            <View style={MapScreenStyles.button}>
              <TrafficLightIcon />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {buildAlarmButton(Device.isTablet)}
      <AlarmsModal
          title="Что произошло"
          data={alarms}
          isVisible={isShowAlarms}
          handleSelected={handleSelectedAlarm}
          handleClose={() => setIsShowAlarms(false)}
      />
      <SuccessModal
          title="Тревога зафиксирована"
          description="В ближайшее время с вами свяжется логист"
          isVisible={isVisibleSuccess}
          handleClose={() => setVisibleSuccess(false)}
      />
    </SafeAreaView>
  );
};
