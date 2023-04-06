import React, {useState} from 'react';
import {Text, View} from "react-native";
import Modal from "react-native-modal";
import RadioModalStyles from "./RadioModal.styles";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from "react-native-simple-radio-button";
import {AppColors} from "../../theme";


type RadiuValueType = {
    id: number;
    label: string;
    value: number;
}

type RadioModalPropsType = {
    title: string;
    radioValues: Array<RadiuValueType>;
    isVisible: boolean;
    handleClose: () => void;
    onPress: (value: string, index: number) => void;
}

const RadioModal: React.FC<RadioModalPropsType> = ({
    isVisible,
    handleClose,
    title,
    radioValues,
    onPress,
}) => {

    const [indexState, setIndexState] = useState(0);

    const onPressRadio = (value: string, index: number) => {
        setIndexState(index);
        onPress(value, index);
    }

    return (
        <Modal
            style={RadioModalStyles.background}
            isVisible={isVisible}
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            coverScreen={true}
            onBackdropPress={() => handleClose()}>
            <View style={RadioModalStyles.modal}>
                <View>
                    <Text style={RadioModalStyles.modalTitle}>
                        {title}
                    </Text>
                </View>
                <View style={RadioModalStyles.modalBody}>
                    <RadioForm formHorizontal={false} animation={true}>
                        {radioValues.map((obj, index) => (
                            <RadioButton labelHorizontal={true} key={index}>
                                <RadioButtonInput
                                    obj={obj}
                                    index={index}
                                    onPress={(value) => onPressRadio(value, index)}
                                    isSelected={indexState === index}
                                    buttonInnerColor={AppColors.Red}
                                    buttonOuterColor={AppColors.Black}
                                    buttonSize={10}
                                    buttonOuterSize={15}
                                    buttonStyle={{}}
                                    buttonWrapStyle={RadioModalStyles.radioButton}
                                />
                                <RadioButtonLabel
                                    obj={obj}
                                    onPress={(value) => onPressRadio(value, index)}
                                    index={index}
                                    labelHorizontal={true}
                                    labelStyle={RadioModalStyles.radioButtonLabel}
                                    labelWrapStyle={{}}
                                />
                            </RadioButton>
                        ))}
                    </RadioForm>
                </View>
            </View>
        </Modal>
    )
}

export default RadioModal;
