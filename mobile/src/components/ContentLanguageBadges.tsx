import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ContentLanguageBadgesProps {
    availableLanguages: string[];
    currentLanguage: string;
    isTranslated: boolean;
    onLanguageSelect: (lang: string) => void;
}

const LANGUAGES = [
    { code: 'lo', flag: '🇱🇦', label: 'Lao' },
    { code: 'en', flag: '🇺🇸', label: 'Eng' }, // Using US flag for English as common in Asia apps, user used 🇺🇸 in prompt
    { code: 'ko', flag: '🇰🇷', label: 'Kor' },
    { code: 'zh', flag: '🇨🇳', label: 'Chn' },
];

export const ContentLanguageBadges = ({
    availableLanguages,
    currentLanguage,
    isTranslated,
    onLanguageSelect
}: ContentLanguageBadgesProps) => {

    return (
        <View style={styles.container}>
            {LANGUAGES.map((lang) => {
                const isAvailable = availableLanguages.includes(lang.code);
                const isSelected = currentLanguage === lang.code;

                return (
                    <TouchableOpacity
                        key={lang.code}
                        onPress={() => onLanguageSelect(lang.code)}
                        style={[
                            styles.badge,
                            isSelected && styles.selectedBadge,
                            !isAvailable && !isSelected && styles.unavailableBadge
                        ]}
                    >
                        <Text style={styles.flag}>{lang.flag}</Text>
                        {isSelected && isTranslated && (
                            <Text style={styles.robot}>🤖</Text>
                        )}
                        {!isAvailable && !isSelected && (
                            <View style={styles.dimOverlay} />
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 10,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 4, // Rectangular
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    selectedBadge: {
        backgroundColor: '#fff',
        borderColor: '#007AFF', // Blue theme
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    unavailableBadge: {
        opacity: 0.6,
        backgroundColor: '#f1f3f5',
    },
    flag: {
        fontSize: 16,
    },
    robot: {
        marginLeft: 4,
        fontSize: 10,
    },
    dimOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 4, // Rectangular
    }
});
