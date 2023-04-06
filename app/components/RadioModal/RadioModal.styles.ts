import {StyleSheet} from 'react-native';
import Device from "react-native-device-detection";
import {AppColors, Fonts} from "../../theme";

const RadioModalStyles = StyleSheet.create({
    background: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        width: Device.isTablet ? '70%' : '100%',
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
        marginTop: 10,
        marginBottom: 20,
        paddingLeft: 20,
        paddingRight: 40,
    },
    radioButton: {
        marginLeft: 10,
    },
    radioButtonLabel: {
        marginLeft: 20,
        ...Fonts.SemiBold,
        fontSize: 14,
        color: '#000000',
    },
});

export default RadioModalStyles;
