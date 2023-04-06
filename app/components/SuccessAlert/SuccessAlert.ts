import {Alert} from 'react-native';

const SuccessAlert = (text: string, onPress?: any) => {
  Alert.alert('Успех!', text, [{text: 'OK', onPress: onPress}]);
};

export default SuccessAlert;
