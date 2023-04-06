import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';

import {version as app_version} from '../../../package.json';
import {getDeviceId} from 'react-native-device-info';

import AuthScreenStyles from './AuthScreen.styles';

import ErrorAlert from '../../components/ErrorAlert/ErorAlert';
import {useDispatch, useSelector} from 'react-redux';
import {LogoIcon} from '../../../assets/icons';
import {AuthNavigationProps} from '../../navigation/utils/NavigationProps';
import {useNavigation} from '@react-navigation/native';
import {AppColors} from '../../theme';
import {RootState} from '../../store/store';
import {logIn} from "../../store/modules/user/actions/userActions";

export const AuthScreen: React.FC = () => {
  const navigation = useNavigation<AuthNavigationProps>();
  const [login, setLogin] = useState('');
  const [passwordFromInput, setPassword] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [logoHeight, setLogoHeight] = useState(300);
  const dispatch = useDispatch();
  const isLoadingData = useSelector<RootState, boolean>(
    state => state.uiState.isLoadingData,
  );
  const [token, setToken] = useState('');
  const userToken = useSelector<RootState, string>(state => state.userState.user.token);

  useEffect(() => {
    setDeviceId(getDeviceId());
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setLogoHeight(150);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setLogoHeight(300); // or some other action
      },
    );
    setToken(userToken);
    if (token?.length) {
      //@ts-ignore
      navigation.navigate('SelectCarScreen');
    }

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [navigation, token, userToken]);

  const LogInHandler = (user: string, password: string) => {
    if (user.length === 0 || password.length === 0) {
      ErrorAlert('Вы не ввели Логин или пароль!');
      return;
    }
    dispatch(logIn(user, password));
  };

  return (
    <SafeAreaView style={AuthScreenStyles.mainContainer}>
      <KeyboardAvoidingView
        style={AuthScreenStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <LogoIcon width={'100%'} height={logoHeight} />
        <View>
          <TextInput
            style={AuthScreenStyles.input}
            onChangeText={setLogin}
            value={login}
            placeholder={'Логин'}
            placeholderTextColor={AppColors.TaskColor}
          />
          <TextInput
            secureTextEntry={true}
            style={AuthScreenStyles.input}
            onChangeText={setPassword}
            value={passwordFromInput}
            placeholder={'Укажите ваш пароль'}
            placeholderTextColor={AppColors.TaskColor}
          />
          <TouchableOpacity
            onPress={() => LogInHandler(login, passwordFromInput)}
            style={AuthScreenStyles.button}>
            {isLoadingData ? (
              <ActivityIndicator
                style={{flex: 1}}
                size="small"
                color="#FFFFFF"
              />
            ) : (
              <Text style={AuthScreenStyles.buttonText}>Войти</Text>
            )}
          </TouchableOpacity>
          <View style={AuthScreenStyles.appInfoContainer}>
            <Text style={AuthScreenStyles.appInfoContainerText}>
              Версия приложения: {app_version}
            </Text>
            <Text style={AuthScreenStyles.appInfoContainerText}>
              ID устройства: {deviceId}
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
