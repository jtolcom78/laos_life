import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Modal, TextInput, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';
import { useTranslation } from 'react-i18next';
import { PriceDisplay } from '../components/PriceDisplay';

// Define Sub-categories (Should ideally come from API, but hardcoded for MVP speed)
const categoryStructure: any = {
    'shopping': ['All', '디지털/가전', '가구/인테리어', '의류/잡화', '유아동', '생활용품', '식료품', '기타'],
    'real_estate': ['All', '토지', '단독주택/빌라', '아파트/콘도', '상가/사무실', '공장/창고'],
    'rent': ['All', '아파트/콘도', '단독주택', '원룸/투룸', '상가/사무실', '헝태우'],
    'used_car': ['All', '승용차', 'SUV/RV', '트럭/버스', '오토바이/스쿠터', '부품/용품'],
    'jobs': ['All', '전문직', '일반직', '아르바이트', '운전/배달', '생산/기술'],
    'restaurants': ['All', '한식', '라오스식', '중식/일식', '양식/패스트푸드', '카페/디저트', '주점/호프'],
    'repair': ['All', '에어컨', '세탁기', '침대', 'TV', '바닥', '전기', '인테리어', '자동차', '오토바이', '건축', '방충망', '간판/광고물/인쇄물', '컴퓨터', '가구', '주방', 'CCTV', '온수기', '인터넷', '휴대폰수리점'],
    'cleaning': ['All', '에어컨', '세탁기', '집', '하수도', '메트리스', '쇼파', '방역', '자동차/오토바이', '사무실'],
    'services': ['All', '꽃', '이사/용달', '세탁서비스', '뷰티', '미용실', '부동산(월세)', '병원', '치과', '동물', '헬스장', '취미/학원', '빵집', '약국', '대행서비스', '렌트', '법무사', '변호사', '세무사', '이장', '여행사', '사진관', '안경점', '홈케어', '예식장', '파티/결혼식/장례', '복장대여', '맞춤옷', '예약 시스템', '마사지', '포장용품'],
    'news': ['All', '정책·법령·조치', '인프라·투자·개발', '보건·방역·안전', '관광·문화·행사', '외교·국제관계', '공공 캠페인', '인사·회의', '기타'],
};

export default function CategoryListScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { category } = route.params;
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFilterVisible, setFilterVisible] = useState(false);
    const [selectedSubCategory, setSelectedSubCategory] = useState('All');

    // Filter States
    const [filterBrand, setFilterBrand] = useState('');
    const [filterYearMin, setFilterYearMin] = useState('');
    const [filterPriceMax, setFilterPriceMax] = useState('');
    const [filterBedrooms, setFilterBedrooms] = useState('');

    const subCategories = categoryStructure[category] || [];

    useEffect(() => {
        loadData();
    }, [category, selectedSubCategory]);

    const loadData = async (filters: any = {}) => {
        setLoading(true);
        let data = [];
        try {
            switch (category) {
                case 'real_estate':
                case 'rent':
                    const reParams: any = { ...filters };
                    if (category === 'rent') reParams.listingType = 'Rent';
                    else reParams.listingType = 'Sale';
                    data = await api.getRealEstates(reParams);
                    break;
                case 'shopping':
                    data = await api.getProducts();
                    break;
                case 'jobs':
                    data = await api.getJobs();
                    break;
                case 'used_car':
                    data = await api.getCars(filters);
                    break;
                case 'restaurants':
                case 'repair':
                case 'cleaning':
                case 'services':
                    data = await api.getShops();
                    data = data.filter((item: any) => item.category === getCategoryName(category));
                    break;
                default:
                    if (category === 'news') {
                        data = await api.getPosts();
                    }
                    break;
            }

            if (selectedSubCategory !== 'All') {
                if (['restaurants', 'repair', 'cleaning', 'services'].includes(category)) {
                    data = data.filter((item: any) => item.subCategory === selectedSubCategory);
                }
            }

        } catch (e) {
            console.error(e);
        } finally {
            setItems(data);
            setLoading(false);
        }
    };

    const getCategoryName = (id: string) => {
        const map: any = {
            'restaurants': '음식점',
            'repair': '설치/수리',
            'cleaning': '청소',
            'services': '서비스'
        };
        return map[id] || id;
    }

    const applyFilters = () => {
        const filters: any = {};
        if (filterBrand) filters.brand = filterBrand;
        if (filterYearMin) filters.yearMin = filterYearMin;
        if (filterPriceMax) filters.priceMax = filterPriceMax;
        if (filterBedrooms) filters.bedrooms = filterBedrooms;

        loadData(filters);
        setFilterVisible(false);
    };

    const resetFilters = () => {
        setFilterBrand('');
        setFilterYearMin('');
        setFilterPriceMax('');
        setFilterBedrooms('');
        loadData({});
        setFilterVisible(false);
    };

    const renderItem = ({ item }: { item: any }) => {
        if (category === 'used_car') {
            return (
                <TouchableOpacity className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden">
                    <Image source={{ uri: item.photos?.[0] || 'https://via.placeholder.com/300' }} className="w-full h-40 bg-gray-200" />
                    <View className="p-4">
                        <View className="flex-row justify-between items-center mb-1">
                            <Text className="text-lg font-bold text-gray-800">{item.brand} {item.model}</Text>
                            <PriceDisplay amount={item.price} style={{ color: '#006400', fontWeight: 'bold', fontSize: 18 }} />
                        </View>
                        <View className="flex-row space-x-3">
                            <Text className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded">{item.year}</Text>
                            <Text className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded">{item.mileage} km</Text>
                            <Text className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded">{item.fuelType}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }

        if (category === 'shopping') {
            return (
                <TouchableOpacity className="bg-white p-4 rounded-xl shadow-sm mb-4 flex-row">
                    <Image source={{ uri: item.photos?.[0] || 'https://via.placeholder.com/100' }} className="w-24 h-24 rounded-lg bg-gray-200" />
                    <View className="flex-1 ml-4 justify-between">
                        <View>
                            <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>{item.title}</Text>
                            <Text className="text-gray-500 text-sm">{item.condition} • {item.status}</Text>
                        </View>
                        <PriceDisplay amount={item.price} style={{ color: '#006400', fontWeight: 'bold', fontSize: 18 }} />
                    </View>
                </TouchableOpacity>
            );
        }

        if (category === 'real_estate' || category === 'rent') {
            return (
                <TouchableOpacity className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden">
                    <Image source={{ uri: item.photos?.[0] || 'https://via.placeholder.com/300' }} className="w-full h-48 bg-gray-200" />
                    <View className="p-4">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-xs font-bold text-laos-green bg-green-50 px-2 py-1 rounded">{item.propertyType}</Text>
                            <Text className="text-gray-500 text-xs">{item.location}</Text>
                        </View>
                        <View className="flex-row items-baseline mb-1">
                            <PriceDisplay amount={item.price} style={{ color: '#333', fontWeight: 'bold', fontSize: 20 }} />
                            {item.listingType === 'Rent' && <Text className="text-sm font-normal text-gray-500 ml-1">/mo</Text>}
                        </View>
                        <View className="flex-row space-x-4">
                            <Text className="text-gray-500 text-sm">{item.bedrooms} Bed</Text>
                            <Text className="text-gray-500 text-sm">{item.bathrooms} Bath</Text>
                            <Text className="text-gray-500 text-sm">{item.area} m²</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }

        if (category === 'jobs') {
            return (
                <TouchableOpacity className="bg-white p-5 rounded-xl shadow-sm mb-4 border-l-4 border-laos-green">
                    <View className="flex-row justify-between items-start mb-2">
                        <Text className="text-lg font-bold text-gray-800">{item.industry}</Text>
                        <Text className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.jobType}</Text>
                    </View>
                    <Text className="text-gray-600 mb-3">{item.experience} Experience</Text>
                    <View className="flex-row justify-between items-center">
                        {item.salary ? (
                            <PriceDisplay amount={item.salary} style={{ color: '#006400', fontWeight: 'bold' }} />
                        ) : (
                            <Text className="text-laos-green font-bold">{item.salaryRange}</Text>
                        )}
                        <Text className="text-gray-400 text-xs">{item.workingHours}</Text>
                    </View>
                </TouchableOpacity>
            );
        }

        // Default Card (Shops, News)
        return (
            <TouchableOpacity className="bg-white p-4 rounded-xl shadow-sm mb-4">
                <View className="flex-row">
                    {item.thumbnail && <Image source={{ uri: item.thumbnail }} className="w-20 h-20 rounded-lg mr-3 bg-gray-200" />}
                    <View className="flex-1">
                        <Text className="text-base font-bold text-gray-800 mb-1" numberOfLines={2}>{item.title || item.name}</Text>
                        <Text className="text-gray-500 text-sm" numberOfLines={2}>{item.content || item.description || item.subCategory}</Text>
                        {item.rating && <Text className="text-yellow-500 text-xs mt-1">★ {item.rating}</Text>}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white pt-12 pb-2 px-4 shadow-sm z-10">
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center">
                        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                        <Text className="text-lg font-bold ml-2 capitalize">{t('menu_' + category)}</Text>
                    </View>
                    {(category === 'used_car' || category === 'real_estate' || category === 'rent') && (
                        <TouchableOpacity onPress={() => setFilterVisible(true)} className="p-2">
                            <Ionicons name="filter" size={24} color="#006400" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Sub-category Tabs */}
                {subCategories.length > 0 && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
                        {subCategories.map((sub: string) => (
                            <TouchableOpacity
                                key={sub}
                                onPress={() => setSelectedSubCategory(sub)}
                                className={`px-4 py-2 rounded-full mr-2 ${selectedSubCategory === sub ? 'bg-laos-green' : 'bg-gray-100'}`}
                            >
                                <Text className={`text-sm font-medium ${selectedSubCategory === sub ? 'text-white' : 'text-gray-600'}`}>
                                    {sub}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </View>

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#006400" />
                </View>
            ) : (
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ padding: 16 }}
                    ListEmptyComponent={
                        <View className="items-center justify-center py-20">
                            <Text className="text-gray-400">No items found</Text>
                        </View>
                    }
                />
            )}

            {/* Filter Modal (Same as before) */}
            <Modal
                visible={isFilterVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setFilterVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl p-6 h-[60%]">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-gray-800">Filter</Text>
                            <TouchableOpacity onPress={() => setFilterVisible(false)}>
                                <Ionicons name="close" size={24} color="gray" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView className="flex-1">
                            {category === 'used_car' && (
                                <>
                                    <View className="mb-4">
                                        <Text className="text-sm font-bold text-gray-700 mb-2">Brand</Text>
                                        <View className="flex-row space-x-2">
                                            {['Hyundai', 'Kia', 'Toyota'].map(b => (
                                                <TouchableOpacity
                                                    key={b}
                                                    onPress={() => setFilterBrand(b === filterBrand ? '' : b)}
                                                    className={`px-4 py-2 rounded-full border ${filterBrand === b ? 'bg-laos-green border-laos-green' : 'bg-white border-gray-300'}`}
                                                >
                                                    <Text className={filterBrand === b ? 'text-white' : 'text-gray-700'}>{b}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                    <View className="mb-4">
                                        <Text className="text-sm font-bold text-gray-700 mb-2">Min Year</Text>
                                        <TextInput
                                            value={filterYearMin}
                                            onChangeText={setFilterYearMin}
                                            placeholder="e.g. 2018"
                                            keyboardType="numeric"
                                            className="border border-gray-300 rounded-lg p-3"
                                        />
                                    </View>
                                </>
                            )}

                            {(category === 'real_estate' || category === 'rent') && (
                                <View className="mb-4">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Min Bedrooms</Text>
                                    <View className="flex-row space-x-2">
                                        {[1, 2, 3, 4].map(n => (
                                            <TouchableOpacity
                                                key={n}
                                                onPress={() => setFilterBedrooms(n.toString() === filterBedrooms ? '' : n.toString())}
                                                className={`w-10 h-10 rounded-full border items-center justify-center ${filterBedrooms === n.toString() ? 'bg-laos-green border-laos-green' : 'bg-white border-gray-300'}`}
                                            >
                                                <Text className={filterBedrooms === n.toString() ? 'text-white' : 'text-gray-700'}>{n}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )}

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Max Price ($)</Text>
                                <TextInput
                                    value={filterPriceMax}
                                    onChangeText={setFilterPriceMax}
                                    placeholder="e.g. 50000"
                                    keyboardType="numeric"
                                    className="border border-gray-300 rounded-lg p-3"
                                />
                            </View>
                        </ScrollView>

                        <View className="flex-row space-x-4 mt-4">
                            <TouchableOpacity onPress={resetFilters} className="flex-1 py-3 bg-gray-200 rounded-xl items-center">
                                <Text className="font-bold text-gray-700">Reset</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={applyFilters} className="flex-1 py-3 bg-laos-green rounded-xl items-center">
                                <Text className="font-bold text-white">Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
