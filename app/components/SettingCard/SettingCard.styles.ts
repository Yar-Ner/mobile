import {StyleSheet} from 'react-native';
import {Fonts} from '../../theme';

const SettingCardStyles = StyleSheet.create({
  settingsCard: {
    marginTop: 10,
    paddingBottom: 10,
    borderColor: 'rgba(0,0,0,0.2)',
    borderBottomWidth: 0.4,
  },
  descriptionContainer: {
    flex: 1,
  },
  settingsCardTitle: {
    marginBottom: 5,
    ...Fonts.Bold,
    fontSize: 15,
  },
  settingsCardDescription: {
    fontSize: 13,
  },
});

export default SettingCardStyles;
