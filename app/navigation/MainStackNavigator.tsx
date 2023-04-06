import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  HomeScreen,
  DriverProfileScreen,
  SettingsScreen,
  ChatScreen,
} from '../screens';
import {MainStackNavigatorParamsList} from './utils/NavigationParamsList';
import {CustomHeader} from '../components/CustomHeader/CustomHeader';
import {AppColors} from '../theme';
import {Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Menu, MenuItem} from 'react-native-material-menu';
import {useDispatch} from 'react-redux';
// @ts-ignore
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {logOut} from "../store/modules/user/actions/userActions";

const Stack = createNativeStackNavigator<MainStackNavigatorParamsList>();

const RightButton: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);
  const handleExit = () => {
    ReactNativeForegroundService.remove_task('com.makrab.backgroundSync');
    ReactNativeForegroundService.remove_task('com.makrab.hmsLocation');
    ReactNativeForegroundService.stop();
    dispatch(logOut());
  };

  return (
    <Menu
      visible={visible}
      anchor={
        <Text onPress={showMenu}>
          <Icon
            name={'ellipsis-vertical-outline'}
            color={AppColors.White}
            size={25}
          />
        </Text>
      }
      style={{width: 210}}
      onRequestClose={hideMenu}>
      <MenuItem onPress={handleExit}>
        <Icon name={'exit-outline'} color={AppColors.Red} size={18} />
        <Text style={{marginLeft: 40, fontSize: 16}}>Завершить сеанс</Text>
      </MenuItem>
    </Menu>
  );
};

const ScreenOptions = {
  HomeScreen: {
    header: (props: any) => <CustomHeader {...props} />,
  },
  DriverProfileScreen: {
    title: 'Профиль водителя',
    headerTitleAlign: 'center',
    headerBackVisible: true,
    headerTintColor: AppColors.White,
    headerStyle: {
      backgroundColor: AppColors.Red,
    },
    headerTitleStyle: {
      color: AppColors.White,
    },
    headerRight: () => <RightButton />,
  },
  SettingsScreen: {
    title: 'Настройки',
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
  ChatScreen: {
    title: 'Чат',
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

const MainStackNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="HomeScreen">
    <Stack.Screen
      options={ScreenOptions.HomeScreen}
      name="HomeScreen"
      component={HomeScreen}
    />
    <Stack.Screen
      // @ts-ignore
      options={ScreenOptions.DriverProfileScreen}
      name="DriverProfileScreen"
      component={DriverProfileScreen}
    />
    <Stack.Screen
      // @ts-ignore
      options={ScreenOptions.SettingsScreen}
      name="SettingsScreen"
      component={SettingsScreen}
    />
    <Stack.Screen
      // @ts-ignore
      options={ScreenOptions.ChatScreen}
      name="ChatScreen"
      component={ChatScreen}
    />
  </Stack.Navigator>
);

export default MainStackNavigator;
