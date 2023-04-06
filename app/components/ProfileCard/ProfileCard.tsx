import React, {useState} from 'react';
import {Text, View, Image, TouchableOpacity, Dimensions} from 'react-native';
import ProfileCardStyles from './ProfileCard.styles';
type ProfileCardType = {
  driverName: string | null;
  carPlate: string | null;
  onClick: Function;
};

export const ProfileCard: React.FC<ProfileCardType> = ({
  driverName,
  carPlate,
  onClick,
}) => {
  const [isLandscape, setIsLandscape] = useState(false);
  Dimensions.addEventListener('change', () => {
    let dimension = Dimensions.get('screen');
    if (dimension.width > dimension.height) {
      setIsLandscape(true);
    } else {
      setIsLandscape(false);
    }
  });
  // @ts-ignore
  return (
    <TouchableOpacity
      onPress={() => onClick()}
      style={ProfileCardStyles.container}>
      <View>
        <Image
          style={[
            ProfileCardStyles.profileImage,
            isLandscape && ProfileCardStyles.isLandscapeProfileImage,
          ]}
          source={require('../../../assets/images/profile.png')}
        />
      </View>
      <View style={ProfileCardStyles.profileInfoContainer}>
        <Text
          style={[
            ProfileCardStyles.profileText,
            isLandscape && ProfileCardStyles.isLandscapeText,
          ]}>
          {driverName}
        </Text>
        <Text style={ProfileCardStyles.profileText}>{carPlate}</Text>
      </View>
    </TouchableOpacity>
  );
};
