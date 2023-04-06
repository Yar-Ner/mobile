import {StyleSheet} from 'react-native';
import {AppColors, Fonts} from '../../theme';
import Device from "react-native-device-detection";

const ConfirmCarScreenStyles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    paddingTop: Device.isTablet ? 24 : 0,
    backgroundColor: AppColors.White,
    alignItems: 'center',
  },
  infoContainer: {
    width: Device.isTablet ? '55%' : '100%',
    height: '100%',
  },

  infoContainerPhones: {
    width: Device.isTablet ? '50%' : '100%',
    height: '100%',
  },

  mainContainer: {
    flex: 1,
    justifyContent: 'space-around',
  },
  infoDriverContainer: {
    marginLeft: Device.isTablet ? 0 : 16,
  },
  infoCarContainer: {
    marginTop: 22,
    marginLeft: Device.isTablet ? 0 : 16,
  },

  description: {
    ...Fonts.Bold,
    fontSize: Device.isTablet ? 14 : 14,
    color: AppColors.TaskColor,
  },
  infoValue: {
    fontSize: Device.isTablet ? 16 : 20,
    ...Fonts.SemiBold,
  },
  chooseCarButton: {
    width: Device.isTablet ? '100%' : '90%',
    marginTop: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.ButtonTextColor,
    paddingTop: Device.isTablet ? 26 : 20,
    paddingBottom: Device.isTablet ? 26 : 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    borderRadius: 6,
    elevation: 5,
  },
  chooseCarButtonText: {
    ...Fonts.Bold,
    color: AppColors.White,
    fontSize: 20,
  },
  chooseCarButtonTextPhones: {
    ...Fonts.Bold,
    color: AppColors.White,
    fontSize: 16,
  },

  chooseCarButtonPhones: {
    width: Device.isTablet ? '100%' : '90%',
    marginTop: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.ButtonTextColor,
    paddingTop: Device.isTablet ? 15 : 20,
    paddingBottom: Device.isTablet ? 15 : 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    borderRadius: 6,
    elevation: 5,
  },
});

export default ConfirmCarScreenStyles;
