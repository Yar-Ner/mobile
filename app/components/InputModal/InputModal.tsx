import React, {useState} from 'react';
import {KeyboardTypeOptions, Text, TextInput, TouchableOpacity, View} from "react-native";
import Modal from "react-native-modal";
import InputModalStyles from "./InputModal.styles";


type InputModalPropsType = {
    title: string;
    keyBoardType: KeyboardTypeOptions;
    isVisible: boolean;
    inputError: string;
    handleClose: () => void;
    submitValue: (value: string) => void;
}

const InputModal: React.FC<InputModalPropsType> = ({
    isVisible,
    handleClose,
    title,
    keyBoardType,
    submitValue,
    inputError
}) => {
    const [value, setValue] = useState('');

    const _submitValue = () => {
        submitValue(value);
    }

    return (
        <Modal
            style={InputModalStyles.background}
            isVisible={isVisible}
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            coverScreen={true}
            onBackdropPress={() => handleClose()}>
            <View style={InputModalStyles.modal}>
                <View>
                    <Text style={InputModalStyles.modalTitle}>
                        {title}
                    </Text>
                </View>
                <View style={InputModalStyles.modalBody}>
                    <TextInput
                        style={InputModalStyles.input}
                        onChangeText={(value) => setValue(value)}
                        value={value}
                        keyboardType={keyBoardType}
                    />
                    <Text style={InputModalStyles.error}>
                        {inputError}
                    </Text>
                </View>
                <View style={InputModalStyles.footer}>
                    <TouchableOpacity
                        onPress={() => _submitValue()}
                        style={InputModalStyles.confirmButton}>
                        <Text
                            style={InputModalStyles.confirmButtonText}>
                            Готово
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default InputModal;
