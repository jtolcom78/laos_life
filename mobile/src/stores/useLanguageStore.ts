import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setApiLanguage } from '../services/api';

interface LanguageState {
    language: 'lo' | 'en' | 'ko' | 'zh';
    setLanguage: (lang: 'lo' | 'en' | 'ko' | 'zh') => void;
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set) => ({
            language: 'lo', // Default to Lao
            setLanguage: (lang) => {
                set({ language: lang });
                setApiLanguage(lang); // Sync with API
            },
        }),
        {
            name: 'language-storage',
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    setApiLanguage(state.language);
                }
            }
        }
    )
);
