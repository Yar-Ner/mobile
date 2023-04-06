import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import AlarmButtonStyles from './AlarmButton.styles';
import Icon from 'react-native-vector-icons/Ionicons';
import Device from 'react-native-device-detection';

type AlarmButtonType = {
  onPress: () => void;
};

export const AlarmButton: React.FC<AlarmButtonType> = ({onPress}) => {
  return (
      <TouchableOpacity
          onPress={onPress}
          style={AlarmButtonStyles.button}>
          <Icon
           name={'warning-outline'}
           size={Device.isTablet ? 35 : 20}
           color={'#FFF'}
          />
         <Text style={AlarmButtonStyles.buttonText}>тревога</Text>
      </TouchableOpacity>
  );
};
