import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'intl-pluralrules';

const resources = {
    en: {
        translation: {
            welcome: "Welcome to Laos Life",
            welcome_back: "Welcome back,",
            login_google: "Continue with Google",
            login_facebook: "Continue with Facebook",
            login_whatsapp: "Continue with WhatsApp",
            search_placeholder: "Search for anything...",
            menu_shopping: "Used Goods",
            menu_real_estate: "Real Estate",
            menu_rent: "Rent",
            menu_used_car: "Used Car",
            menu_jobs: "Jobs",
            menu_restaurants: "Restaurants",
            menu_repair: "Repair",
            menu_cleaning: "Cleaning",
            menu_service: "Service",
            menu_news: "Gov News",
            tab_home: "Home",
            tab_chat: "Chat",
            tab_my: "My",
            tab_menu: "Menu",
            latest_news: "Latest News",
            more: "More",
            select_language: "Select Language"
        }
    },
    ko: {
        translation: {
            welcome: "라오스 라이프에 오신 것을 환영합니다",
            welcome_back: "환영합니다,",
            login_google: "Google로 계속하기",
            login_facebook: "Facebook으로 계속하기",
            login_whatsapp: "WhatsApp으로 계속하기",
            search_placeholder: "무엇이든 검색하세요...",
            menu_shopping: "중고 제품",
            menu_real_estate: "부동산",
            menu_rent: "월세",
            menu_used_car: "중고차",
            menu_jobs: "취업포털",
            menu_restaurants: "음식점",
            menu_repair: "설치/수리",
            menu_cleaning: "청소",
            menu_service: "서비스",
            menu_news: "정부 소식",
            tab_home: "홈",
            tab_chat: "채팅",
            tab_my: "내 정보",
            tab_menu: "전체메뉴",
            latest_news: "최신 정부 소식",
            more: "더보기",
            select_language: "언어 선택"
        }
    },
    lo: {
        translation: {
            welcome: "ຍິນດີຕ້ອນຮັບສູ່ Laos Life",
            welcome_back: "ຍິນດີຕ້ອນຮັບ,",
            login_google: "ດຳເນີນການຕໍ່ດ້ວຍ Google",
            login_facebook: "ດຳເນີນການຕໍ່ດ້ວຍ Facebook",
            login_whatsapp: "ດຳເນີນການຕໍ່ດ້ວຍ WhatsApp",
            search_placeholder: "ຄົ້ນຫາຫຍັງກໍໄດ້...",
            menu_shopping: "ເຄື່ອງມືສອງ",
            menu_real_estate: "ອະສັງຫາລິມະຊັບ",
            menu_rent: "ເຊົ່າ",
            menu_used_car: "ລົດມືສອງ",
            menu_jobs: "ວຽກ",
            menu_restaurants: "ອາຫານ",
            menu_repair: "ສ້ອມແປງ",
            menu_cleaning: "ທຳຄວາມສະອາດ",
            menu_services: "ບໍລິການ",
            menu_news: "ຂ່າວລັດຖະບານ",
            tab_home: "ໜ້າຫຼັກ",
            tab_chat: "ສົນທະນາ",
            tab_my: "ຂອງຂ້ອຍ",
            tab_menu: "ເມນູ",
            latest_news: "ຂ່າວລ່າສຸດ",
            more: "ເພີ່ມເຕີມ",
            select_language: "ເລືອກພາສາ"
        }
    },
    zh: {
        translation: {
            welcome: "欢迎来到 Laos Life",
            welcome_back: "欢迎回来，",
            login_google: "通过 Google 继续",
            login_facebook: "通过 Facebook 继续",
            login_whatsapp: "通过 WhatsApp 继续",
            search_placeholder: "搜索任何内容...",
            menu_shopping: "二手交易",
            menu_real_estate: "房地产",
            menu_rent: "房屋租赁",
            menu_used_car: "二手车",
            menu_jobs: "求职招聘",
            menu_restaurants: "美食餐饮",
            menu_repair: "安装维修",
            menu_cleaning: "清洁服务",
            menu_services: "生活服务",
            menu_news: "政府新闻",
            tab_home: "首页",
            tab_chat: "聊天",
            tab_my: "我的",
            tab_menu: "菜单",
            latest_news: "最新消息",
            more: "更多",
            select_language: "选择语言"
        }
    }
};

const languageDetector: any = {
    type: 'languageDetector',
    async: true,
    detect: async (callback: (lang: string) => void) => {
        try {
            const savedLanguage = await AsyncStorage.getItem('user-language');
            if (savedLanguage) {
                callback(savedLanguage);
                return;
            }
        } catch (error) {
            console.log('Error reading language', error);
        }
        const bestLanguage = Localization.getLocales()[0].languageCode;
        callback(bestLanguage || 'en');
    },
    init: () => { },
    cacheUserLanguage: async (language: string) => {
        try {
            await AsyncStorage.setItem('user-language', language);
        } catch (error) {
            console.log('Error saving language', error);
        }
    },
};

i18n
    .use(initReactI18next)
    .use(languageDetector)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        }
    });

export default i18n;
