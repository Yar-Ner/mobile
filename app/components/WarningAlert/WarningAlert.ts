import {Alert} from 'react-native';

const WarningAlert = (text: string) => {
  Alert.alert('Внимание!', text, [{text: 'OK'}]);
};

export default WarningAlert;
