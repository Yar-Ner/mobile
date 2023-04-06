import {Alert} from 'react-native';

const ErrorAlert = (text: string) => {
  Alert.alert('Ошибка', text, [{text: 'OK'}]);
};

export default ErrorAlert;
