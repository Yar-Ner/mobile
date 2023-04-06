import {StyleSheet} from 'react-native';
import {AppColors, Fonts} from "../../theme";

const DialogModalStyles = StyleSheet.create({
    background: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        width:'100%',
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
        marginTop: 10,
        width: '100%',
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
    button: {
        width: '100%',
        marginTop: 10,
        backgroundColor: AppColors.ButtonTextColor,
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonYes: {
        backgroundColor: AppColors.Active,
    },
    buttonNo: {
        backgroundColor: AppColors.Red,
    },
    buttonText: {
        ...Fonts.Bold,
        color: AppColors.White,
        fontSize: 15,
        textAlign: 'center',
    },
});

export default DialogModalStyles;
