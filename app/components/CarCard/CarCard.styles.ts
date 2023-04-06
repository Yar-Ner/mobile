import {StyleSheet} from 'react-native';
import {AppColors, Fonts} from '../../theme';

const CarCardStyles = StyleSheet.create({
  container: {
    height: 104,
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.White,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    flex: 1,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  phoneImage: {
    flex: 2,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  carInfo: {
    flex: 3,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginRight: 20,
  },
  carInfoPhones: {
    flex: 3,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 20,
  },
  selectedContainer: {
    height: 104,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.White,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: AppColors.Red,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    elevation: 5,
  },
  carInfoCarName: {
    width: 140,
    ...Fonts.SemiBold,
    fontSize: 22,
    color: AppColors.TaskColor,
  },
  carInfoCarNamePortrait: {
    width: 140,
    ...Fonts.SemiBold,
    fontSize: 10,
    color: AppColors.TaskColor,
  },
  carInfoCarNamePhones: {
    ...Fonts.Bold,
    fontSize: 13,
    color: AppColors.TaskColor,
  },
  carInfoCarPlate: {
    ...Fonts.Bold,
    fontSize: 24,
  },
  carInfoCarPlatePortrait: {
    ...Fonts.Bold,
    fontSize: 14,
  },
  carInfoCarPlatePhones: {
    ...Fonts.Bold,
    fontSize: 20,
  },
});

export default CarCardStyles;
