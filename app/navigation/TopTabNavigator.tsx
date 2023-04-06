import React from 'react';
import {TaskScreen, MapScreen} from '../screens';
import {TopTabNavigatorParamsList} from './utils/NavigationParamsList';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {AppColors} from '../theme';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createMaterialTopTabNavigator<TopTabNavigatorParamsList>();

const ScreenOptions = {
  Main: {
    tabBarStyle: {
      backgroundColor: AppColors.Red,
    },
    tabBarActiveTintColor: AppColors.White,
    tabBarIndicatorStyle: {
      backgroundColor: AppColors.White,
    },
    lazy: true,
  },
  AssignInfoScreen: {
    title: '',
    tabBarIconStyle: {
      marginBottom: -20,
    },
    tabBarIcon: () => (
      <Icon name={'list-outline'} size={25} color={AppColors.White} />
    ),
  },
  MapScreen: {
    title: '',
    tabBarIconStyle: {
      marginBottom: -20,
    },
    tabBarIcon: () => (
      <Icon name={'map-outline'} size={25} color={AppColors.White} />
    ),
    swipeEnabled: false,
  },
};

const TopTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={ScreenOptions.Main}
      backBehavior={'none'}>
      <Tab.Screen
        options={ScreenOptions.AssignInfoScreen}
        name="TaskScreen">
        {props => <TaskScreen/>}
      </Tab.Screen>
      <Tab.Screen
        options={ScreenOptions.MapScreen}
        name="MapScreen">
        {props => <MapScreen/>}
      </Tab.Screen>
    </Tab.Navigator>
  );
};
export default TopTabNavigator;
