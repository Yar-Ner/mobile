import React from 'react';
import {TouchableOpacity, View, Image} from 'react-native';
import Device from 'react-native-device-detection';
import PhotoCardStyles from './PhotoCard.styles';
import Icon from 'react-native-vector-icons/Ionicons';

type PhotoCardType = {
  id: number | string | undefined;
  photoURI: string | undefined;
  removePhoto: (id: number | string | undefined, photoURI: string | undefined) => void;
};

const PhotoButton: React.FC<PhotoCardType> = ({id, photoURI, removePhoto}) => {
  return (
    <View style={PhotoCardStyles.container}>
      <TouchableOpacity
        onPress={() => removePhoto(id, photoURI)}
        style={PhotoCardStyles.closeBtn}>
        <Icon
          name={'close-outline'}
          size={Device.isTablet ? 20 : 12}
          color={'#FFF'}
        />
      </TouchableOpacity>
      <Image style={PhotoCardStyles.image} source={{uri: photoURI}} />
    </View>
  );
};

export default PhotoButton;
