import React from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import Modal from "react-native-modal";
import DialogModalStyles from "./DialogModal.styles";
import InputModalStyles from "../InputModal/InputModal.styles";


type DialogModalPropsType = {
    title: string;
    acceptButtonText: string;
    declineButtonText: string;
    isVisible: boolean;
    handleClose: () => void;
    onPressAcceptButton: () => void;
    onPressDeclineButton: () => void;
}

const DialogModal: React.FC<DialogModalPropsType> = ({
    isVisible,
    handleClose,
    title,
    acceptButtonText,
    declineButtonText,
    onPressAcceptButton,
    onPressDeclineButton,
}) => {
    return (
        <Modal
            style={InputModalStyles.background}
            isVisible={isVisible}
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            coverScreen={true}
            onBackdropPress={() => handleClose()}>
            <View style={DialogModalStyles.modal}>
                <View>
                    <Text style={DialogModalStyles.modalTitle}>
                        {title}
                    </Text>
                </View>
                <View style={DialogModalStyles.modalBody}>
                    <TouchableOpacity
                        style={[
                            DialogModalStyles.button,
                            DialogModalStyles.buttonYes,
                        ]}
                        onPress={onPressAcceptButton}>
                        <Text style={DialogModalStyles.buttonText}>{acceptButtonText}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            DialogModalStyles.button,
                            DialogModalStyles.buttonNo,
                        ]}
                        onPress={onPressDeclineButton}>
                        <Text style={DialogModalStyles.buttonText}>{declineButtonText}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default DialogModal;
