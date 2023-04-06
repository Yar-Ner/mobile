import {StyleSheet} from 'react-native';
import {Fonts} from '../../theme';
import Device from 'react-native-device-detection';

const AddressTextStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  locationIcon: {
    marginLeft: Device.isTablet ? 2 : 3,
    marginRight: Device.isTablet ? 2 : 3,
  },
  text: {
    ...Fonts.Bold,
    fontSize: Device.isTablet ? 17 : 14,
    textDecorationLine: 'underline',
    marginTop: -3,
  },
});
export default AddressTextStyles;
