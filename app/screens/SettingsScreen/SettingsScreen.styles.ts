import {StyleSheet} from 'react-native';
import {AppColors, Fonts} from '../../theme';

const SettingsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.White,
  },
  settingsContainer: {
    marginTop: 12,
    marginHorizontal: 16,
  },
  settingsTitle: {
    paddingBottom: 10,
    ...Fonts.Bold,
    fontSize: 16,
    textTransform: 'uppercase',
    borderBottomWidth: 1,
  },
  settingsCard: {
    marginTop: 10,
    paddingBottom: 10,
    borderColor: 'rgba(0,0,0,0.2)',
    borderBottomWidth: 0.4,
  },
  executeTaskSettingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingBottom: 10,
    borderColor: 'rgba(0,0,0,0.2)',
    borderBottomWidth: 0.4,
  },
  modalUpdateTimeHeader: {
    width: '90%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 15,
    marginLeft: 50,
  },
  modalUpdateTimeTitle: {
    ...Fonts.Bold,
    fontSize: 15,
  },
  modalUpdateTimeButton: {},
  modalUpdateTimeButtonText: {},
  checkboxContainer: {},
  timeValueContainer: {
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
    paddingLeft: 20,
    paddingRight: 40,
  },
  phoneInputContainer: {
    width: '90%',
    marginVertical: 20,
  },
  phoneInput: {
    width: '100%',
    height: 52,
  },
  phoneInputText: {
    height: 40,
  },
  phoneCode: {
    height: 25,
  },
  error: {
    ...Fonts.SemiBold,
    fontSize: 12,
    color: AppColors.Red,
  },
});
export default SettingsScreenStyles;
