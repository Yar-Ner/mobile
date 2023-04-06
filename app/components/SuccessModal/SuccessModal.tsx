import React from 'react';
import {Text, View} from "react-native";
import Modal from "react-native-modal";
import SuccessModalStyles from "./SuccessModal.styles";
import Icon from "react-native-vector-icons/Ionicons";
import {AppColors} from "../../theme";


type SuccessModalPropsType = {
    title: string;
    description?: string;
    isVisible: boolean;
    handleClose: () => void;
}

const SuccessModal: React.FC<SuccessModalPropsType> = ({isVisible, handleClose, title, description}) => {
    return (
        <Modal
            style={SuccessModalStyles.background}
            isVisible={isVisible}
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            coverScreen={true}
            onBackdropPress={() => handleClose()}>
            <View style={SuccessModalStyles.modal}>
                <View>
                    <Text style={SuccessModalStyles.modalTitle}>
                        {title}
                    </Text>
                </View>
                <View style={SuccessModalStyles.modalBody}>
                    <View style={SuccessModalStyles.iconContainer}>
                        <Icon
                            name={'checkmark-outline'}
                            size={30}
                            color={AppColors.Active}
                        />
                    </View>
                    <Text style={SuccessModalStyles.modalDescription}>
                        {description}
                    </Text>
                </View>
            </View>
        </Modal>
    )
}

export default SuccessModal;
