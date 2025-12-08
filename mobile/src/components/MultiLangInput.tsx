import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface MultiLangInputProps {
    value: { [key: string]: string };
    onChange: (value: { [key: string]: string }) => void;
    placeholder?: string;
    label?: string;
    multiline?: boolean;
    numberOfLines?: number;
}

const LANGUAGES = [
    { code: 'lo', label: '🇱🇦 Lao' },
    { code: 'en', label: '🇺🇸 Eng' },
    { code: 'ko', label: '🇰🇷 Kor' },
    { code: 'zh', label: '🇨🇳 Chn' },
];

export const MultiLangInput = ({
    value = {},
    onChange,
    placeholder,
    label,
    multiline = false,
    numberOfLines = 1
}: MultiLangInputProps) => {
    const [activeTab, setActiveTab] = useState('lo');

    const handleChange = (text: string) => {
        onChange({
            ...value,
            [activeTab]: text
        });
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={styles.tabContainer}>
                {LANGUAGES.map((lang) => (
                    <TouchableOpacity
                        key={lang.code}
                        onPress={() => setActiveTab(lang.code)}
                        style={[
                            styles.tab,
                            activeTab === lang.code && styles.activeTab
                        ]}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === lang.code && styles.activeTabText
                        ]}>
                            {lang.label}
                        </Text>
                        {value[lang.code] ? <View style={styles.dot} /> : null}
                    </TouchableOpacity>
                ))}
            </View>

            <TextInput
                style={[styles.input, multiline && styles.multilineInput]}
                value={value[activeTab] || ''}
                onChangeText={handleChange}
                placeholder={`${placeholder || 'Enter text'} (${LANGUAGES.find(l => l.code === activeTab)?.label})`}
                multiline={multiline}
                numberOfLines={numberOfLines}
                textAlignVertical={multiline ? 'top' : 'center'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        flexDirection: 'row',
    },
    activeTab: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    tabText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
    },
    activeTabText: {
        color: '#000',
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#00963c',
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    multilineInput: {
        minHeight: 100,
    }
});
