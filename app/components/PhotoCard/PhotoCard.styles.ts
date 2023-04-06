import {StyleSheet} from 'react-native';
import {AppColors} from '../../theme';
import Device from 'react-native-device-detection';

const PhotoCardStyles = StyleSheet.create({
  container: {
    width: Device.isTablet ? 60 : 60,
    height: Device.isTablet ? 60 : 60,
    marginRight: 10,
    marginBottom: 10,
  },
  closeBtn: {
    position: 'absolute',
    zIndex: 4,
    top: -1,
    right: 2,
    backgroundColor: AppColors.Black,
    borderRadius: 8,
  },
  image: {
    position: 'relative',
    width: Device.isTablet ? 60 : 60,
    height: Device.isTablet ? 60 : 60,
    borderRadius: 8,
  },
});

export default PhotoCardStyles;
