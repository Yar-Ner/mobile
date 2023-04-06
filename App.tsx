import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import store from './app/store/store';
import AuthStackNavigator from './app/navigation/AuthStackNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorAlert from './app/components/ErrorAlert/ErorAlert';
import {LogBox, StatusBar} from 'react-native';
import MainStackNavigator from './app/navigation/MainStackNavigator';
import {AppColors} from './app/theme';
import SplashScreen from 'react-native-splash-screen';
import {clearActionsTable} from './app/services/database/db';
import OneSignal from 'react-native-onesignal';
import RNFS from 'react-native-fs';
import {Car} from './app/types';
import {logInActionCreator} from './app/store/actionCreators/userActionCreators';
import {saveCarActionCreator} from './app/store/actionCreators/carsActionCreators';
import {saveToLogFile} from './app/utils/saveLogs';
import {getDateTime} from './app/services/sync/sync';

LogBox.ignoreLogs(['new NativeEventEmitter']);

let counter = 0;
export const pathToLogFile = RNFS.ExternalDirectoryPath + '/makrab.log';

//OneSignal Init Code
OneSignal.setLogLevel(6, 0);
OneSignal.setAppId('4c650135-21fb-471c-a5cc-b19438898286');
//END OneSignal Init Code

//Prompt for push on iOS
OneSignal.promptForPushNotificationsWithUserResponse(response => {
  console.log('Prompt response:', response);
});

//Method for handling notifications received while app in foreground
OneSignal.setNotificationWillShowInForegroundHandler(
  notificationReceivedEvent => {
    let notification = notificationReceivedEvent.getNotification();
    console.log('notification: ', notification);
    const data = notification.additionalData;
    console.log('additionalData: ', data);
    // Complete with null means don't show a notification.
    notificationReceivedEvent.complete(notification);
    counter = ++counter;
    store.dispatch({
      type: 'UPDATE_MESSAGE_COUNTER',
      payload: {
        messageCounter: counter,
      },
    });
  },
);

const App = () => {
  let carTemplate: Car = {
    id: null,
    name: null,
    number: null,
    color: null,
    weight: null,
    type: null,
  };
  const [token, setToken] = useState('');
  const [car, setCar] = useState(carTemplate);
  const [driverName, setDriver] = useState('');
  const [userId, setUserId] = useState<number>(0);

  store.subscribe(() => {
    setToken(store.getState().userState.user.token);
    setCar(store.getState().carsState.car);
    setDriver(store.getState().userState.user.fullname);
    setUserId(store.getState().userState.user.id);
  });

  useEffect(() => {
    let mounted = true;
    const getData = async () => {
      try {
        await clearActionsTable();
        let driver = await AsyncStorage.getItem('driver');
        let carFromStorage = await AsyncStorage.getItem('car');
        if (driver !== null && carFromStorage !== null && mounted) {
          store.dispatch(logInActionCreator(JSON.parse(driver)));
          store.dispatch(saveCarActionCreator(JSON.parse(carFromStorage)));
        }
      } catch (error) {
        let datetime = getDateTime();
        saveToLogFile(datetime, pathToLogFile, 'getData', error, '');
        ErrorAlert('Произошла ошибка при входе!');
      }
    };
    getData().then(() => SplashScreen.hide());
    return () => {
      mounted = false;
    };
  }, [driverName]);

  useEffect(() => {
    if (userId !== undefined) {
      OneSignal.sendTag('user_id', userId.toString());
    }
  }, [userId]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      RNFS.exists(pathToLogFile).then(isExists => {
        if (!isExists) {
          RNFS.writeFile(pathToLogFile, 'Start Logging...\n', 'utf8').catch(
            error => console.log('error in log file creating', error.message),
          );
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <Provider store={store}>
      <StatusBar backgroundColor={AppColors.Red} barStyle="light-content" />
      <NavigationContainer>
        {token !== '' && car.id !== null && driverName !== null ? (
          <MainStackNavigator />
        ) : (
          <AuthStackNavigator />
        )}
      </NavigationContainer>
    </Provider>
  );
};

export default App;
