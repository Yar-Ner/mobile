import React, {ReactNode} from 'react';
import {Text, View} from "react-native";
import Modal from "react-native-modal";
import ChooseModalStyles from "./ChooseModal.styles";
import InputModalStyles from "../InputModal/InputModal.styles";


type ChooseModalPropsType = {
    title: string;
    isVisible: boolean;
    handleClose: () => void;
    children: ReactNode;
}

const ChooseModal: React.FC<ChooseModalPropsType> = ({
    isVisible,
    handleClose,
    title,
    children
}) => {
    return (
        <Modal
            style={InputModalStyles.background}
            isVisible={isVisible}
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            coverScreen={true}
            onBackdropPress={() => handleClose()}>
            <View style={ChooseModalStyles.modal}>
                <View>
                    <Text style={ChooseModalStyles.modalTitle}>
                        {title}
                    </Text>
                </View>
                <View style={ChooseModalStyles.modalBody}>
                    {children}
                </View>
            </View>
        </Modal>
    )
}

export default ChooseModal;
