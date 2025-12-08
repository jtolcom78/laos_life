
import { Injectable } from '@nestjs/common';
import { translate } from 'google-translate-api-x';

@Injectable()
export class TranslationService {

    async translateText(text: string, targetLang: string): Promise<string> {
        if (!text) return '';
        try {
            // Mapping essential codes if needed (e.g. 'lo' is supported by google, 'zh' needs 'zh-CN')
            let toLang = targetLang;
            if (targetLang === 'zh') toLang = 'zh-CN';

            // Try forceBatch: false to potentially reduce 429s, though it might differ in capability
            const res = await translate(text, { to: toLang, forceBatch: false });
            return res.text;
        } catch (error: any) {
            // Simplify error log for 429/Too Many Requests
            if (error?.response?.status === 429 || error?.message?.includes('Too Many Requests')) {
                console.warn(`Translation rate limited for ${targetLang}. Using fallback.`);
            } else {
                console.error(`Translation failed for ${targetLang}:`, error.message);
            }
            // Fallback to original text instead of showing error message to user
            // Fallback to original text instead of showing error message to user
            return text;
        }
    }

    /**
     * Resolves content based on preference.
     * Returns: { content: string, isTranslated: boolean, availableLanguages: string[] }
     */
    async resolveContent(jsonContent: any, targetLang: string = 'lo'): Promise<{ content: string; isTranslated: boolean; availableLanguages: string[] }> {
        if (!jsonContent) return { content: '', isTranslated: false, availableLanguages: [] };

        // If string (legacy data), return as is
        if (typeof jsonContent === 'string') {
            return { content: jsonContent, isTranslated: false, availableLanguages: ['legacy'] };
        }

        const availableLanguages = Object.keys(jsonContent).filter(k => jsonContent[k]);

        // 1. Direct Match
        if (jsonContent[targetLang]) {
            return { content: jsonContent[targetLang], isTranslated: false, availableLanguages };
        }

        // 2. Fallback Priority: LO -> EN -> Others
        const fallbackLang = availableLanguages.includes('lo') ? 'lo' : (availableLanguages.includes('en') ? 'en' : availableLanguages[0]);
        const originalContent = jsonContent[fallbackLang];

        if (!originalContent) return { content: '', isTranslated: false, availableLanguages };

        // 3. Auto-Translate
        try {
            const translated = await this.translateText(originalContent, targetLang);
            return { content: translated, isTranslated: true, availableLanguages };
        } catch (e) {
            return { content: originalContent, isTranslated: false, availableLanguages };
        }
    }
}
