'use client';

import { LayoutDashboard, Users, FileText, LogOut, Globe } from 'lucide-react';
import Link from 'next/link';
import '../app/i18n'; // Import i18n config
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { t, i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    if (!mounted) return null; // Prevent hydration mismatch

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-green-700">Laos Life</h1>
                    <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/" className="flex items-center p-3 text-gray-700 hover:bg-green-50 rounded-lg group">
                        <LayoutDashboard className="w-5 h-5 mr-3 text-gray-500 group-hover:text-green-600" />
                        <span className="group-hover:text-green-700 font-medium">{t('dashboard')}</span>
                    </Link>
                    <Link href="/users" className="flex items-center p-3 text-gray-700 hover:bg-green-50 rounded-lg group">
                        <Users className="w-5 h-5 mr-3 text-gray-500 group-hover:text-green-600" />
                        <span className="group-hover:text-green-700 font-medium">{t('user_management')}</span>
                    </Link>
                    <Link href="/content" className="flex items-center p-3 text-gray-700 hover:bg-green-50 rounded-lg group">
                        <FileText className="w-5 h-5 mr-3 text-gray-500 group-hover:text-green-600" />
                        <span className="group-hover:text-green-700 font-medium">{t('content_management')}</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button className="flex items-center w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition">
                        <LogOut className="w-5 h-5 mr-3" />
                        <span className="font-medium">{t('logout')}</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 shadow-sm z-10">
                    <h2 className="text-xl font-semibold text-gray-800">{t('dashboard')}</h2>

                    <div className="flex items-center space-x-4">
                        {/* Language Switcher */}
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => changeLanguage('ko')}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${i18n.language === 'ko' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                KO
                            </button>
                            <button
                                onClick={() => changeLanguage('en')}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${i18n.language === 'en' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                EN
                            </button>
                            <button
                                onClick={() => changeLanguage('lo')}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${i18n.language === 'lo' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                LO
                            </button>
                        </div>

                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                            A
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                    {children}
                </div>
            </main>
        </div>
    );
}
