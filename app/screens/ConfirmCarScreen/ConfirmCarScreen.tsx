import React from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';

import ConfirmCarScreenStyles from './ConfirmCarScreen.styles';
import {ConfirmCarNavigationProps} from '../../navigation/utils/NavigationProps';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {useRoute} from '@react-navigation/native';
import ResponsiveImage from 'react-native-responsive-image';
import ScalableText from 'react-native-text';
import {useScreenDimensions} from '../../hooks/DimensionHook';
import {Car} from "../../types";
import {saveCar} from "../../store/modules/cars/actions/carsActions";

export const ConfirmCarScreen: React.FC = () => {
  let driverName = useSelector<RootState, string>(state => state.userState.user.fullname);
  const token = useSelector<RootState, string>(state => state.userState.user.token);
  const dispatch = useDispatch();
  const isLoadingData = useSelector<RootState, boolean>(
    state => state.uiState.isLoadingData,
  );
  const screenData = useScreenDimensions();

  const route = useRoute<ConfirmCarNavigationProps>();
  let carFromRoute = route.params.car;
  let photo = route.params.photo;

  const handleSelectCar = (car: Car) => {
    dispatch(saveCar(token, car));
  };

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <SafeAreaView style={{flex: 1}}>
      <View style={ConfirmCarScreenStyles.container}>
        {isLoadingData ? (
          // eslint-disable-next-line react-native/no-inline-styles
          <ActivityIndicator style={{flex: 1}} size="large" color="#FFFFFF" />
        ) : (
          <View
            style={[
              screenData.width < 1024
                ? ConfirmCarScreenStyles.infoContainerPhones
                : ConfirmCarScreenStyles.infoContainer,
            ]}>
            <ResponsiveImage
              style={{
                width: '100%',
                height: screenData.width < 1024 ? 200 : 300,
              }}
              source={photo}
              initWidth={500}
              initHeight={250}
              resizeMode="cover"
            />
            <View style={ConfirmCarScreenStyles.mainContainer}>
              <View style={{flex: 0.8, marginTop: 18}}>
                <View style={ConfirmCarScreenStyles.infoDriverContainer}>
                  <ScalableText style={ConfirmCarScreenStyles.description}>
                    Водитель:
                  </ScalableText>
                  <ScalableText style={ConfirmCarScreenStyles.infoValue}>
                    {driverName}
                  </ScalableText>
                </View>
                <View style={ConfirmCarScreenStyles.infoCarContainer}>
                  <ScalableText
                    allowFontScaling={false}
                    style={ConfirmCarScreenStyles.description}>
                    Машина:
                  </ScalableText>
                  <ScalableText style={ConfirmCarScreenStyles.infoValue}>
                    {carFromRoute?.number}
                  </ScalableText>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleSelectCar(carFromRoute)}
                style={[
                  screenData.width < 1024
                    ? ConfirmCarScreenStyles.chooseCarButtonPhones
                    : ConfirmCarScreenStyles.chooseCarButton,
                ]}>
                {isLoadingData ? (
                  <ActivityIndicator
                    style={{flex: 1}}
                    size="small"
                    color="#FFFFFF"
                  />
                ) : (
                  <Text
                    style={[
                      screenData.width < 1024
                        ? ConfirmCarScreenStyles.chooseCarButtonTextPhones
                        : ConfirmCarScreenStyles.chooseCarButtonText,
                    ]}>
                    Начать работу
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
