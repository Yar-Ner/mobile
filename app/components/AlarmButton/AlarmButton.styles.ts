import {StyleSheet} from 'react-native';
import {AppColors, Fonts} from '../../theme';
import Device from 'react-native-device-detection';

const AlarmButtonStyles = StyleSheet.create({
  button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    backgroundColor: AppColors.Red,
  },
  buttonText: {
    ...Fonts.Bold,
    fontSize: Device.isTablet ? 14 : 7,
    color: AppColors.White,
  }
});

export default AlarmButtonStyles;
