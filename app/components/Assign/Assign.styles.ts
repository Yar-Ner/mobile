import {StyleSheet} from 'react-native';
import {AppColors, Fonts} from '../../theme';
import Device from "react-native-device-detection";

const AssignStyles = StyleSheet.create({
  assignButton: {
    width: '100%',
    height: Device.isTablet ? 62 : 40,
    marginTop: 10,
    backgroundColor: AppColors.TaskColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  assignButtonSelected: {
    width: '100%',
    height: Device.isTablet ? 62 : 40,
    marginTop: 10,
    backgroundColor: AppColors.Red,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.25)',
  },
  assignButtonCompleted: {
    width: '100%',
    height: Device.isTablet ? 62 : 40,
    marginTop: 10,
    backgroundColor: AppColors.Active,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.25)',
  },
  assignButtonText: {
    ...Fonts.Bold,
    color: AppColors.White,
    fontSize: Device.isTablet ? 26 : 12,
    fontWeight: '700',
  },
  assignStartButton: {
    marginTop: 10,
    marginLeft: 3,
  },
  assignStartButtonText: {
    color: AppColors.White,
    fontSize: 13,
  },
});

export default AssignStyles;
