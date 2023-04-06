import {StyleSheet} from 'react-native';
import {AppColors, Fonts} from '../../theme';
import Device from 'react-native-device-detection';

const ProfileCardStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginLeft: 7,
    backgroundColor: 'transparent',
  },
  profileImage: {
    width: Device.isTablet ? 45 : 30,
    height: Device.isTablet ? 45 : 30,
  },
  isLandscapeProfileImage: {
    width: Device.isTablet ? 50 : 30,
    height: Device.isTablet ? 50 : 30,
  },
  profileInfoContainer: {
    marginLeft: Device.isTablet ? 16 : 8,
  },
  profileText: {
    ...Fonts.Bold,
    color: AppColors.White,
    fontSize: Device.isTablet ? 11 : 10,
  },
  isLandscapeText: {
    fontSize: Device.isTablet ? 16 : 10,
  },
});

export default ProfileCardStyles;
