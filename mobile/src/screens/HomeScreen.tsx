import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, FlatList, ActivityIndicator, StatusBar, RefreshControl, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { api } from '../services/api';
import { useTranslation } from 'react-i18next';
import { PriceDisplay } from '../components/PriceDisplay';
import { LinearGradient } from 'expo-linear-gradient';

import { BannerCarousel } from '../components/BannerCarousel';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const navigation = useNavigation<any>();
    const { t, i18n } = useTranslation();
    const [news, setNews] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);
    const [banners, setBanners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, [i18n.language]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [newsData, productsData, jobsData, bannersData] = await Promise.all([
                api.getPosts(),
                api.getProducts(),
                api.getJobs(),
                api.getBanners()
            ]);
            setNews(newsData.slice(0, 3));
            setProducts(productsData.slice(0, 4));
            setJobs(jobsData.slice(0, 3));
            setBanners(bannersData);
        } catch (error) {
            console.error('Failed to load home data', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const getLocalizedContent = (data: any) => {
        if (!data) return '';
        if (typeof data === 'string') return data;
        const lang = i18n.language || 'lo';
        return data[lang] || data['lo'] || data['en'] || Object.values(data)[0] || '';
    };

    const renderHeader = () => (
        <View className="pb-6">
            {/* Banner Section */}
            <View className="mt-4 mb-2">
                <BannerCarousel
                    data={banners}
                    onPress={(banner) => console.log('Banner pressed', banner.id)}
                />
            </View>

            {/* Menu Grid - Premium Apple Style */}
            <View className="px-4 mb-2">
                <View className="flex-row flex-wrap justify-between">
                    {[
                        { id: 'shopping', icon: 'basket', color: '#03C75A' }, // Naver Green
                        { id: 'real_estate', icon: 'home', color: '#007AFF' }, // Blue
                        { id: 'rent', icon: 'key', color: '#FF3B30' }, // Red
                        { id: 'used_car', icon: 'car-sport', color: '#5856D6' }, // Purple
                        { id: 'jobs', icon: 'briefcase', color: '#FF9500' }, // Orange
                        { id: 'restaurants', icon: 'restaurant', color: '#FF2D55' }, // Pink
                        { id: 'repair', icon: 'construct', color: '#8E8E93' }, // Gray
                        { id: 'cleaning', icon: 'water', color: '#30B0C7' }, // Cyan
                        { id: 'service', icon: 'grid', color: '#AF52DE' }, // Violet
                        { id: 'news', icon: 'newspaper', color: '#14C8EB' }, // Teal
                    ].map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            className="w-[19%] items-center mb-5"
                            onPress={() => navigation.navigate('CategoryList', { category: item.id })}
                            activeOpacity={0.7}
                        >
                            <View
                                className="w-[52px] h-[52px] rounded-[20px] bg-white items-center justify-center mb-1.5 shadow-sm"
                                style={{
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 3,
                                    borderWidth: 1,
                                    borderColor: '#F2F4F6'
                                }}
                            >
                                <Ionicons name={item.icon as any} size={26} color={item.color} />
                            </View>
                            <Text className="text-[10px] font-medium text-gray-600 text-center leading-tight tracking-tight" numberOfLines={1}>
                                {t(`menu_${item.id}`)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Content Sections Container - Better Spacing */}
            <View className="pb-8">
                {/* 1. Government News (Compact Horizontal) */}
                <View className="px-4 mt-4">
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-lg font-bold text-gray-800">{t('latest_news')}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('CategoryList', { category: 'news' })}>
                            <Text className="text-ios-blue-600 font-semibold text-xs">View All</Text>
                        </TouchableOpacity>
                    </View>
                    {news.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            className="bg-white mb-3 rounded-2xl shadow-sm p-3 flex-row items-center border border-gray-100"
                            onPress={() => navigation.navigate('Detail', { type: 'news', id: item.id, initialData: item })}
                            activeOpacity={0.7}
                        >
                            <Image
                                source={{ uri: item.thumbnail || 'https://via.placeholder.com/150' }}
                                className="w-20 h-20 rounded-xl bg-gray-100"
                                resizeMode="cover"
                            />
                            <View className="flex-1 ml-3 justify-center h-20">
                                <View className="flex-row items-center mb-1">
                                    <View className="bg-blue-50 px-2 py-0.5 rounded-md mr-2">
                                        <Text className="text-[9px] font-bold text-blue-600">NEWS</Text>
                                    </View>
                                    <Text className="text-[10px] text-gray-400">{new Date(item.created_at).toLocaleDateString()}</Text>
                                </View>
                                <Text className="text-sm font-bold text-gray-800 leading-snug mb-1" numberOfLines={2}>
                                    {getLocalizedContent(item.title)}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* 2. Used Goods (Products) - Horizontal Scroll */}
                <View className="mt-6">
                    <View className="px-4 flex-row justify-between items-center mb-3">
                        <Text className="text-lg font-bold text-gray-800">{t('menu_shopping')}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('CategoryList', { category: 'shopping' })}>
                            <Text className="text-ios-blue-600 font-semibold text-xs">View All</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                        {products.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                className="mr-3 w-32"
                                onPress={() => navigation.navigate('Detail', { type: 'product', id: item.id, initialData: item })}
                            >
                                <View className="w-32 h-32 rounded-2xl bg-white shadow-sm border border-gray-100 mb-2 overflow-hidden">
                                    <Image
                                        source={{ uri: item.photos?.[0] || 'https://via.placeholder.com/150' }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                    <View className="absolute bottom-2 right-2 bg-black/60 px-2 py-0.5 rounded-lg">
                                        <Text className="text-white text-[10px] font-bold">
                                            ${item.price?.toLocaleString()}
                                        </Text>
                                    </View>
                                </View>
                                <Text className="text-xs font-semibold text-gray-800" numberOfLines={1}>
                                    {getLocalizedContent(item.title)}
                                </Text>
                                <Text className="text-[10px] text-gray-500" numberOfLines={1}>{item.condition}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* 3. Jobs (Compact Horizontal) */}
                <View className="px-4 mt-6">
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-lg font-bold text-gray-800">{t('menu_jobs')}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('CategoryList', { category: 'jobs' })}>
                            <Text className="text-ios-blue-600 font-semibold text-xs">View All</Text>
                        </TouchableOpacity>
                    </View>
                    {jobs.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            className="bg-white mb-3 rounded-2xl shadow-sm p-3 flex-row items-center border border-gray-100"
                            onPress={() => navigation.navigate('Detail', { type: 'job', id: item.id, initialData: item })}
                        >
                            <View className="w-12 h-12 rounded-full bg-purple-50 items-center justify-center mr-3 border border-purple-100">
                                <Ionicons name="briefcase" size={20} color="#8b5cf6" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-bold text-gray-800" numberOfLines={1}>
                                    {getLocalizedContent(item.title)}
                                </Text>
                                <Text className="text-xs text-gray-500 mb-1">{item.company || 'Laos Life Company'}</Text>
                                <View className="flex-row items-center">
                                    <View className="bg-gray-100 px-2 py-0.5 rounded mr-2">
                                        <Text className="text-[10px] text-gray-600">{item.location?.en || item.location || 'Vientiane'}</Text>
                                    </View>
                                    <Text className="text-[10px] text-green-600 font-bold">
                                        {item.salary ? `$${item.salary.toLocaleString()}` : 'Negotiable'}
                                    </Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
                        </TouchableOpacity>
                    ))}
                </View>

            </View>
        </View >
    );

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#00963c" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Header with Gradient */}
            <LinearGradient
                colors={['#003973', '#007AFF']} // Deep Blue to iOS Blue
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="pt-12 pb-6 px-4 rounded-b-[32px] shadow-lg z-10"
            >
                <View className="flex-row items-center justify-between mb-4">
                    <View>
                        <Text className="text-white text-xl font-extrabold"></Text>
                        <Text className="text-white text-xl font-extrabold">Laos Life</Text>
                    </View>
                    <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center border border-white/10">
                        <Ionicons name="notifications-outline" size={20} color="white" />
                        <View className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View className="bg-white/95 h-12 rounded-2xl flex-row items-center px-4 shadow-sm">
                    <Ionicons name="search" size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder={t('search_placeholder')}
                        className="flex-1 ml-3 text-base text-gray-800"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </LinearGradient>

            <FlatList
                data={[]}
                renderItem={null}
                ListHeaderComponent={renderHeader}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#006400']} />}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}
