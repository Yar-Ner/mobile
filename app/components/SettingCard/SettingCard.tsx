import React from 'react';
import {
  Text,
  TouchableOpacity,
  GestureResponderEvent,
  View,
} from 'react-native';
import SettingCardStyles from './SettingCard.styles';

type SettingCardPropsType = {
  title: string;
  description: string;
  onPress?: (event: GestureResponderEvent) => void;
};

const SettingCard: React.FC<SettingCardPropsType> = ({
  title,
  description,
  onPress,
}) => {
  const card = (_title: string, _description: string) => (
    <View style={SettingCardStyles.settingsCard}>
      <Text style={SettingCardStyles.settingsCardTitle}>{_title}</Text>
      <Text style={SettingCardStyles.settingsCardDescription}>
        {_description}
      </Text>
    </View>
  );

  const buttonCard = (
    _title: string,
    _description: string,
    _onPress: (event: GestureResponderEvent) => void,
  ) => (
    <TouchableOpacity onPress={_onPress} style={SettingCardStyles.settingsCard}>
      <Text style={SettingCardStyles.settingsCardTitle}>{_title}</Text>
      <Text style={SettingCardStyles.settingsCardDescription}>
        {_description}
      </Text>
    </TouchableOpacity>
  );

  return onPress !== undefined
    ? buttonCard(title, description, onPress)
    : card(title, description);
};

export default SettingCard;
