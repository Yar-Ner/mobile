import {StyleSheet} from 'react-native';
import Device from "react-native-device-detection";
import {AppColors, Fonts} from "../../theme";

const AlarmsModalStyles = StyleSheet.create({
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
        marginTop: 10,
        width: '100%',
        paddingHorizontal: 30,
        paddingVertical: 10,
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
    description: {
        textAlign: 'center',
        lineHeight: 24,
        marginTop: 30,
        marginBottom: 30,
        ...Fonts.Regular,
        fontSize: 18,
    },
    alarmModalConfirmButton: {
        width: '90%',
        marginHorizontal: 15,
        marginVertical: 10,
        paddingVertical: 12,
        borderRadius: 6,
        backgroundColor: AppColors.ModalButtonColor,
    },
    alarmModalConfirmButtonSelected: {
        width: '90%',
        marginHorizontal: 15,
        marginVertical: 10,
        paddingVertical: 12,
        borderRadius: 6,
        backgroundColor: AppColors.ButtonTextColor,
    },
    alarmModalConfirmButtonText: {
        ...Fonts.Bold,
        color: AppColors.TaskColor,
        textAlign: 'center',
        fontSize: 16,
    },
    alarmModalConfirmButtonTextSelected: {
        ...Fonts.Bold,
        textAlign: 'center',
        fontSize: 16,
        color: AppColors.White,
    },
});

export default AlarmsModalStyles;
