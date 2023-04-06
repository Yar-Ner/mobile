import React from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import Modal from "react-native-modal";
import PhotosModalStyles from "./PhotosModal.styles";
import {Photo} from "../../types";
import PhotoCard from "../PhotoCard/PhotoCard";
import {AddPhotoIcon} from "../../../assets/icons/AddPhotoIcon/AddPhotoIcon";


type PhotosModalPropsType = {
    title: string;
    data: Array<Photo>;
    isVisible: boolean;
    isTablet: boolean;
    acceptButtonText: string;
    cancelButtonText: string;
    handleClose: () => void;
    removePhoto: (id: number | string | undefined, photoURI: string | undefined) => void;
    onPressAcceptButton: () => void;
    onPressDeclineButton: () => void;
    onPressAddButton: () => void;
}

const PhotosModal: React.FC<PhotosModalPropsType> = ({
    isVisible,
    isTablet,
    handleClose,
    title,
    data,
    removePhoto,
    acceptButtonText,
    cancelButtonText,
    onPressDeclineButton,
    onPressAcceptButton,
    onPressAddButton,
}) => {

    return (
        <Modal
            style={PhotosModalStyles.background}
            isVisible={isVisible}
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            coverScreen={true}
            onBackdropPress={() => handleClose()}>
            <View style={PhotosModalStyles.modal}>
                <View>
                    <Text style={PhotosModalStyles.modalTitle}>
                        {title}
                    </Text>
                </View>
                <View style={PhotosModalStyles.addPhotoModalBody}>
                    <View>
                        {!isTablet ? (
                            <View style={PhotosModalStyles.modalImagesContainer}>
                                {data.map((item, index) => (
                                    <PhotoCard
                                        key={index}
                                        id={item.id}
                                        photoURI={item.uri}
                                        removePhoto={removePhoto}
                                    />
                                ))}
                            </View>
                        ) : (
                            <View />
                        )}
                        <TouchableOpacity
                            style={PhotosModalStyles.addPhotoButton}
                            onPress={onPressAddButton}>
                            <AddPhotoIcon width={40} height={40} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={[PhotosModalStyles.button, PhotosModalStyles.acceptButton]}
                        onPress={onPressAcceptButton}>
                        <Text style={PhotosModalStyles.buttonText}>{acceptButtonText}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[PhotosModalStyles.button, PhotosModalStyles.cancelButton]}
                        onPress={onPressDeclineButton}>
                        <Text style={PhotosModalStyles.cancelButtonText}>
                            {cancelButtonText}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default PhotosModal;
