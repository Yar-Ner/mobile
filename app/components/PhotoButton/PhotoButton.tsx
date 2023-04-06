import React from 'react';
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Device from 'react-native-device-detection';
import Icon from 'react-native-vector-icons/Ionicons';

type PhotoButtonType = {
  isDisabled: boolean;
  photoCounter: number;
  makePhoto: Function;
  containerStyle: StyleProp<ViewStyle>;
  iconColor: string;
  photoCounterStyle: StyleProp<TextStyle>;
};

const PhotoButton: React.FC<PhotoButtonType> = ({
  isDisabled,
  photoCounter,
  makePhoto,
  containerStyle,
  iconColor,
  photoCounterStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={() => makePhoto()}
      disabled={isDisabled}
      style={containerStyle}>
      <Icon
        name={'camera-outline'}
        size={Device.isTablet ? 30 : 28}
        color={iconColor}
      />
      {!Device.isTablet && (
        <Text style={photoCounterStyle}>{photoCounter}</Text>
      )}
    </TouchableOpacity>
  );
};

export default PhotoButton;
