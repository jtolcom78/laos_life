'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, Plus, Trash2, Edit, Filter } from 'lucide-react';
import Link from 'next/link';

type ContentType = 'posts' | 'products' | 'jobs' | 'real-estates' | 'shops' | 'cars';

export default function ContentPage() {
    const [activeTab, setActiveTab] = useState<ContentType>('posts');
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/${activeTab}`);
            setItems(response.data);
        } catch (err) {
            console.error(`Failed to fetch ${activeTab}:`, err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        try {
            await axios.delete(`http://localhost:3000/${activeTab}/${id}`);
            setItems(items.filter(item => item.id !== id));
        } catch (err) {
            console.error('Failed to delete item:', err);
            alert('Failed to delete item');
        }
    };

    const tabs: { id: ContentType; label: string }[] = [
        { id: 'posts', label: 'Government News' },
        { id: 'products', label: 'Used Goods' },
        { id: 'jobs', label: 'Jobs' },
        { id: 'real-estates', label: 'Real Estate' },
        { id: 'shops', label: 'Shops/Services' },
        { id: 'cars', label: 'Used Cars' },
    ];

    const renderTableHeaders = () => {
        switch (activeTab) {
            case 'posts':
                return (
                    <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    </>
                );
            case 'products':
                return (
                    <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </>
                );
            case 'jobs':
                return (
                    <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                    </>
                );
            case 'real-estates':
                return (
                    <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    </>
                );
            case 'shops':
                return (
                    <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    </>
                );
            case 'cars':
                return (
                    <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                    </>
                );
        }
    };

    const getLangBadges = (field: any) => {
        if (!field) return null;
        if (typeof field === 'string') return <span className="ml-2 text-xs text-gray-400 bg-gray-100 px-1 rounded">Single</span>;

        const langs = ['lo', 'en', 'ko', 'zh'];
        const flags: Record<string, string> = { lo: '🇱🇦', en: '🇺🇸', ko: '🇰🇷', zh: '🇨🇳' };

        const available = langs.filter(l => field[l]);
        if (available.length === 0) return <span className="ml-2 text-xs text-red-400 bg-red-50 px-1 rounded">Empty</span>;

        return (
            <div className="flex space-x-1 mt-1">
                {langs.map(l => field[l] ? (
                    <span key={l} className="text-xs" title={l.toUpperCase()}>
                        {flags[l]}
                    </span>
                ) : null)}
            </div>
        );
    };

    const renderTitle = (title: any) => {
        if (typeof title === 'string') return title;
        if (!title) return 'No Title';
        return title.ko || title.en || title.lo || Object.values(title)[0] || 'No Title';
    };

    const renderLocation = (loc: any) => {
        if (typeof loc === 'string') return loc;
        if (!loc) return '-';
        return loc.ko || loc.en || loc.lo || Object.values(loc)[0] || '-';
    };

    const renderRow = (item: any) => {
        const imageClass = "w-10 h-10 object-cover rounded bg-gray-200";
        const noImage = <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Img</div>;

        switch (activeTab) {
            case 'posts':
                return (
                    <>
                        <td className="px-6 py-4 whitespace-nowrap">{item.thumbnail ? <img src={item.thumbnail} className={imageClass} /> : noImage}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{renderTitle(item.title)}</div>
                            {getLangBadges(item.title)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{item.category}</span></td>
                    </>
                );
            case 'products':
                return (
                    <>
                        <td className="px-6 py-4 whitespace-nowrap">{item.photos?.[0] ? <img src={item.photos[0]} className={imageClass} /> : noImage}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{renderTitle(item.title)}</div>
                            {getLangBadges(item.title)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-green-600 font-bold">${item.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.status}</td>
                    </>
                );
            case 'jobs':
                return (
                    <>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            <div>{renderTitle(item.title)}</div>
                            {getLangBadges(item.title)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.jobType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-green-600 font-bold">{item.salaryRange || item.salary}</td>
                    </>
                );
            case 'real-estates':
                return (
                    <>
                        <td className="px-6 py-4 whitespace-nowrap">{item.photos?.[0] ? <img src={item.photos[0]} className={imageClass} /> : noImage}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.listingType} - {item.propertyType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-green-600 font-bold">${item.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 max-w-xs truncate">
                            {renderLocation(item.location)}
                            {getLangBadges(item.location)}
                        </td>
                    </>
                );
            case 'shops':
                return (
                    <>
                        <td className="px-6 py-4 whitespace-nowrap">{item.thumbnail ? <img src={item.thumbnail} className={imageClass} /> : noImage}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{renderTitle(item.name)}</div>
                            {getLangBadges(item.name)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.category} / {item.subCategory}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-yellow-500">★ {item.rating}</td>
                    </>
                );
            case 'cars':
                return (
                    <>
                        <td className="px-6 py-4 whitespace-nowrap">{item.photos?.[0] ? <img src={item.photos[0]} className={imageClass} /> : noImage}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.brand} {item.model}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-green-600 font-bold">${item.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.year}</td>
                    </>
                );
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Content Management</h1>
                <Link href="/content/create" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${activeTab === tab.id
                            ? 'bg-green-600 text-white font-medium shadow-sm'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    {renderTableHeaders()}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items.length > 0 ? items.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{item.id}</td>
                                        {renderRow(item)}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link href={`/content/edit/${item.id}?type=${activeTab}`} className="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 inline-flex items-center">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                                            No items found in this category.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
