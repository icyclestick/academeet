import React from 'react';
import { Modal, View, TouchableWithoutFeedback } from 'react-native';

type ModalWrapperProps = {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

const ModalWrapper: React.FC<ModalWrapperProps> = ({ visible, onClose, children }) => (
    <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={onClose}
    >
        <TouchableWithoutFeedback onPress={onClose}>
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.3)',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <TouchableWithoutFeedback>
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 16,
                        padding: 24,
                        minWidth: '80%',
                        maxWidth: 400,
                        elevation: 8
                    }}>
                        {children}
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
    </Modal>
);

export default ModalWrapper;