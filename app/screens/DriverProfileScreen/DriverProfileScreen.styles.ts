import {StyleSheet} from 'react-native';
import {AppColors, Fonts} from '../../theme';
import Device from "react-native-device-detection";
//import DeviceInfo from 'react-native-device-info';

const DriverProfileScreenStyles = StyleSheet.create({
  top: {
    width: '100%',
    flex: 1.4,
    backgroundColor: AppColors.Red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middle: {
    flex: 2,
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
  },
  profileName: {
    marginTop: 10,
    ...Fonts.Bold,
    fontSize: 20,
    color: AppColors.White,
  },
  profileCarPlate: {
    marginTop: 8,
    ...Fonts.Bold,
    fontSize: 20,
    color: AppColors.White,
  },
  appInfo: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  description: {},
  descriptionText: {
    width: Device.isTablet ? 250 : 150,
    marginTop: 10,
    marginRight: Device.isTablet ? 20 : 5,
    ...Fonts.Bold,
    fontSize: Device.isTablet ? 22 : 15,
  },
  labelText: {
    width: Device.isTablet ? 130 : 100,
    marginTop: 10,
    ...Fonts.Bold,
    fontSize: Device.isTablet ? 20 : 15,
    color: AppColors.TaskColor,
    textAlign: 'right',
  },
  versionButton: {
    flexDirection: 'row',
  },
  idContainer: {
    flexDirection: 'row',
  },
});
export default DriverProfileScreenStyles;
