import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthScreen, SelectCarScreen} from '../screens';
import {AuthStackNavigatorParamsList} from './utils/NavigationParamsList';
import {AppColors} from '../theme';
import {ConfirmCarScreen} from '../screens/ConfirmCarScreen/ConfirmCarScreen';

const Stack = createNativeStackNavigator<AuthStackNavigatorParamsList>();

const ScreenOptions = {
  AuthScreen: {
    headerShown: false,
  },
  SelectCarScreen: {
    title: 'Выберите машину',
    headerTitleAlign: 'center',
    headerBackVisible: true,
    headerTintColor: AppColors.White,
    headerStyle: {
      backgroundColor: AppColors.Red,
    },
    headerTitleStyle: {
      color: AppColors.White,
    },
  },
  ConfirmCarScreen: {
    title: 'Подтвердите выбор',
    headerTitleAlign: 'center',
    headerBackVisible: true,
    headerTintColor: AppColors.White,
    headerStyle: {
      backgroundColor: AppColors.Red,
    },
    headerTitleStyle: {
      color: AppColors.White,
    },
  },
};

const AuthStackNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="AuthScreen">
    <Stack.Screen
      name="AuthScreen"
      component={AuthScreen}
      options={ScreenOptions.AuthScreen}
    />
    <Stack.Screen
      name="SelectCarScreen"
      component={SelectCarScreen}
      // @ts-ignore
      options={ScreenOptions.SelectCarScreen}
    />
    <Stack.Screen
      name="ConfirmCarScreen"
      component={ConfirmCarScreen}
      // @ts-ignore
      options={ScreenOptions.ConfirmCarScreen}
    />
  </Stack.Navigator>
);

export default AuthStackNavigator;
