import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';

export default function SearchScreen() {
    const navigation = useNavigation();
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!keyword.trim()) return;
        setLoading(true);
        const data = await api.search(keyword);
        setResults(data);
        setLoading(false);
    };

    const renderSection = (title: string, data: any[], type: string) => {
        if (!data || data.length === 0) return null;
        return (
            <View className="mb-6">
                <Text className="text-lg font-bold text-gray-800 mb-3 px-4">{title} ({data.length})</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4">
                    {data.map((item) => (
                        <TouchableOpacity key={item.id} className="mr-4 w-40 bg-white rounded-xl shadow-sm overflow-hidden">
                            <Image source={{ uri: item.photos?.[0] || item.thumbnail || 'https://via.placeholder.com/150' }} className="w-full h-24 bg-gray-200" />
                            <View className="p-3">
                                <Text className="font-bold text-gray-800 text-sm" numberOfLines={1}>{item.title || item.name || item.brand + ' ' + item.model}</Text>
                                <Text className="text-gray-500 text-xs" numberOfLines={1}>{item.price ? `$${item.price}` : item.location}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            <View className="bg-white pt-12 pb-4 px-4 shadow-sm flex-row items-center z-10">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 mr-2">
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View className="flex-1 bg-gray-100 rounded-xl flex-row items-center px-4 py-2">
                    <Ionicons name="search" size={20} color="gray" />
                    <TextInput
                        value={keyword}
                        onChangeText={setKeyword}
                        onSubmitEditing={handleSearch}
                        placeholder="Search everything..."
                        className="flex-1 ml-2 text-base"
                        autoFocus
                    />
                    {keyword.length > 0 && (
                        <TouchableOpacity onPress={() => setKeyword('')}>
                            <Ionicons name="close-circle" size={18} color="gray" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#006400" />
                </View>
            ) : (
                <ScrollView className="flex-1 py-6">
                    {results ? (
                        <>
                            {renderSection('Used Cars', results.cars, 'car')}
                            {renderSection('Real Estate', results.realEstates, 'real_estate')}
                            {renderSection('Used Goods', results.products, 'product')}
                            {renderSection('Jobs', results.jobs, 'job')}
                            {renderSection('Shops', results.shops, 'shop')}
                            {renderSection('News', results.posts, 'post')}

                            {Object.values(results).every((arr: any) => arr.length === 0) && (
                                <View className="items-center justify-center py-20">
                                    <Ionicons name="search-outline" size={48} color="#ccc" />
                                    <Text className="text-gray-400 mt-4">No results found</Text>
                                </View>
                            )}
                        </>
                    ) : (
                        <View className="items-center justify-center py-20 px-10">
                            <Text className="text-gray-400 text-center">Search for cars, houses, jobs, and more...</Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
}
