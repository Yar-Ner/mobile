import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import Device from 'react-native-device-detection';
import Icon from 'react-native-vector-icons/Ionicons';
import {AppColors} from '../../theme/Colors';
import AddressTextStyles from './AddressText.styles';
type AddressTextType = {
  text: string | undefined;
  showOnMap: Function;
  lat: number | null;
  lon: number | null;
};

const AddressText: React.FC<AddressTextType> = ({
  text,
  showOnMap,
  lat,
  lon,
}) => {
  return (
    <View style={AddressTextStyles.container}>
      <Icon
        style={AddressTextStyles.locationIcon}
        name={'location-outline'}
        size={Device.isTablet ? 18 : 16}
        color={AppColors.Red}
      />
      <TouchableOpacity onPress={() => showOnMap(lat, lon)}>
        <Text style={AddressTextStyles.text}>
          {text !== undefined ? text : 'адрес неопределен'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddressText;
