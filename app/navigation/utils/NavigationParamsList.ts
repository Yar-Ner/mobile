import {Car} from '../../types';

export type AuthStackNavigatorParamsList = {
  AuthScreen: undefined;
  SelectCarScreen: undefined;
  ConfirmCarScreen: {car: Car; photo: any};
};

export type MainStackNavigatorParamsList = {
  HomeScreen: {screen: string; lat: number; lon: number; isClick: boolean};
  DriverProfileScreen: undefined;
  SettingsScreen: undefined;
  ChatScreen: undefined;
};

export type TabletStackNavigatorParamsList = {
  TaskScreen: undefined;
  MapScreen: {lat: 0, lon: 0};
};

export type TopTabNavigatorParamsList = {
  TaskScreen: undefined;
  MapScreen: {lat: 0, lon: 0};
};
