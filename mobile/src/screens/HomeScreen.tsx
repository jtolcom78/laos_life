import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { api } from '../services/api';
import { useTranslation } from 'react-i18next';
import { PriceDisplay } from '../components/PriceDisplay';

export default function HomeScreen() {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const [news, setNews] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [newsData, productsData, jobsData] = await Promise.all([
                api.getPosts(),
                api.getProducts(),
                api.getJobs()
            ]);
            setNews(newsData.filter((item: any) => item.category === 'news').slice(0, 5));
            setProducts(productsData.slice(0, 6)); // Show top 6 products
            setJobs(jobsData.slice(0, 5)); // Show top 5 jobs
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const menuItems = [
        { id: 'shopping', icon: 'cart', label: 'menu_shopping', color: '#4CAF50' },
        { id: 'real_estate', icon: 'business', label: 'menu_real_estate', color: '#2196F3' },
        { id: 'rent', icon: 'key', label: 'menu_rent', color: '#FF9800' },
        { id: 'used_car', icon: 'car', label: 'menu_used_car', color: '#F44336' },
        { id: 'jobs', icon: 'briefcase', label: 'menu_jobs', color: '#9C27B0' },
        { id: 'restaurants', icon: 'restaurant', label: 'menu_restaurants', color: '#795548' },
        { id: 'repair', icon: 'construct', label: 'menu_repair', color: '#607D8B' },
        { id: 'cleaning', icon: 'water', label: 'menu_cleaning', color: '#00BCD4' },
        { id: 'services', icon: 'people', label: 'menu_services', color: '#E91E63' },
        { id: 'news', icon: 'newspaper', label: 'menu_news', color: '#3F51B5' },
    ];

    const renderHeader = () => (
        <View className="px-4 pb-4">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4 mt-2">
                <View>
                    <Text className="text-2xl font-bold text-laos-green">Laos Life</Text>
                </View>
                <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
                    <Ionicons name="notifications-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <TouchableOpacity
                onPress={() => navigation.navigate('Search')}
                className="flex-row items-center bg-white p-3 rounded-xl shadow-sm mb-6 border border-gray-100"
            >
                <Ionicons name="search" size={20} color="gray" />
                <Text className="text-gray-400 ml-2 flex-1">Search anything...</Text>
            </TouchableOpacity>

            {/* Menu Grid */}
            <View className="flex-row flex-wrap justify-between mb-6">
                {menuItems.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => navigation.navigate('CategoryList', { category: item.id })}
                        className="w-[18%] items-center mb-4"
                    >
                        <View className={`w-12 h-12 rounded-2xl items-center justify-center mb-1 shadow-sm`} style={{ backgroundColor: item.color + '20' }}>
                            <Ionicons name={item.icon as any} size={24} color={item.color} />
                        </View>
                        <Text className="text-xs text-center text-gray-600 font-medium" numberOfLines={1}>{t(item.label)}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Government News Section */}
            <View className="mb-6">
                <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-lg font-bold text-gray-800">🏛️ {t('menu_news')}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('CategoryList', { category: 'news' })}>
                        <Text className="text-laos-green font-bold text-sm">See All</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {news.map((item) => (
                        <TouchableOpacity key={item.id} className="mr-4 w-64 bg-white rounded-xl shadow-sm overflow-hidden h-32 flex-row">
                            <Image source={{ uri: item.thumbnail || 'https://via.placeholder.com/100' }} className="w-24 h-full bg-gray-200" />
                            <View className="flex-1 p-3 justify-between">
                                <Text className="font-bold text-gray-800 leading-tight" numberOfLines={2}>{item.title}</Text>
                                <Text className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Used Goods Section */}
            <View className="mb-6">
                <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-lg font-bold text-gray-800">🛍️ {t('menu_shopping')}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('CategoryList', { category: 'shopping' })}>
                        <Text className="text-laos-green font-bold text-sm">See All</Text>
                    </TouchableOpacity>
                </View>
                <View className="flex-row flex-wrap justify-between">
                    {products.map((item) => (
                        <TouchableOpacity key={item.id} className="w-[48%] bg-white rounded-xl shadow-sm mb-4 overflow-hidden">
                            <Image source={{ uri: item.photos?.[0] || 'https://via.placeholder.com/150' }} className="w-full h-32 bg-gray-200" />
                            <View className="p-2">
                                <Text className="font-bold text-gray-800 text-sm" numberOfLines={1}>{item.title}</Text>
                                <PriceDisplay amount={item.price} style={{ color: '#006400', fontWeight: 'bold', fontSize: 14, marginTop: 4 }} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Jobs Section */}
            <View className="mb-20">
                <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-lg font-bold text-gray-800">💼 {t('menu_jobs')}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('CategoryList', { category: 'jobs' })}>
                        <Text className="text-laos-green font-bold text-sm">See All</Text>
                    </TouchableOpacity>
                </View>
                {jobs.map((item) => (
                    <TouchableOpacity key={item.id} className="bg-white p-4 rounded-xl shadow-sm mb-3 flex-row items-center">
                        <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
                            <Ionicons name="briefcase" size={20} color="#2196F3" />
                        </View>
                        <View className="flex-1">
                            <Text className="font-bold text-gray-800 text-base">{item.industry}</Text>
                            <Text className="text-gray-500 text-sm">{item.jobType} • {item.salaryRange}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="gray" />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#006400" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            <FlatList
                data={[]}
                renderItem={null}
                ListHeaderComponent={renderHeader}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}
