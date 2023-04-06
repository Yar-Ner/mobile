import {StyleSheet} from 'react-native';
import Device from "react-native-device-detection";
import {AppColors, Fonts} from "../../theme";

const SuccessModalStyles = StyleSheet.create({
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
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        marginBottom: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: AppColors.ActiveOpacity,
        borderRadius: 50,
    },
    modalDescription: {
        textAlign: 'center',
        lineHeight: 24,
        marginTop: 30,
        marginBottom: 30,
        ...Fonts.Regular,
        fontSize: 18,
    },
});

export default SuccessModalStyles;
