import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import {OrderCard} from '../OrderCard/OrderCard';
import AddressCardStyles from './AddressCard.styles';
import OrderCardStyles from '../OrderCard/OrderCard.styles';
import {AppColors} from '../../theme';
import {ArrowIcon} from '../../../assets/icons';
import {useDispatch, useSelector} from 'react-redux';
import {addAction} from '../../services/database/actions-db';
import {getArriveTimeForAddress} from '../../services/database/tasks-db';
import {getDepartureTimeForAddress} from '../../services/database/tasks-db';
import {RootState} from '../../store/store';
import ErrorAlert from '../ErrorAlert/ErorAlert';
import {setAttemptToCloseOrder} from '../../store/modules/settings/actions/settingsActions';

import * as geolib from 'geolib';
import Device from 'react-native-device-detection';
import {pathToLogFile} from '../../../App';
import {saveToLogFile} from '../../utils/saveLogs';
import AddressText from '../AddressText/AddressText';
import {
  CompletedOrderType,
  CurrentAddressType,
  OrderType,
  SettingsType,
  UserPositionType,
} from '../../types';
import {getDateTime, getTime} from '../../services/sync/sync';

type AddressCardType = {
  addressId: number;
  address?: string;
  addressName: string;
  addressNumber?: number;
  startTime?: string;
  endTime?: string;
  companyName?: string;
  orders: Array<OrderType>;
  completedOrdersHandler: Function;
  assignId: number;
  assignStarted: boolean;
  lat: number | null;
  lon: number | null;
  assignFinished: boolean;
  navigation: any;
  radius: number;
  addressStatus: string;
};

export const AddressCard: React.FC<AddressCardType> = ({
  addressId,
  address,
  addressName,
  addressNumber,
  companyName,
  orders,
  completedOrdersHandler,
  assignId = 0,
  assignStarted,
  assignFinished,
  lat,
  lon,
  radius,
  navigation,
}) => {
  //@ts-ignore
  const completedOrdersFromState = useSelector<
    RootState,
    Array<CompletedOrderType>
  >(state => state.tasksState.completedOrders);
  const userPosition = useSelector<RootState, UserPositionType>(
    state => state.userState.userPosition,
  );
  const [arrivalInfo, setArrivalInfo] = useState<string>('');
  const [departureInfo, setDepartureInfo] = useState<string>('');
  const [isShowFullTitle, setIsShowFullTitle] = useState(false);
  const settings = useSelector<RootState, SettingsType>(
    state => state.settingsState.settings,
  );
  const attempts = useSelector<RootState, number>(
    state => state.settingsState.attemptsToCloseOrder,
  );

  const counter = useRef(0);
  const isInRadius = useRef(false);

  const widelyRadius = useRef(0);

  const dispatch = useDispatch();

  if (
    userPosition.lat !== undefined &&
    userPosition.lon !== undefined &&
    lat !== null &&
    lon !== null &&
    radius !== undefined
  ) {
    isInRadius.current = geolib.isPointWithinRadius(
      {latitude: lat, longitude: lon},
      {latitude: userPosition.lat, longitude: userPosition.lon},
      widelyRadius.current > 0 ? widelyRadius.current : radius,
    );
  }

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      setArrivalInfo('');
      setDepartureInfo('');
    }

    return () => {
      mounted = false;
    };
  }, [addressId, assignId]);

  const checkOrderInRadiusHandler = (
    orderId: number,
    taskId: number,
    currentAddress: CurrentAddressType,
    assignStarted: boolean,
    assignFinished: boolean,
    startTime: string = '',
    endTime: string = '',
    arrivalTime: string = '',
    departureTime: string = '',
  ) => {
    getArriveTimeForAddress(assignId || 0, addressId || 0, orderId).then(
      result => {
        if (result.length) {
          setArrivalInfo(result[0]?.slice(0, result[0]?.length - 3));
        } else if (startTime.length) {
          let formattedStartTime = startTime.slice(11, 16);
          setArrivalInfo(formattedStartTime);
        } else if (
          isInRadius.current &&
          !arrivalTime.length &&
          currentAddress.addressId === addressId &&
          currentAddress.taskId === assignId &&
          !settings.executeTaskSettings.arbitraryExecutionTasks
        ) {
          getArrivalTime(isInRadius.current, orderId, assignStarted);
        } else if (
          isInRadius.current &&
          !arrivalTime.length &&
          settings.executeTaskSettings.arbitraryExecutionTasks
        ) {
          getArrivalTime(isInRadius.current, orderId, assignStarted);
        }
      },
    );

    getDepartureTimeForAddress(assignId || 0, addressId || 0, orderId).then(
      result => {
        if (result.length) {
          setDepartureInfo(result[0]?.slice(0, result[0]?.length - 3));
        } else if (endTime.length > 0 && !departureTime.length) {
          let formattedEndTime = endTime.slice(11, 16);
          setDepartureInfo(formattedEndTime);
        } else if (
          !isInRadius.current &&
          !departureTime.length &&
          arrivalTime.length
        ) {
          getDepartureTime(isInRadius.current, orderId, assignStarted);
        }
      },
    );
  };

  const createCompletedOrderArray = useCallback(
    (
      orderId: number,
      taskId: number,
      action: string,
      inRadius: boolean,
      orderRadius: number,
      fromDB: boolean = false,
      fromServer: boolean = false,
    ) => {
      if (fromServer) {
        let order: CompletedOrderType = {
          taskId: taskId,
          orderId: orderId,
          addressId: addressId,
        };
        completedOrdersHandler(order, action);
        return;
      } else if (fromDB) {
        let order: CompletedOrderType = {
          taskId: taskId,
          orderId: orderId,
          addressId: addressId,
        };
        completedOrdersHandler(order, action);
        return;
      }

      if (isInRadius.current) {
        let order: CompletedOrderType = {
          taskId: taskId,
          orderId: orderId,
          addressId: addressId,
        };
        completedOrdersHandler(order, action);
        return;
      } else if (
        !isInRadius.current &&
        !fromDB &&
        !fromServer &&
        counter.current <=
          settings.geoSettings.countOfAttemptForCheckingInRadius
      ) {
        ErrorAlert('Вы находитесь вне радиуса. Попробуйте еще раз!');
        widelyRadius.current = orderRadius * 2;
        counter.current++;
        return;
      }

      if (attempts < settings.geoSettings.countOfAttempt) {
        ErrorAlert(
          'У вас закончились попытки закрыть задачу вне радиуса, обратитесь к логисту!',
        );
        return;
      }

      if (
        counter.current > settings.geoSettings.countOfAttemptForCheckingInRadius
      ) {
        ErrorAlert(
          'Мы дали вам закрыть задачу вне радиуса. Возможно у вас проблемы с геопозиционирванием! Обратитесь к логисту',
        );
        let order: CompletedOrderType = {
          taskId: taskId,
          orderId: orderId,
          addressId: addressId,
        };
        completedOrdersHandler(order, action);
        dispatch(setAttemptToCloseOrder(attempts - 1));
        return;
      }
    },
    [settings.geoSettings.countOfAttemptForCheckingInRadius, addressId],
  );

  const getArrivalTime = useCallback(
    (isInRadius: boolean, orderId: number, isAssignStarted: boolean) => {
      let date = '';
      let time = '';
      let formattedTime = '';
      if (isInRadius && isAssignStarted) {
        date = getDateTime();
        time = getTime();
        formattedTime = time.slice(0, 5);
        saveToLogFile(
          date,
          pathToLogFile,
          '',
          '',
          `id: ${orderId} isInRadius: ${isInRadius}`,
        );
        setArrivalInfo(formattedTime);
        addAction({
          type: 'arrive',
          time: time,
          taskId: assignId,
          addressId: addressId,
          orderId: orderId,
          synced: 'false',
        });
      }
    },
    [assignStarted],
  );

  const getDepartureTime = useCallback(
    (_isInRadius: boolean, orderId: number, isAssignStarted: boolean) => {
      let date = '';
      let time = '';
      let formattedTime = '';
      if (!_isInRadius && isAssignStarted) {
        date = getDateTime();
        time = getTime();
        formattedTime = time.slice(0, 5);
        saveToLogFile(
          date,
          pathToLogFile,
          '',
          '',
          `id: ${orderId} isInRadius: ${_isInRadius}`,
        );
        setDepartureInfo(formattedTime);
        addAction({
          type: 'leave',
          time: time,
          taskId: assignId,
          addressId: addressId,
          orderId: orderId,
          synced: 'false',
        });
      }
      return date;
    },
    [assignStarted],
  );

  const showOnMap = (latitude: number | null, longitude: number | null) => {
    if (latitude === null || longitude === null) {
      navigation.navigate('HomeScreen', {
        screen: 'MapScreen',
        params: {lat: 0, lon: 0}
      });
    }

    navigation.navigate('HomeScreen', {
      screen: 'MapScreen',
      params: {lat: latitude, lon: longitude}
    });
  };

  // @ts-ignore
  return (
    <View style={AddressCardStyles.container}>
      <View style={AddressCardStyles.header}>
        <View style={AddressCardStyles.infoContainer}>
          <View style={AddressCardStyles.contractorContainer}>
            <Text style={AddressCardStyles.number}>{addressNumber}</Text>
            <Text
              onPress={() => setIsShowFullTitle(!isShowFullTitle)}
              numberOfLines={Device.isTablet || isShowFullTitle ? 2 : 1}
              style={AddressCardStyles.title}>
              {companyName}
            </Text>
          </View>
          <AddressText
            text={address}
            showOnMap={showOnMap}
            lat={lat}
            lon={lon}
          />
        </View>
        <View>
          <View style={AddressCardStyles.arrivalContainer}>
            <Text style={AddressCardStyles.arrivalText}>{arrivalInfo}</Text>
            <ArrowIcon
              width={Device.isTablet ? 24 : 18}
              height={Device.isTablet ? 24 : 18}
              fill={AppColors.Active}
            />
          </View>
          <View style={AddressCardStyles.departureContainer}>
            <Text style={AddressCardStyles.departureText}>{departureInfo}</Text>
            <ArrowIcon
              rotating={180}
              width={Device.isTablet ? 24 : 18}
              height={Device.isTablet ? 24 : 18}
              fill={AppColors.TaskColor}
            />
          </View>
        </View>
      </View>
      {orders.length ? (
        <FlatList
          style={AddressCardStyles.orders}
          data={orders}
          renderItem={({item}) => (
            <OrderCard
              id={item.id}
              typeOfOrder={item.action}
              weight={item.weight}
              volume={item.volume}
              payload={item.payload}
              addressId={addressId}
              addressName={addressName}
              assignId={assignId}
              assignFinished={assignFinished}
              assignStarted={assignStarted}
              handleOrderComplete={createCompletedOrderArray}
              selectedId={
                completedOrdersFromState.find(
                  (order: CompletedOrderType) => order.orderId === item.id,
                ) !== undefined
                  ? completedOrdersFromState.find(
                      (order: CompletedOrderType) => order.orderId === item.id,
                    )?.orderId
                  : 0
              }
              navigation={navigation}
              checkInRadius={checkOrderInRadiusHandler}
              extendedRadius={widelyRadius.current}
              startTime={item.fact_arrival || ''}
              endTime={item.fact_departure || ''}
              status={item.status}
              addressLat={lat}
              addressLong={lon}
              address={address}
              isInRadius={isInRadius.current}
              arrivalTime={arrivalInfo}
              departureTime={departureInfo}
            />
          )}
        />
      ) : (
        <View style={AddressCardStyles.emptyOrderTextContainer}>
          <View style={OrderCardStyles.hr} />
          <Text style={AddressCardStyles.emptyOrderText}>
            Заказы отсутствуют
          </Text>
        </View>
      )}
    </View>
  );
};
