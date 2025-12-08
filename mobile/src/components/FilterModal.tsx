import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
}

export const FilterModal = ({ visible, onClose }: FilterModalProps) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white rounded-t-3xl p-6 h-[50%]">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-xl font-bold">Filters</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-gray-500 text-center mt-10">Filter options coming soon...</Text>
                </View>
            </View>
        </Modal>
    );
};
