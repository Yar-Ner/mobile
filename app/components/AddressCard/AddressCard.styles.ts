import {StyleSheet} from 'react-native';
import {AppColors, Fonts} from '../../theme';
import Device from 'react-native-device-detection';

const AddressCardStyles = StyleSheet.create({
  container: {
    marginBottom: 10,
    borderColor: '#000000',
    backgroundColor: AppColors.White,
    shadowColor: AppColors.TaskColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 5,
  },
  infoContainer: {
    flex: 0.7,
    flexDirection: 'column',
  },
  contractorContainer: {
    flexDirection: 'row',
  },
  number: {
    ...Fonts.Bold,
    fontSize: 14,
    marginLeft: Device.isTablet ? 6 : 5,
    marginRight: Device.isTablet ? 3 : 7,
    color: AppColors.Red,
  },
  title: {
    marginTop: 1,

    ...Fonts.Bold,
    fontSize: Device.isTablet ? 16 : 13,
  },
  subTitle: {
    ...Fonts.Bold,
    fontSize: Device.isTablet ? 17 : 14,
    textDecorationLine: 'underline',
  },
  arrivalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  departureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrivalText: {
    ...Fonts.Bold,
    color: AppColors.Active,
    fontSize: Device.isTablet ? 16 : 13,
  },
  departureText: {
    ...Fonts.Bold,
    color: AppColors.TaskColor,
    fontSize: Device.isTablet ? 16 : 13,
  },
  orders: {},
  emptyOrderTextContainer: {},
  emptyOrderText: {
    ...Fonts.Bold,
    color: AppColors.InactiveButton,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default AddressCardStyles;
