import React from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
    const navigation = useNavigation<any>();
    const { t, i18n } = useTranslation();

    const handleLogin = (provider: string) => {
        console.log(`Login with ${provider}`);
        navigation.replace('Main');
    };

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    return (
        <View className="flex-1 bg-laos-green">
            <StatusBar barStyle="light-content" />

            {/* Language Selector */}
            <View className="absolute top-12 right-6 flex-row space-x-2 z-10">
                <TouchableOpacity onPress={() => changeLanguage('ko')} className={`px-3 py-1 rounded-full ${i18n.language === 'ko' ? 'bg-white' : 'bg-green-800'}`}>
                    <Text className={`text-xs font-bold ${i18n.language === 'ko' ? 'text-laos-green' : 'text-white'}`}>KO</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeLanguage('en')} className={`px-3 py-1 rounded-full ${i18n.language === 'en' ? 'bg-white' : 'bg-green-800'}`}>
                    <Text className={`text-xs font-bold ${i18n.language === 'en' ? 'text-laos-green' : 'text-white'}`}>EN</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeLanguage('lo')} className={`px-3 py-1 rounded-full ${i18n.language === 'lo' ? 'bg-white' : 'bg-green-800'}`}>
                    <Text className={`text-xs font-bold ${i18n.language === 'lo' ? 'text-laos-green' : 'text-white'}`}>LO</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-1 justify-center px-6">
                {/* Logo Section */}
                <View className="items-center mb-12">
                    <View className="w-28 h-28 bg-white rounded-3xl items-center justify-center mb-6 shadow-lg rotate-3">
                        <Text className="text-laos-green text-5xl font-extrabold">L</Text>
                    </View>
                    <Text className="text-4xl font-bold text-white mb-2 tracking-wider">Laos Life</Text>
                    <Text className="text-green-100 text-lg font-light">{t('welcome')}</Text>
                </View>

                {/* Login Buttons */}
                <View className="bg-white p-8 rounded-3xl shadow-2xl space-y-4">
                    <TouchableOpacity
                        className="w-full bg-white border border-gray-200 py-4 rounded-xl flex-row items-center justify-center shadow-sm"
                        onPress={() => handleLogin('Google')}
                    >
                        <Ionicons name="logo-google" size={20} color="#DB4437" style={{ marginRight: 10 }} />
                        <Text className="text-gray-700 font-bold text-base">{t('login_google')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="w-full bg-[#1877F2] py-4 rounded-xl flex-row items-center justify-center shadow-sm"
                        onPress={() => handleLogin('Facebook')}
                    >
                        <Ionicons name="logo-facebook" size={20} color="white" style={{ marginRight: 10 }} />
                        <Text className="text-white font-bold text-base">{t('login_facebook')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="w-full bg-[#25D366] py-4 rounded-xl flex-row items-center justify-center shadow-sm"
                        onPress={() => handleLogin('WhatsApp')}
                    >
                        <Ionicons name="logo-whatsapp" size={20} color="white" style={{ marginRight: 10 }} />
                        <Text className="text-white font-bold text-base">{t('login_whatsapp')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
