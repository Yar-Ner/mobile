import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  MapScreen,
  TaskScreen
} from '../screens';
import {TabletStackNavigatorParamsList} from './utils/NavigationParamsList';

const Stack = createNativeStackNavigator<TabletStackNavigatorParamsList>();


const ScreenOptions = {
  TaskScreen: {
    title: '',
    headerShown: false,
  },
  MapScreen: {
    title: '',
    headerShown: false,
  },
};

const TabletStackNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="TaskScreen">
    <Stack.Screen
      options={ScreenOptions.TaskScreen}
      name="TaskScreen"
      component={TaskScreen}
    />
    <Stack.Screen
      options={ScreenOptions.MapScreen}
      name="MapScreen"
      component={MapScreen}
    />
  </Stack.Navigator>
);

export default TabletStackNavigator;
