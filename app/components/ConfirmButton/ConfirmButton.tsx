import React from 'react';
import {
  StyleProp,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Device from 'react-native-device-detection';
import Icon from 'react-native-vector-icons/Ionicons';

type ConFirmButtonType = {
  isDisabled: boolean;
  closeOrder: Function;
  containerStyle: StyleProp<ViewStyle>;
  iconColor: string;
};

const PhotoButton: React.FC<ConFirmButtonType> = ({
  isDisabled,
  closeOrder,
  containerStyle,
  iconColor,
}) => {
  return (
    <TouchableOpacity
      onPress={() => closeOrder()}
      disabled={isDisabled}
      style={containerStyle}>
      <Icon
        name={'checkmark-outline'}
        size={Device.isTablet ? 30 : 28}
        color={iconColor}
      />
    </TouchableOpacity>
  );
};

export default PhotoButton;
