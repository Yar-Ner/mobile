import React, {useEffect, useState} from "react";
import {View} from "react-native";
import DropDownComponentStyles from "./DropDownComponent.styles";
import {Dropdown} from "react-native-element-dropdown";

export type DropDownComponentDataType = {
    label: string;
    value: string;
}

type DropDownComponentPropsType = {
    label: string;
    disable: boolean;
    data: Array<DropDownComponentDataType>;
    onChange: Function;
    initialValue: string;
}

export const DropDownComponent:React.FC<DropDownComponentPropsType> = ({
    label,
    disable,
    initialValue,
    data,
    onChange
}) => {
    const [value, setValue] = useState<string>('0');

    useEffect(() => {
        setValue(initialValue?.toString());
    }, [initialValue]);



    const _onChangeItem = (item: DropDownComponentDataType) => {
        setValue(item.value);
        onChange(item);
    }

    return (
        <View style={DropDownComponentStyles.container}>
            <Dropdown
                style={DropDownComponentStyles.dropdown}
                placeholderStyle={[DropDownComponentStyles.placeholderStyle,
                    disable && DropDownComponentStyles.placeholderStyleDisabled ]}
                selectedTextStyle={[DropDownComponentStyles.selectedTextStyle,
                    disable && DropDownComponentStyles.selectedTextStyleDisabled]}
                iconStyle={DropDownComponentStyles.iconStyle}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={label}
                disable={disable}
                value={value}
                onChange={item => _onChangeItem(item)}
            />
        </View>
    )
}
