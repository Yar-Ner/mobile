import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import AlarmCardStyles from './AlarmCard.styles';
type AlarmCardType = {
  alarmId?: number;
  type?: string;
  name?: string;
  onSelect: Function;
  selected: string | undefined;
};
export const AlarmCard: React.FC<AlarmCardType> = ({
  name = 'Тревога',
  onSelect,
  selected,
  alarmId,
}) => {
  // @ts-ignore

  const SelectValue = (name: string, id: number | undefined) => {
    onSelect(name, id);
  };
  return (
    <TouchableOpacity
      onPress={() => SelectValue(name, alarmId)}
      style={
        selected === name
          ? AlarmCardStyles.selectedContainer
          : AlarmCardStyles.container
      }>
      <View>
        <Text
          style={
            selected === name
              ? AlarmCardStyles.selectedText
              : AlarmCardStyles.text
          }>
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
