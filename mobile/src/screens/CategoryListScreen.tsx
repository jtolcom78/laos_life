import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Modal, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { FilterModal } from '../components/FilterModal';
import { PriceDisplay } from '../components/PriceDisplay';
import { LinearGradient } from 'expo-linear-gradient';

export default function CategoryListScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { t, i18n } = useTranslation();
    const { category } = route.params;

    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterVisible, setFilterVisible] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    // Permission check for creating content
    const CAN_CREATE_CATEGORIES = ['used_car', 'real_estate', 'rent', 'shopping', 'jobs'];
    const canCreate = CAN_CREATE_CATEGORIES.includes(category);

    useEffect(() => {
        // Initial load
        fetchItems();
    }, [category, i18n.language]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            let data = [];
            switch (category) {
                case 'used_car':
                    data = await api.getCars();
                    break;
                case 'real_estate':
                case 'rent':
                    data = await api.getRealEstates();
                    break;
                case 'jobs':
                    data = await api.getJobs();
                    break;
                case 'shopping':
                    data = await api.getProducts();
                    break;
                case 'news':
                    data = await api.getPosts();
                    // filter only news
                    data = data.filter((item: any) => item.category === '정부소식');
                    break;
                default:
                    // Generic services or others
                    data = [];
            }
            setItems(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getLocalizedContent = (data: any) => {
        if (!data) return '';
        if (typeof data === 'string') return data;
        const lang = i18n.language || 'lo';
        return data[lang] || data['lo'] || data['en'] || Object.values(data)[0] || '';
    };

    const renderItem = ({ item }: { item: any }) => {
        const commonStyle = "bg-white rounded-2xl shadow-sm mb-4 border border-gray-100 overflow-hidden active:scale-[0.99] transition-all";

        if (category === 'used_car') {
            return (
                <TouchableOpacity
                    className={commonStyle}
                    onPress={() => navigation.navigate('Detail', { type: category, id: item.id, initialData: item })}
                >
                    <Image source={{ uri: item.photos?.[0] || 'https://via.placeholder.com/300' }} className="w-full h-48 bg-gray-100" />
                    <View className="p-4">
                        <View className="flex-row items-center mb-1">
                            <View className="bg-gray-100 px-2 py-0.5 rounded-md mr-2">
                                <Text className="text-gray-500 text-xs font-bold">{item.year}</Text>
                            </View>
                            <Text className="text-lg font-bold text-gray-900 flex-1" numberOfLines={1}>{item.brand} {item.model}</Text>
                        </View>
                        <PriceDisplay amount={item.price} style={{ color: '#00963c', fontWeight: '800', fontSize: 18 }} />
                        <Text className="text-gray-400 text-xs font-medium mt-2">{item.mileage} • {getLocalizedContent(item.location)}</Text>
                    </View>
                </TouchableOpacity>
            );
        }

        if (category === 'real_estate' || category === 'rent') {
            return (
                <TouchableOpacity
                    className={commonStyle}
                    onPress={() => navigation.navigate('Detail', { type: category, id: item.id, initialData: item })}
                >
                    <Image source={{ uri: item.photos?.[0] || 'https://via.placeholder.com/300' }} className="w-full h-52 bg-gray-100" />
                    <View className="p-4">
                        <View className="flex-row justify-between items-start mb-1">
                            <Text className="text-lg font-bold text-gray-900 flex-1">{item.propertyType}</Text>
                            <PriceDisplay amount={item.price} style={{ color: '#00963c', fontWeight: '800', fontSize: 18 }} />
                        </View>
                        <Text className="text-gray-500 text-sm font-medium mb-3">{getLocalizedContent(item.location)}</Text>
                        <View className="flex-row items-center space-x-4">
                            <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-lg">
                                <Ionicons name="bed-outline" size={16} color="#495057" />
                                <Text className="ml-1 text-gray-700 font-medium">{item.bedrooms || 0}</Text>
                            </View>
                            <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-lg ml-2">
                                <Ionicons name="water-outline" size={16} color="#495057" />
                                <Text className="ml-1 text-gray-700 font-medium">{item.bathrooms || 0}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }

        if (category === 'shopping') {
            return (
                <TouchableOpacity
                    className={`${commonStyle} flex-row h-36`}
                    onPress={() => navigation.navigate('Detail', { type: category, id: item.id, initialData: item })}
                >
                    <Image source={{ uri: item.photos?.[0] || 'https://via.placeholder.com/150' }} className="w-36 h-full bg-gray-100" />
                    <View className="flex-1 p-3.5 justify-between">
                        <View>
                            <Text className="text-gray-900 font-bold mb-1 text-[15px] leading-snug" numberOfLines={2}>
                                {getLocalizedContent(item.title)}
                            </Text>
                            <View className="bg-gray-100 self-start px-2 py-0.5 rounded-md mt-1">
                                <Text className="text-xs text-gray-500 font-medium">{item.condition || 'Used'}</Text>
                            </View>
                        </View>
                        <PriceDisplay amount={item.price} style={{ color: '#00963c', fontWeight: '800', fontSize: 17 }} />
                    </View>
                </TouchableOpacity>
            );
        }

        if (category === 'jobs') {
            return (
                <TouchableOpacity
                    className={`${commonStyle} p-5 flex-row items-center`}
                    onPress={() => navigation.navigate('Detail', { type: category, id: item.id, initialData: item })}
                >
                    <View className="w-14 h-14 bg-indigo-50 rounded-2xl items-center justify-center mr-4 shadow-sm border border-indigo-100">
                        <Ionicons name="briefcase" size={24} color="#4C6EF5" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-900">{item.industry}</Text>
                        <View className="flex-row items-center mt-1">
                            <Text className="text-gray-500 font-medium text-xs">{item.jobType}</Text>
                            <Text className="text-gray-300 mx-1">•</Text>
                            <Text className="text-gray-700 font-semibold text-sm">{item.salaryRange}</Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#ADB5BD" />
                </TouchableOpacity>
            );
        }

        // Default / News
        return (
            <TouchableOpacity
                className={`${commonStyle} p-4`}
                onPress={() => navigation.navigate('Detail', { type: category, id: item.id, initialData: item })}
            >
                <View className="flex-row">
                    {item.thumbnail && <Image source={{ uri: item.thumbnail }} className="w-24 h-24 rounded-xl mr-4 bg-gray-100" />}
                    <View className="flex-1 justify-center">
                        <View className="bg-green-50 self-start px-2 py-0.5 rounded-md mb-2">
                            <Text className="text-[10px] font-bold text-green-700">NEWS</Text>
                        </View>
                        <Text className="text-[16px] font-bold text-gray-900 leading-snug mb-1">
                            {getLocalizedContent(item.title)}
                        </Text>
                        <Text className="text-xs text-gray-400 font-medium">{new Date(item.created_at).toLocaleDateString()}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            <StatusBar barStyle="light-content" />

            {/* Gradient Header - Compact */}
            <LinearGradient
                colors={['#006400', '#00963c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="pt-12 pb-4 px-4 rounded-b-[24px] shadow-md z-10"
            >
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center bg-white/20 rounded-full">
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>

                    <Text className="text-lg font-bold text-white tracking-wide">{t(`menu_${category}`)}</Text>

                    <TouchableOpacity onPress={() => setFilterVisible(true)} className="w-10 h-10 items-center justify-center bg-white/20 rounded-full">
                        <Ionicons name="options" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* List */}
            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#00963c" />
                </View>
            ) : (
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ padding: 16, paddingTop: 20 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View className="items-center justify-center py-20">
                            <Ionicons name="file-tray-outline" size={48} color="#CED4DA" />
                            <Text className="text-gray-400 mt-4 font-medium">No items found</Text>
                        </View>
                    }
                />
            )}

            {/* Filter Modal - Polished */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={filterVisible}
                onRequestClose={() => setFilterVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/60">
                    <View className="bg-white rounded-t-[32px] p-6 h-[70%] shadow-2xl">
                        <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-6" />

                        <View className="flex-row justify-between items-center mb-8">
                            <Text className="text-2xl font-bold text-gray-900">Filters</Text>
                            <TouchableOpacity onPress={() => setFilterVisible(false)} className="bg-gray-100 p-2 rounded-full">
                                <Ionicons name="close" size={20} color="#495057" />
                            </TouchableOpacity>
                        </View>

                        <Text className="text-gray-500 font-medium text-center mt-10">
                            Filter options for {t(`menu_${category}`)} will appear here...
                        </Text>

                        {/* Placeholder for future filter implementation */}
                        <View className="mt-auto">
                            <TouchableOpacity
                                className="bg-laos-green-600 py-4 rounded-xl shadow-lg shadow-green-200 items-center"
                                onPress={() => setFilterVisible(false)}
                            >
                                <Text className="text-white font-bold text-lg">Apply Filters</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Create FAB */}
            {canCreate && (
                <TouchableOpacity
                    onPress={() => navigation.navigate('CreatePost', { category })}
                    className="absolute bottom-8 right-6"
                >
                    <LinearGradient
                        colors={['#00963c', '#40c057']}
                        className="w-16 h-16 rounded-full items-center justify-center shadow-xl border-4 border-white/20"
                        style={{ elevation: 8 }}
                    >
                        <Ionicons name="add" size={36} color="white" />
                    </LinearGradient>
                </TouchableOpacity>
            )}
        </View>
    );
}
