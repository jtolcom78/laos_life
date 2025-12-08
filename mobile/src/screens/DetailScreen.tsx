import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, Linking, ActivityIndicator, Alert, RefreshControl, useWindowDimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import RenderHtml from 'react-native-render-html';

import { api, getItem } from '../services/api';
import { PriceDisplay } from '../components/PriceDisplay';
import { useLanguageStore } from '../stores/useLanguageStore';
import { ContentLanguageBadges } from '../components/ContentLanguageBadges';

export default function DetailScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { type, id, initialData } = route.params;
    const { language: appLanguage } = useLanguageStore();
    const { width } = useWindowDimensions();

    const [data, setData] = useState<any>(initialData || null);
    const [loading, setLoading] = useState(!initialData);
    const [viewLanguage, setViewLanguage] = useState(appLanguage); // Language for THIS screen
    const [refreshing, setRefreshing] = useState(false);

    // Sync viewLanguage when appLanguage changes
    useEffect(() => {
        setViewLanguage(appLanguage);
    }, [appLanguage]);

    useEffect(() => {
        loadData();
    }, [id, type, viewLanguage]);

    const getEndpoint = (type: string) => {
        switch (type) {
            case 'used_car': return 'cars';
            case 'real_estate':
            case 'rent': return 'real-estates';
            case 'shopping': return 'shops'; // Keeping as 'shops' based on previous code, but logical check handles 'products'
            case 'jobs': return 'jobs';
            case 'news': return 'posts';
            default: return 'posts';
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);
            // 'shopping' mapping logic from previous observation
            const endpoint = (type === 'shopping') ? 'products' : getEndpoint(type);

            const result = await getItem(endpoint, id, { headers: { 'Accept-Language': viewLanguage } });

            if (result) {
                setData(result);
            }
            setLoading(false);
            setRefreshing(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleLanguageSelect = (lang: string) => {
        setViewLanguage(lang as any);
    };

    const handleCall = (phoneNumber: string) => {
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const handleChat = () => {
        Alert.alert('Coming Soon', 'Chat feature is under development.');
    };

    // Memoize static styles
    const tagsStyles = React.useMemo(() => ({
        body: { color: '#4b5563', fontSize: 16, lineHeight: 24 },
        p: { marginBottom: 10 },
        img: { maxWidth: '100%', borderRadius: 8, marginVertical: 10 }
    }), []);

    // Helper for HTML rendering
    const renderHtml = React.useCallback((htmlContent: string) => (
        <RenderHtml
            contentWidth={width - 40} // 40 is padding (20 on each side)
            source={{ html: htmlContent || '<p>No content available.</p>' }}
            tagsStyles={tagsStyles}
        />
    ), [width, tagsStyles]);

    const renderSpecificContent = () => {
        switch (type) {
            case 'used_car':
                return (
                    <View>
                        <View className="flex-row justify-between items-start mb-2">
                            <Text className="text-2xl font-bold text-gray-900 flex-1 mr-2">{data.brand} {data.model}</Text>
                            <PriceDisplay amount={data.price} style={{ color: '#00963c', fontSize: 22, fontWeight: '800' }} />
                        </View>
                        <View className="flex-row items-center mb-6">
                            <Ionicons name="location-outline" size={16} color="#868E96" />
                            <Text className="text-gray-500 ml-1 font-medium">{data.location || '-'} • {data.year}</Text>
                        </View>

                        <View className="bg-gray-100 rounded-xl p-4 mb-6 border border-gray-200">
                            <View className="flex-row justify-between mb-2">
                                <Text className="text-gray-500 font-medium">Mileage</Text>
                                <Text className="font-bold text-gray-800">{data.mileage}</Text>
                            </View>
                            <View className="flex-row justify-between mb-2">
                                <Text className="text-gray-500 font-medium">Fuel Type</Text>
                                <Text className="font-bold text-gray-800">{data.fuelType}</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-gray-500 font-medium">Transmission</Text>
                                <Text className="font-bold text-gray-800">{data.transmission}</Text>
                            </View>
                        </View>

                        <Text className="text-lg font-bold text-gray-800 mb-2">Description</Text>
                        {renderHtml(data.description)}
                    </View>
                );

            case 'real_estate':
            case 'rent':
                return (
                    <View>
                        <View className="mb-2">
                            <Text className="text-2xl font-bold text-gray-900 mb-1">{data.propertyType} in {data.location}</Text>
                            <PriceDisplay amount={data.price} style={{ color: '#00963c', fontSize: 24, fontWeight: '800' }} />
                        </View>
                        <Text className="text-gray-500 font-medium mb-6 uppercase tracking-wide text-xs bg-gray-100 self-start px-2 py-1 rounded">{data.listingType}</Text>

                        <View className="flex-row flex-wrap mb-6">
                            <View className="w-1/2 p-2 flex-row items-center">
                                <Ionicons name="bed-outline" size={20} color="#868E96" />
                                <Text className="ml-2 font-bold text-gray-700">{data.bedrooms || '-'} Beds</Text>
                            </View>
                            <View className="w-1/2 p-2 flex-row items-center">
                                <Ionicons name="water-outline" size={20} color="#868E96" />
                                <Text className="ml-2 font-bold text-gray-700">{data.bathrooms || '-'} Baths</Text>
                            </View>
                        </View>

                        <Text className="text-lg font-bold text-gray-800 mb-2">Description</Text>
                        {renderHtml(data.description)}
                    </View>
                );

            case 'shopping':
                return (
                    <View>
                        <Text className="text-2xl font-bold text-gray-900 mb-2">{data.title}</Text>
                        <PriceDisplay amount={data.price} style={{ color: '#00963c', fontSize: 24, fontWeight: '800', marginBottom: 16 }} />

                        <View className="bg-gray-50 border border-gray-100 p-3 rounded-lg mb-6">
                            <Text className="text-gray-500 font-medium">Condition</Text>
                            <Text className="font-bold text-gray-800">{data.condition || 'Used'}</Text>
                        </View>

                        <Text className="text-lg font-bold text-gray-800 mb-2">Description</Text>
                        {renderHtml(data.description)}
                    </View>
                );

            case 'jobs':
                return (
                    <View>
                        <Text className="text-2xl font-bold text-gray-900 mb-2">{data.industry}</Text>
                        <View className="flex-row items-center mb-6">
                            <Text className="text-laos-green-700 font-bold bg-green-50 px-3 py-1 rounded-full mr-2">{data.jobType}</Text>
                            <Text className="text-gray-600 font-bold">{data.salaryRange}</Text>
                        </View>

                        <Text className="text-lg font-bold text-gray-800 mb-2">Requirements</Text>
                        {renderHtml(data.requirements)}

                        <Text className="text-lg font-bold text-gray-800 mb-2">Description</Text>
                        {renderHtml(data.description)}
                    </View>
                );

            case 'news':
                return (
                    <View>
                        <Text className="text-2xl font-bold text-gray-900 mb-2">{data.title}</Text>
                        <Text className="text-sm text-gray-500 font-medium mb-6">{new Date(data.created_at).toLocaleDateString()}</Text>
                        {renderHtml(data.content || data.description)}
                    </View>
                );

            default:
                return (
                    <View>
                        <Text className="text-xl font-bold">{JSON.stringify(data, null, 2)}</Text>
                    </View>
                );
        }
    };

    if (loading && !data) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-0">
                <ActivityIndicator size="large" color="#00963c" />
            </View>
        );
    }

    if (!data) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-gray-0">
                <Text className="text-gray-500 font-medium">Item not found</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} className="mt-4 p-3 bg-gray-200 rounded-lg">
                    <Text>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <View className="flex-1 bg-white">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} />}
            >
                {/* Image Section */}
                <View className="relative">
                    <Image
                        source={{ uri: data.photos?.[0] || data.thumbnail || 'https://via.placeholder.com/400x300' }}
                        className="w-full h-72 bg-gray-200"
                        resizeMode="cover"
                    />
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="absolute top-12 left-5 w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-sm"
                    >
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>

                    {/* Share Button */}
                    <TouchableOpacity
                        className="absolute top-12 right-5 w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-sm"
                    >
                        <Ionicons name="share-outline" size={22} color="black" />
                    </TouchableOpacity>
                </View>

                {/* Content Section */}
                <View className="p-5">
                    {/* Language Badges */}
                    <ContentLanguageBadges
                        availableLanguages={data.originalLanguages || ['lo']}
                        currentLanguage={viewLanguage}
                        isTranslated={!!data.isTranslated}
                        onLanguageSelect={handleLanguageSelect}
                    />

                    {renderSpecificContent()}
                </View>

            </ScrollView>

            {/* Bottom Action Bar */}
            {type !== 'news' && (
                <SafeAreaView edges={['bottom']} className="bg-white border-t border-gray-100 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <View className="flex-row space-x-3">
                        <TouchableOpacity
                            onPress={handleChat}
                            className="flex-1 bg-gray-100 py-3.5 rounded-xl items-center justify-center active:bg-gray-200"
                        >
                            <Text className="font-bold text-gray-800 text-base">Chat</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleCall(data.contact || '020-0000-0000')}
                            className="flex-1 bg-laos-green-600 py-3.5 rounded-xl items-center justify-center active:bg-laos-green-700 shadow-md shadow-green-200"
                        >
                            <Text className="font-bold text-white text-base">Call Seller</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            )}
        </View>
    );
}
