import {StyleSheet} from 'react-native';
import {AppColors, Fonts} from "../../theme";

const ChooseModalStyles = StyleSheet.create({
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
        marginTop: 10,
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
});

export default ChooseModalStyles;
