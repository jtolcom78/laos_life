import React, { useEffect, useState } from 'react';
import { Text, View, StyleProp, TextStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getExchangeRates, ExchangeRates, formatCurrency } from '../services/currency';

interface Props {
    amount: number;
    style?: StyleProp<TextStyle>;
    showOriginal?: boolean;
}

export const PriceDisplay: React.FC<Props> = ({ amount, style, showOriginal = true }) => {
    const { i18n } = useTranslation();
    const [rates, setRates] = useState<ExchangeRates | null>(null);

    useEffect(() => {
        getExchangeRates().then(setRates);
    }, []);

    const getTargetCurrency = () => {
        switch (i18n.language) {
            case 'ko': return 'KRW';
            case 'zh': return 'CNY';
            case 'en': return 'USD';
            case 'lo': return 'THB'; // User requested Baht for Lao language
            default: return 'USD';
        }
    };

    const targetCurrency = getTargetCurrency();

    const formatKip = (val: number) => {
        return '₭ ' + val.toLocaleString();
    };

    const convertedAmount = rates ? amount * rates[targetCurrency as keyof ExchangeRates] : null;

    // Custom formatting for converted amount
    const formatConverted = (val: number, currency: string) => {
        if (currency === 'KRW') return `₩ ${Math.round(val).toLocaleString()}`;
        if (currency === 'CNY') return `¥ ${val.toFixed(1)}`;
        if (currency === 'USD') return `$ ${val.toFixed(2)}`;
        if (currency === 'THB') return `฿ ${Math.round(val).toLocaleString()}`;
        return `${val}`;
    };

    return (
        <Text style={style}>
            {showOriginal && formatKip(amount)}
            {convertedAmount && (
                <Text className="text-gray-500 text-xs font-normal">
                    {showOriginal ? ' ' : ''}({formatConverted(convertedAmount, targetCurrency)})
                </Text>
            )}
        </Text>
    );
};
