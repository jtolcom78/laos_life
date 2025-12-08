import axios from 'axios';
import { Platform } from 'react-native';

// Android Emulator: 10.0.2.2, iOS Simulator: localhost
// To demo externally: Replace this with your ngrok URL (e.g., 'https://your-id.ngrok-free.app')
// const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
const API_URL = 'https://laos-life.onrender.com';
// const API_URL = 'https://YOUR_NGROK_ID.ngrok-free.app';

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 5000,
});

export const setApiLanguage = (lang: string) => {
    axiosInstance.defaults.headers.common['Accept-Language'] = lang;
};

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

export const fetchBanners = async () => {
    try {
        const response = await axiosInstance.get('/banners/active');
        return response.data;
    } catch (error) {
        console.log('Error fetching banners', error);
        return [];
    }
};

// Upload
export const uploadFile = async (file: any, folder: string) => {
    const formData = new FormData();
    formData.append('file', {
        uri: file.uri,
        type: file.type || 'image/jpeg',
        name: file.fileName || 'upload.jpg',
    } as any);
    formData.append('folder', folder);

    try {
        const response = await axiosInstance.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.url;
    } catch (error) {
        console.log('Error uploading file', error);
        return null;
    }
};

// Generic CRUD
export const createItem = async (endpoint: string, data: any) => {
    try {
        const response = await axiosInstance.post(endpoint, data);
        return response.data;
    } catch (error) {
        console.log(`Error creating item at ${endpoint}`, error);
        return null;
    }
};

export const updateItem = async (endpoint: string, id: number | string, data: any) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/${id}`, data);
        return response.data;
    } catch (error) {
        console.log(`Error updating item at ${endpoint}/${id}`, error);
        return null;
    }
};

export const getItem = async (endpoint: string, id: number | string, options?: any) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/${id}`, options);
        return response.data;
    } catch (error) {
        console.log(`Error fetching item at ${endpoint}/${id}`, error);
        return null;
    }
};

export const deleteItem = async (endpoint: string, id: number | string) => {
    try {
        await axiosInstance.delete(`${endpoint}/${id}`);
        return true;
    } catch (error) {
        console.log(`Error deleting item at ${endpoint}/${id}`, error);
        return false;
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
    getBanners: fetchBanners,
    search: search,
    uploadFile,
    createItem,
    updateItem,
    deleteItem,
};
