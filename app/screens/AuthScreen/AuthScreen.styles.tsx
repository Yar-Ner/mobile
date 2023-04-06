import {StyleSheet} from 'react-native';
import {AppColors, Fonts} from '../../theme';

const AuthScreenStyles = StyleSheet.create({
  mainContainer: {
    backgroundColor: AppColors.White,
    flex: 1,
  },
  container: {
    alignItems: 'center',
    marginLeft: 40,
    marginRight: 40,
  },
  input: {
    width: 320,
    height: 40,
    marginTop: 5,
    ...Fonts.Bold,
    textAlign: 'left',
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderColor: AppColors.TaskColor,
    color: AppColors.TaskColor,
  },
  button: {
    width: 320,
    height: 50,
    marginTop: 60,
    justifyContent: 'center',
    backgroundColor: AppColors.ButtonTextColor,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: AppColors.White,
    ...Fonts.Bold,
    fontSize: 14,
  },
  appInfoContainer: {
    marginTop: 150,
  },
  appInfoContainerText: {
    textAlign: 'center',
    color: AppColors.TaskColor,
    fontSize: 10,
    ...Fonts.Regular,
  },
});

export default AuthScreenStyles;
