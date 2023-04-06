import {StyleSheet} from 'react-native';
import {Fonts} from '../../theme';

const WeightInputStyles = StyleSheet.create({
  weightInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: 'grey',
    ...Fonts.Bold,
  },
  button: {
    marginLeft: 3,
    paddingVertical: 4,
    paddingHorizontal: 3,
    borderRadius: 5,
    borderWidth: 0.5,
  },
  text: {
    marginLeft: 5,
    textAlign: 'center',
    ...Fonts.Bold,
  },
  textLikeButton: {
    marginLeft: 0,
  },
});

export default WeightInputStyles;
