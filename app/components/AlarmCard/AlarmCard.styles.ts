import {StyleSheet} from 'react-native';
import {AppColors, Fonts} from '../../theme';

const AlarmCardStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: AppColors.ButtonColor,
  },
  text: {
    color: AppColors.ButtonTextColor,
    ...Fonts.Bold,
    fontSize: 16,
  },
  selectedContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#416CDE',
    marginBottom: 10,
  },
  selectedText: {
    color: AppColors.White,
    ...Fonts.Bold,
    fontSize: 16,
  },
});

export default AlarmCardStyles;
