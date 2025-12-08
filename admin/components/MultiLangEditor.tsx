import React, { useState } from 'react';

export type LanguageCode = 'lo' | 'en' | 'ko' | 'zh';

interface MultiLangEditorProps {
    value: { [key: string]: string };
    onChange: (value: { [key: string]: string }) => void;
    label?: string;
    renderInput: (value: string, onChange: (val: string) => void, placeholder: string) => React.ReactNode;
}

const LANGUAGES: { code: LanguageCode; label: string; flag: string }[] = [
    { code: 'lo', label: 'Lao', flag: '🇱🇦' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ko', label: 'Korean', flag: '🇰🇷' },
    { code: 'zh', label: 'Chinese', flag: '🇨🇳' },
];

export const MultiLangEditor: React.FC<MultiLangEditorProps> = ({ value = {}, onChange, label, renderInput }) => {
    const [activeLang, setActiveLang] = useState<LanguageCode>('lo');

    const handleContentChange = (content: string) => {
        onChange({
            ...value,
            [activeLang]: content
        });
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {/* Header / Tabs */}
            <div className="bg-gray-50 border-b border-gray-200 flex items-center justify-between px-4 py-2">
                {label && <span className="font-semibold text-gray-700 text-sm">{label}</span>}

                <div className="flex space-x-1">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            type="button"
                            onClick={() => setActiveLang(lang.code)}
                            className={`
                                flex items-center px-3 py-1.5 rounded-lg text-sm transition-all
                                ${activeLang === lang.code
                                    ? 'bg-white text-green-700 shadow-sm border border-gray-200 font-bold'
                                    : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                                }
                            `}
                        >
                            <span className="mr-1.5 opacity-80">{lang.flag}</span>
                            {lang.label}
                            {value[lang.code] && (
                                <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-green-500 block"></span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="p-0">
                {renderInput(
                    value[activeLang] || '',
                    handleContentChange,
                    `Enter ${label || 'text'} in ${LANGUAGES.find(l => l.code === activeLang)?.label}...`
                )}
            </div>

            {/* Footer Hint */}
            <div className="bg-gray-50 px-4 py-2 text-xs text-gray-400 border-t border-gray-100 flex justify-between">
                <span>Current Language: {LANGUAGES.find(l => l.code === activeLang)?.label}</span>
                <span className={activeLang === 'lo' ? 'text-green-600 font-bold' : ''}>Active Tip: {activeLang.toUpperCase()}</span>
            </div>
        </div>
    );
};
