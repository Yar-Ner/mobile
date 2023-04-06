import {StyleSheet} from "react-native";
import {AppColors, Fonts} from "../../theme";

const DropDownComponentStyles = StyleSheet.create({
    container: {
        width: '100%',
    },
    dropdown: {
        height: 32,
        borderColor: 'gray',
        borderBottomWidth: 2,
        ...Fonts.Bold,
    },
    placeholderStyle: {
        fontSize: 12,
        ...Fonts.Bold,
    },
    placeholderStyleDisabled: {
        fontSize: 12,
        ...Fonts.Bold,
        color: AppColors.Success,
    },
    selectedTextStyle: {
        fontSize: 12,
        ...Fonts.Bold,
    },
    selectedTextStyleDisabled: {
        fontSize: 12,
        ...Fonts.Bold,
        color: AppColors.Success,
    },
    iconStyle: {
        width: 10,
        height: 10,
    },
});

export default DropDownComponentStyles;
