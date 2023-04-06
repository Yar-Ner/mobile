import {RouteProp} from '@react-navigation/native';
import {
  AuthStackNavigatorParamsList,
  MainStackNavigatorParamsList,
  TabletStackNavigatorParamsList,
  TopTabNavigatorParamsList,
} from './NavigationParamsList';

export type SelectCarNavigationProps = RouteProp<
  AuthStackNavigatorParamsList,
  'SelectCarScreen'
>;

export type ConfirmCarNavigationProps = RouteProp<
  AuthStackNavigatorParamsList,
  'ConfirmCarScreen'
>;

export type AuthNavigationProps = RouteProp<
  AuthStackNavigatorParamsList,
  'AuthScreen'
>;

export type HomeNavigationProps = RouteProp<
  MainStackNavigatorParamsList,
  'HomeScreen'
>;

export type PhoneMapTaskNavigationProps = RouteProp<
  TopTabNavigatorParamsList,
  'MapScreen'
>;

export type TabletMapTaskNavigationProps = RouteProp<
  TabletStackNavigatorParamsList,
  'MapScreen'
>;

export type PhoneTaskNavigationProps = RouteProp<
    TopTabNavigatorParamsList,
    'TaskScreen'
>;

export type TabletTaskNavigationProps = RouteProp<
    TabletStackNavigatorParamsList,
    'TaskScreen'
>;
