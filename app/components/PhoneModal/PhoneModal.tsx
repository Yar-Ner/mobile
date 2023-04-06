import React, {useRef, useState} from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import Modal from "react-native-modal";
import PhoneModalStyles from "./PhoneModal.styles";
import SettingsScreenStyles from "../../screens/SettingsScreen/SettingsScreen.styles";
import PhoneInput from "react-native-phone-number-input";


type PhoneModalPropsType = {
    title: string;
    initialValue: string;
    isVisible: boolean;
    handleClose: () => void;
    onSubmit: (phone: string) => void;
}

const PhoneModal: React.FC<PhoneModalPropsType> = ({
   isVisible,
   handleClose,
   title,
   initialValue,
    onSubmit
}) => {
    const [phone, setPhone] = useState('');
    const [formattedPhone, setFormattedPhone] = useState(initialValue);
    const [IsNotValidPhone, setIsNotValidPhone] = useState(false);
    const phoneInput = useRef<PhoneInput>(null);


    const handleChange = () => {
        const checkValid = phoneInput.current?.isValidNumber(phone);

        if (!checkValid) {
            setIsNotValidPhone(true);
            return;
        }
        setIsNotValidPhone(false);
        onSubmit(formattedPhone);
    }

    return (
        <Modal
            style={PhoneModalStyles.background}
            isVisible={isVisible}
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            coverScreen={true}
            onBackdropPress={() => handleClose()}>
            <View style={PhoneModalStyles.modal}>
                <View>
                    <Text style={PhoneModalStyles.modalTitle}>
                        {title}
                    </Text>
                </View>
                <View style={PhoneModalStyles.modalBody}>
                    <PhoneInput
                        containerStyle={SettingsScreenStyles.phoneInput}
                        textInputStyle={SettingsScreenStyles.phoneInputText}
                        codeTextStyle={SettingsScreenStyles.phoneCode}
                        ref={phoneInput}
                        defaultValue={phone}
                        defaultCode="RU"
                        layout="first"
                        onChangeText={text => {
                            setPhone(text);
                        }}
                        onChangeFormattedText={text => {
                            setFormattedPhone(text);
                        }}
                        withShadow
                        autoFocus
                    />
                    {IsNotValidPhone && (
                        <Text style={SettingsScreenStyles.error}>
                            Вы указали неправильный номер телефона
                        </Text>
                    )}
                </View>
                <View style={PhoneModalStyles.footer}>
                    <TouchableOpacity
                        onPress={() => handleChange()}
                        style={PhoneModalStyles.confirmButton}>
                        <Text
                            style={PhoneModalStyles.confirmButtonText}>
                            Готово
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default PhoneModal;
