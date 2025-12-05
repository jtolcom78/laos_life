import axios from 'axios';
import { Platform } from 'react-native';

// Android Emulator: 10.0.2.2, iOS Simulator: localhost
const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 5000,
});

export const fetchCategories = async () => {
    try {
        const response = await axiosInstance.get('/categories');
        return response.data;
    } catch (error) {
        console.log('Error fetching categories', error);
        return [];
    }
};

export const fetchProducts = async () => {
    try {
        const response = await axiosInstance.get('/products');
        return response.data;
    } catch (error) {
        console.log('Error fetching products', error);
        return [];
    }
};

export const fetchRealEstates = async (params?: any) => {
    try {
        const response = await axiosInstance.get('/real-estates', { params });
        return response.data;
    } catch (error) {
        console.log('Error fetching real estates', error);
        return [];
    }
};

export const fetchPosts = async () => {
    try {
        const response = await axiosInstance.get('/posts');
        return response.data;
    } catch (error) {
        console.log('Error fetching posts', error);
        return [];
    }
};

export const fetchCars = async (params?: any) => {
    try {
        const response = await axiosInstance.get('/cars', { params });
        return response.data;
    } catch (error) {
        console.log('Error fetching cars', error);
        return [];
    }
};

export const fetchJobs = async () => {
    try {
        const response = await axiosInstance.get('/jobs');
        return response.data;
    } catch (error) {
        console.log('Error fetching jobs', error);
        return [];
    }
};

export const fetchShops = async () => {
    try {
        const response = await axiosInstance.get('/shops');
        return response.data;
    } catch (error) {
        console.log('Error fetching shops', error);
        return [];
    }
};

export const search = async (keyword: string) => {
    try {
        const response = await axiosInstance.get('/search', { params: { q: keyword } });
        return response.data;
    } catch (error) {
        console.log('Error searching', error);
        return {};
    }
};

export const api = {
    getCategories: fetchCategories,
    getProducts: fetchProducts,
    getRealEstates: fetchRealEstates,
    getPosts: fetchPosts,
    getCars: fetchCars,
    getJobs: fetchJobs,
    getShops: fetchShops,
    search: search,
};
