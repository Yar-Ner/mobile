// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, {useEffect} from 'react';
import {
  View,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native';

import SelectCarScreenStyles from './SelectCarScreen.styles';
import {useDispatch, useSelector} from 'react-redux';
import {CarCard} from '../../components/CarCard/CarCard';
import store, {RootState} from '../../store/store';
import Device from "react-native-device-detection";
import {Car} from "../../types";
import {getCars} from "../../store/modules/cars/actions/carsActions";

export type CarType = {
  id: number;
  name: string | null;
  number: string | null;
};

type SelectCarScreenType = {
  navigation: any;
};

export const SelectCarScreen: React.FC<SelectCarScreenType> = ({
  navigation,
}) => {
  const token = store.getState().userState.user.token;

  const cars = useSelector<RootState, Array<Car>>(state => state.carsState.cars);
  const dispatch = useDispatch();
  // @ts-ignore
  const isLoadingData = useSelector(state => state.isLoadingData);

  useEffect(() => {
    dispatch(getCars(token));
  }, [dispatch, token]);

  const showConfirmScreen = (car: Car, carPhoto: any) => {
    navigation.navigate('ConfirmCarScreen', {
      car: car,
      photo: carPhoto,
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={[
          SelectCarScreenStyles.container,
          !Device.isTablet &&
            SelectCarScreenStyles.mobileContainer,
        ]}>
        {isLoadingData ? (
          // eslint-disable-next-line react-native/no-inline-styles
          <ActivityIndicator style={{flex: 1}} size="large" color="#FFFFFF" />
        ) : cars.length ? (
          <FlatList
            data={cars}
            renderItem={({item}) => (
              <CarCard
                id={item.id || 0}
                onSelect={showConfirmScreen}
                carName={item.name || ''}
                carPlate={item.number || ''}
                carWeight={item.weight || 1000}
                color={item.color || ''}
                type = {item.type || 0}
                containers={item.containers}
              />
            )}
          />
        ) : (
          <Text style={SelectCarScreenStyles.notFoundCars}>
            Машин не найдено
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};
