import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import WeightInputStyles from './WeightInput.styles';

type WeightInputType = {
    label: string;
    disable: boolean;
    value: string | number;
    onPress?: Function;
    textColor?: string;
};
export const WeightInput: React.FC<WeightInputType> = ({
    label,
    disable,
    value,
    onPress,
    textColor,
}) => {

  const buttonInput = (_value: string | number) => (
      <TouchableOpacity
          style={WeightInputStyles.button}
          onPress={() => onPress !== undefined && onPress()}>
          <Text
              style={[
                  WeightInputStyles.text,
                  WeightInputStyles.textLikeButton,
              ]}>
              {value}
          </Text>
      </TouchableOpacity>
  )

  const input = (_value: string | number) => (
     <Text style={[WeightInputStyles.text, {color: textColor?.length ? textColor : '#000000'}]}>
         {value}
     </Text>
  )


  return (
      <View style={WeightInputStyles.weightInputContainer}>
          <Text style={WeightInputStyles.label}>{label}</Text>
          {disable ? input(value) : buttonInput(value)}
      </View>
  );
};
