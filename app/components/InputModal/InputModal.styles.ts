import {StyleSheet} from 'react-native';
import {AppColors, Fonts} from "../../theme";

const InputModalStyles = StyleSheet.create({
    background: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
    },
    modalTitle: {
        textAlign: 'center',
        paddingVertical: 20,
        color: AppColors.Active,
        ...Fonts.Bold,
        fontSize: 20,
    },
    modalBody: {
        width: '100%',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        paddingBottom: -10,
        textAlign: 'center',
        ...Fonts.Bold,
        backgroundColor: 'transparent',
        borderBottomWidth: 2,
        borderRadius: 8,
        borderColor: AppColors.TaskColor,
        color: AppColors.TaskColor,
    },
    confirmButton: {
        width: '100%',
        paddingVertical: 12,
        borderRadius: 6,
        backgroundColor: AppColors.ButtonTextColor,
    },
    confirmButtonText: {
        ...Fonts.Bold,
        textAlign: 'center',
        fontSize: 16,
        color: AppColors.White,
    },
    error: {
        color: AppColors.Red,
    },
    footer: {
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
});

export default InputModalStyles;
