import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MultiLangInput } from '../components/MultiLangInput';
import { createItem } from '../services/api';

const getEndpoint = (category: string) => {
    switch (category) {
        case 'used_car': return 'cars';
        case 'real_estate':
        case 'rent': return 'real-estates';
        case 'shopping': return 'shops';
        case 'jobs': return 'jobs';
        case 'news': return 'posts';
        default: return 'posts';
    }
};

export default function CreatePostScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { category } = route.params; // 'used_car', 'shopping', 'real_estate', 'rent', 'jobs', 'news'

    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState<{ [key: string]: string }>({});
    const [description, setDescription] = useState<{ [key: string]: string }>({});
    const [price, setPrice] = useState('');

    // Simplistic price input using MultiLangInput is overkill? No, Price is just a number/string.
    // Use simple TextInput for Price. Import TextInput?
    // Oh, I removed TextInput import. I need to keep it or re-add it.
    // I'll re-add TextInput import.

    const mapPayload = () => {
        const base = { price: price ? Number(price) : 0 };
        // Default fallbacks for required fields
        const defaultString = title.en || title.lo || title.ko || title.zh || 'Untitled';

        switch (category) {
            case 'shopping':
                return { ...base, title, description, condition: 'New' };
            case 'jobs':
                // Job: title (jsonb), content (jsonb), salaryRange (string).
                // Map title -> title. Map description -> content.
                // salaryRange -> price
                return { ...base, title, content: description, salaryRange: price, industry: 'General', jobType: 'Full-time' };
            case 'news':
                // Post: title (jsonb), content (jsonb)
                return { ...base, title, content: description };
            case 'used_car':
                // Car: brand (string), model (string), description (jsonb), location (jsonb)
                // We can't put multilang title into brand (string).
                return {
                    ...base,
                    brand: defaultString,
                    model: 'General',
                    description,
                    location: { lo: 'Vientiane', en: 'Vientiane' },
                    year: 2024
                };
            case 'real_estate':
            case 'rent':
                // RealEstate: location (jsonb), description (jsonb), price. No title.
                // Map title input to location?
                return {
                    ...base,
                    location: title,
                    description,
                    propertyType: 'House',
                    listingType: category === 'rent' ? 'Rent' : 'Sale'
                };
            default:
                return { ...base, title, content: description };
        }
    };

    const handleSubmit = async () => {
        // Validate: at least one language for title and description
        const hasTitle = Object.values(title).some(v => v.trim());
        const hasDesc = Object.values(description).some(v => v.trim());

        if (!hasTitle || !hasDesc) {
            Alert.alert('Error', 'Please fill in title and description in at least one language.');
            return;
        }

        setLoading(true);
        try {
            const endpoint = getEndpoint(category);
            const payload = mapPayload();

            const result = await createItem(endpoint, payload);

            setLoading(false);
            if (result) {
                Alert.alert('Success', 'Post created successfully!', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                Alert.alert('Error', 'Failed to create post. Please try again.');
            }
        } catch (error) {
            setLoading(false);
            Alert.alert('Error', 'An error occurred.');
            console.error(error);
        }
    };

    return (
        <View className="flex-1 bg-white">
            <SafeAreaView edges={['top']} className="bg-white" />

            {/* Header */}
            <View className="px-4 py-3 border-b border-gray-100 flex-row justify-between items-center bg-white sticky top-0 z-10 w-full">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                    <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
                <Text className="font-bold text-lg capitalize">{t('create_new')} {category?.replace('_', ' ')}</Text>
                <TouchableOpacity onPress={handleSubmit} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#006400" />
                    ) : (
                        <Text className="text-laos-green font-bold text-base">Post</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4" keyboardShouldPersistTaps="handled">
                {/* Image Upload Placeholder */}
                <TouchableOpacity className="w-full h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl items-center justify-center mb-6">
                    <Ionicons name="camera-outline" size={40} color="gray" />
                    <Text className="text-gray-400 mt-2">Add Photos</Text>
                </TouchableOpacity>

                {/* Form Fields */}
                <View className="space-y-4">
                    <MultiLangInput
                        label={category === 'real_estate' || category === 'rent' ? "Location (Multilingual)" : "Title / Name"}
                        value={title}
                        onChange={setTitle}
                        placeholder={category === 'real_estate' || category === 'rent' ? "Enter location..." : "Enter title..."}
                    />

                    <View>
                        <Text className="text-sm font-bold text-gray-700 mb-2">
                            {category === 'jobs' ? 'Salary Range' : 'Price'}
                        </Text>
                        <TextInput
                            value={price}
                            onChangeText={setPrice}
                            placeholder="0"
                            keyboardType="numeric"
                            className="bg-gray-50 p-4 rounded-xl text-gray-800 border border-gray-200"
                        />
                    </View>

                    <MultiLangInput
                        label="Description"
                        value={description}
                        onChange={setDescription}
                        placeholder="Describe your item..."
                        multiline={true}
                        numberOfLines={6}
                    />
                </View>

                {category === 'real_estate' && (
                    <View className="mt-4 p-4 bg-blue-50 rounded-xl">
                        <Text className="text-blue-800 text-sm">Additional fields for Real Estate (Bed, Bath, etc.) will appear here.</Text>
                    </View>
                )}

                <View className="h-10" />
            </ScrollView>
        </View>
    );
}
