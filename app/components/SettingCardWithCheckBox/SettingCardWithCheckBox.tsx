import React from 'react';
import {View, Text} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import SettingCardWithCheckBoxStyles from './SettingCardWithCheckBox.styles';

type SettingCardWithCheckBoxPropsType = {
  id: number;
  title: string;
  description: string;
  value: boolean;
  disabled?: boolean;
  onChange: Function;
};

const SettingCardWithCheckBox: React.FC<SettingCardWithCheckBoxPropsType> = ({
  id,
  title,
  description,
  value,
  disabled = false,
  onChange,
}) => {
  return (
    <View style={SettingCardWithCheckBoxStyles.settingsCard}>
      <View style={SettingCardWithCheckBoxStyles.descriptionContainer}>
        <Text style={SettingCardWithCheckBoxStyles.settingsCardTitle}>
          {title}
        </Text>
        <Text style={SettingCardWithCheckBoxStyles.settingsCardDescription}>
          {description}
        </Text>
      </View>
      <View>
        <CheckBox
          disabled={disabled}
          value={value}
          onValueChange={value => onChange(id, value)}
        />
      </View>
    </View>
  );
};

export default SettingCardWithCheckBox;
