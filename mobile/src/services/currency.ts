import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://open.er-api.com/v6/latest/LAK';
const CACHE_KEY = 'currency_rates';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export interface ExchangeRates {
    KRW: number;
    CNY: number;
    USD: number;
    THB: number;
    lastUpdated: number;
}

export const getExchangeRates = async (): Promise<ExchangeRates | null> => {
    try {
        // Check cache first
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
            const data = JSON.parse(cached);
            if (Date.now() - data.lastUpdated < CACHE_EXPIRY) {
                return data;
            }
        }

        // Fetch new rates
        const response = await axios.get(API_URL);
        const rates = response.data.rates;

        const data: ExchangeRates = {
            KRW: rates.KRW,
            CNY: rates.CNY,
            USD: rates.USD,
            THB: rates.THB,
            lastUpdated: Date.now(),
        };

        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
        return data;
    } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        return null;
    }
};

export const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};
