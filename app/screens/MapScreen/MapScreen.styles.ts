import {StyleSheet} from 'react-native';
import {AppColors} from '../../theme';

const MapScreenStyles = StyleSheet.create({
  map: {
    flex: 1,
    borderWidth: 1,
  },
  buttonsContainer: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonWrapper: {
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    shadowColor: AppColors.Black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 2,
    backgroundColor: AppColors.White,
    borderRadius: 8,
    padding: 8,
    marginBottom: 3,
  },
  alarmButtonContainer: {
    width: '15%',
    position: 'absolute',
    left: 0,
    bottom: 0,
  }
});

export default MapScreenStyles;
