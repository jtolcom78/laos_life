import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

export default function MyScreen() {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white pt-12 pb-6 px-6 rounded-b-3xl shadow-sm mb-6">
                <Text className="text-2xl font-bold text-gray-800 mb-1">{t('tab_my')}</Text>
                <Text className="text-gray-500 text-sm">Manage your profile and settings</Text>
            </View>

            <ScrollView className="flex-1 px-6">
                {/* Profile Card */}
                <View className="bg-white p-6 rounded-2xl shadow-sm mb-6 flex-row items-center">
                    <View className="w-16 h-16 bg-gray-200 rounded-full items-center justify-center mr-4">
                        <Ionicons name="person" size={30} color="gray" />
                    </View>
                    <View>
                        <Text className="text-lg font-bold text-gray-800">User Name</Text>
                        <Text className="text-gray-500">user@example.com</Text>
                    </View>
                </View>

                {/* Settings Section */}
                <Text className="text-lg font-bold text-gray-800 mb-4">Settings</Text>

                <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {/* Language Setting */}
                    <View className="p-4 border-b border-gray-100">
                        <View className="flex-row items-center justify-between mb-3">
                            <View className="flex-row items-center">
                                <Ionicons name="globe-outline" size={22} color="#006400" style={{ marginRight: 10 }} />
                                <Text className="text-base font-medium text-gray-700">{t('select_language')}</Text>
                            </View>
                        </View>

                        <View className="flex-row space-x-2">
                            <TouchableOpacity
                                onPress={() => changeLanguage('ko')}
                                className={`flex-1 py-2 rounded-lg items-center border ${i18n.language === 'ko' ? 'bg-laos-green border-laos-green' : 'bg-white border-gray-200'}`}
                            >
                                <Text className={`font-bold ${i18n.language === 'ko' ? 'text-white' : 'text-gray-600'}`}>한국어</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => changeLanguage('en')}
                                className={`flex-1 py-2 rounded-lg items-center border ${i18n.language === 'en' ? 'bg-laos-green border-laos-green' : 'bg-white border-gray-200'}`}
                            >
                                <Text className={`font-bold ${i18n.language === 'en' ? 'text-white' : 'text-gray-600'}`}>English</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => changeLanguage('lo')}
                                className={`flex-1 py-2 rounded-lg items-center border ${i18n.language === 'lo' ? 'bg-laos-green border-laos-green' : 'bg-white border-gray-200'}`}
                            >
                                <Text className={`font-bold ${i18n.language === 'lo' ? 'text-white' : 'text-gray-600'}`}>ລາວ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Other Settings Placeholders */}
                    <TouchableOpacity className="p-4 border-b border-gray-100 flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <Ionicons name="notifications-outline" size={22} color="#006400" style={{ marginRight: 10 }} />
                            <Text className="text-base font-medium text-gray-700">Notifications</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="gray" />
                    </TouchableOpacity>

                    <TouchableOpacity className="p-4 flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <Ionicons name="help-circle-outline" size={22} color="#006400" style={{ marginRight: 10 }} />
                            <Text className="text-base font-medium text-gray-700">Help & Support</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="gray" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
