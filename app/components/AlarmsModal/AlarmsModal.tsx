import React, {useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import Modal from "react-native-modal";
import {AlarmCard} from "../AlarmCard/AlarmCard";
import AlarmsModalStyles from "./AlarmsModal.styles";
import {AlarmType} from "../../types";


type AlarmsModalPropsType = {
    title: string;
    data: Array<AlarmType>;
    isVisible: boolean;
    handleSelected: (alarm?: AlarmType) => void;
    handleClose: () => void;
}

const AlarmsModal: React.FC<AlarmsModalPropsType> = ({
    isVisible,
    handleClose,
    title,
    data,
    handleSelected
}) => {
    const [selectedAlarm, setSelectedAlarm] = useState<AlarmType>();

    const handleSelectAlarm = (name: string, id: number) => {
        let alarm: AlarmType = {
            id: id,
            type: '',
            icon: '',
            name: name,
        };
        setSelectedAlarm(alarm);
    };

    const sendAlarm = () => {
        if (!selectedAlarm) {
            handleSelected(undefined);
            return;
        }
        handleSelected(selectedAlarm);
    }

    return (
        <Modal
            style={AlarmsModalStyles.background}
            isVisible={isVisible}
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            coverScreen={true}
            onBackdropPress={() => handleClose()}>
            <View style={AlarmsModalStyles.modal}>
                <View>
                    <Text style={AlarmsModalStyles.modalTitle}>
                        {title}
                    </Text>
                </View>
                <FlatList
                    style={AlarmsModalStyles.modalBody}
                    data={data}
                    renderItem={({item}) => (
                        <AlarmCard
                            alarmId={item.id}
                            onSelect={handleSelectAlarm}
                            selected={selectedAlarm?.name}
                            name={item.name}
                        />
                    )}
                />
                <TouchableOpacity
                    onPress={() => sendAlarm()}
                    disabled={!selectedAlarm}
                    style={[
                        selectedAlarm
                            ? AlarmsModalStyles.alarmModalConfirmButtonSelected
                            : AlarmsModalStyles.alarmModalConfirmButton,
                    ]}>
                    <Text
                        style={[
                            selectedAlarm
                                ? AlarmsModalStyles.alarmModalConfirmButtonTextSelected
                                : AlarmsModalStyles.alarmModalConfirmButtonText,
                        ]}>
                        Отправить
                    </Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

export default AlarmsModal;
