import {StyleSheet} from 'react-native';
import {AppColors, Fonts} from '../../theme';

const SelectCarScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    backgroundColor: AppColors.Main,
  },
  mobileContainer: {
    paddingTop: 8,
    paddingLeft: 8,
    paddingRight: 8,
  },
  chooseCarButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.White,
    paddingTop: 12,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  chooseCarButtonText: {
    color: AppColors.ButtonTextColor,
  },
  notFoundCars: {
    ...Fonts.Bold,
    color: AppColors.TaskColor,
    textAlign: 'center',
  },
});

export default SelectCarScreenStyles;
