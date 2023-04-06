import React, {useEffect, useState} from 'react';
import {Text, SafeAreaView, View, Image, TouchableOpacity} from 'react-native';
import DriverProfileScreenStyles from './DriverProfileScreen.styles';
import {useDispatch, useSelector} from 'react-redux';
import {version as app_version} from '../../../package.json';
import {getDeviceId} from 'react-native-device-info';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigatorParamsList} from '../../navigation/utils/NavigationParamsList';
import {getDriverName} from "../../store/modules/user/actions/userActions";

export const DriverProfileScreen: React.FC = () => {
  //@ts-ignore
  const driverName = useSelector(state => state.userState.user.fullname);
  //@ts-ignore
  const carPlate = useSelector(state => state.carsState.car.number);
  const [deviceId, setDeviceId] = useState('');
  const navigation = useNavigation<MainStackNavigatorParamsList>();
  const dispatch = useDispatch();

  let countOfClickOnVersion = 0;

  useEffect(() => {
    dispatch(getDriverName());
    setDeviceId(getDeviceId);
  }, [dispatch]);

  const showSettings = () => {
    countOfClickOnVersion++;
    if (countOfClickOnVersion > 2) {
      // @ts-ignore
      navigation.navigate('SettingsScreen');
      countOfClickOnVersion = 0;
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={DriverProfileScreenStyles.top}>
        <Image
          style={DriverProfileScreenStyles.profileImage}
          source={require('../../../assets/images/profile.png')}
        />
        <Text style={DriverProfileScreenStyles.profileName}>{driverName}</Text>
        <Text style={DriverProfileScreenStyles.profileCarPlate}>
          {carPlate}
        </Text>
      </View>
      <View style={DriverProfileScreenStyles.middle}>
        <View style={DriverProfileScreenStyles.appInfo}>
          <View style={DriverProfileScreenStyles.description}>
            <TouchableOpacity
              onPress={() => showSettings()}
              style={DriverProfileScreenStyles.versionButton}>
              <Text style={DriverProfileScreenStyles.descriptionText}>
                Версия приложения
              </Text>
              <Text style={DriverProfileScreenStyles.labelText}>
                {app_version}
              </Text>
            </TouchableOpacity>
            <View style={DriverProfileScreenStyles.idContainer}>
              <Text style={DriverProfileScreenStyles.descriptionText}>ID</Text>
              <Text style={DriverProfileScreenStyles.labelText}>
                {deviceId}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
