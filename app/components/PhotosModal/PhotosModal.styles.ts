import {StyleSheet} from 'react-native';
import Device from "react-native-device-detection";
import {AppColors, Fonts} from "../../theme";

const PhotosModalStyles = StyleSheet.create({
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
    addPhotoModalBody: {
        width: Device.isTablet ? '80%' : '90%',
        paddingHorizontal: 5,
        paddingBottom: 20,
    },
    modalImagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    addPhotoButton: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#DBE2F6',
        borderRadius: 5,
    },
    buttonText: {
        ...Fonts.Bold,
        color: AppColors.White,
        fontSize: 15,
        textAlign: 'center',
    },
    cancelButtonText: {
        ...Fonts.Bold,
        textAlign: 'center',
        color: AppColors.TaskColor,
    },
    button: {
        width: '100%',
        marginTop: 10,
        padding: 20,
        borderRadius: 8,
    },
    acceptButton: {
        backgroundColor: AppColors.ButtonTextColor,
    },
    cancelButton: {
        backgroundColor: AppColors.InactiveButton,
    },
});

export default PhotosModalStyles;
