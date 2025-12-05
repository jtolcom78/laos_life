'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { useTranslation } from 'react-i18next';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

// Define Category Structure
const categoryStructure = [
    {
        name: '중고거래', id: 'shopping',
        subs: ['디지털/가전', '가구/인테리어', '의류/잡화', '유아동', '생활용품', '식료품', '기타']
    },
    {
        name: '부동산', id: 'real_estate',
        subs: ['토지', '단독주택/빌라', '아파트/콘도', '상가/사무실', '공장/창고']
    },
    {
        name: '월세', id: 'rent',
        subs: ['아파트/콘도', '단독주택', '원룸/투룸', '상가/사무실', '헝태우']
    },
    {
        name: '중고차', id: 'used_car',
        subs: ['승용차', 'SUV/RV', '트럭/버스', '오토바이/스쿠터', '부품/용품']
    },
    {
        name: '취업', id: 'jobs',
        subs: ['전문직', '일반직', '아르바이트', '운전/배달', '생산/기술']
    },
    {
        name: '음식점', id: 'restaurants',
        subs: ['한식', '라오스식', '중식/일식', '양식/패스트푸드', '카페/디저트', '주점/호프']
    },
    {
        name: '설치/수리', id: 'repair',
        subs: ['에어컨', '세탁기', '침대', 'TV', '바닥', '전기', '인테리어', '자동차', '오토바이', '건축', '방충망', '간판/광고물/인쇄물', '컴퓨터', '가구', '주방', 'CCTV', '온수기', '인터넷', '휴대폰수리점']
    },
    {
        name: '청소', id: 'cleaning',
        subs: ['에어컨', '세탁기', '집', '하수도', '메트리스', '쇼파', '방역', '자동차/오토바이', '사무실']
    },
    {
        name: '서비스', id: 'services',
        subs: ['꽃', '이사/용달', '세탁서비스', '뷰티', '미용실', '부동산(월세)', '병원', '치과', '동물', '헬스장', '취미/학원', '빵집', '약국', '대행서비스', '렌트', '법무사', '변호사', '세무사', '이장', '여행사', '사진관', '안경점', '홈케어', '예식장', '파티/결혼식/장례', '복장대여', '맞춤옷', '예약 시스템', '마사지', '포장용품']
    },
    {
        name: '정부소식', id: 'news',
        subs: ['정책·법령·조치', '인프라·투자·개발', '보건·방역·안전', '관광·문화·행사', '외교·국제관계', '공공 캠페인', '인사·회의', '기타']
    },
];

export default function CreateContentPage() {
    const router = useRouter();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    // Base Fields
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mainCategory, setMainCategory] = useState(categoryStructure[0].name);
    const [subCategory, setSubCategory] = useState(categoryStructure[0].subs[0]);
    const [thumbnail, setThumbnail] = useState<File | null>(null);

    // Dynamic Fields State
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    // Car
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [mileage, setMileage] = useState('');
    // Real Estate
    const [listingType, setListingType] = useState('Sale');
    const [bedrooms, setBedrooms] = useState('');
    const [bathrooms, setBathrooms] = useState('');
    // Job
    const [salary, setSalary] = useState('');
    const [jobType, setJobType] = useState('Full-time');

    // Update sub-categories when main category changes
    useEffect(() => {
        const cat = categoryStructure.find(c => c.name === mainCategory);
        if (cat && cat.subs.length > 0) {
            setSubCategory(cat.subs[0]);
        } else {
            setSubCategory('');
        }
    }, [mainCategory]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Upload Thumbnail if exists
            let thumbnailUrl = '';
            if (thumbnail) {
                const formData = new FormData();
                formData.append('file', thumbnail);
                const uploadRes = await fetch('http://localhost:3000/upload', {
                    method: 'POST',
                    body: formData,
                });
                const uploadData = await uploadRes.json();
                thumbnailUrl = uploadData.url;
            }

            // 2. Prepare Payload based on Category
            const payload: any = {
                title,
                content,
                category: mainCategory, // Or send ID? Backend expects string name currently for some entities
                subCategory,
                thumbnail: thumbnailUrl,
            };

            // Add dynamic fields
            if (mainCategory === '중고거래') {
                payload.price = Number(price);
            } else if (mainCategory === '중고차') {
                payload.brand = brand;
                payload.model = model;
                payload.year = Number(year);
                payload.mileage = Number(mileage);
                payload.price = Number(price);
            } else if (mainCategory === '부동산' || mainCategory === '월세') {
                payload.price = Number(price);
                payload.location = location;
                payload.listingType = mainCategory === '월세' ? 'Rent' : 'Sale';
                payload.bedrooms = Number(bedrooms);
            } else if (mainCategory === '취업') {
                payload.salary = Number(salary);
                payload.jobType = jobType;
            }

            // 3. Create Post (Generic Endpoint for now, ideally separate endpoints)
            let endpoint = 'http://localhost:3000/posts';
            if (mainCategory === '중고차') endpoint = 'http://localhost:3000/cars';
            else if (mainCategory === '부동산' || mainCategory === '월세') endpoint = 'http://localhost:3000/real-estates';
            else if (mainCategory === '중고거래') endpoint = 'http://localhost:3000/products';
            else if (mainCategory === '취업') endpoint = 'http://localhost:3000/jobs';
            else if (['음식점', '설치/수리', '청소', '서비스'].includes(mainCategory)) endpoint = 'http://localhost:3000/shops';

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push('/content');
            } else {
                alert('Failed to create content');
            }
        } catch (error) {
            console.error(error);
            alert('Error creating content');
        } finally {
            setLoading(false);
        }
    };

    const currentCategory = categoryStructure.find(c => c.name === mainCategory);

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('create_content')}</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Selection */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Main Category</label>
                        <select
                            value={mainCategory}
                            onChange={(e) => setMainCategory(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        >
                            {categoryStructure.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category</label>
                        <select
                            value={subCategory}
                            onChange={(e) => setSubCategory(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            disabled={!currentCategory?.subs.length}
                        >
                            {currentCategory?.subs.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                {/* Dynamic Fields Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Details</h3>

                    {/* Common Fields */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg"
                            required
                        />
                    </div>

                    {/* Used Car Specifics */}
                    {mainCategory === '중고차' && (
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                <select value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg">
                                    <option value="">Select Brand</option>
                                    <option value="Hyundai">Hyundai</option>
                                    <option value="Kia">Kia</option>
                                    <option value="Toyota">Toyota</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                <input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mileage (km)</label>
                                <input type="number" value={mileage} onChange={(e) => setMileage(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg" />
                            </div>
                        </div>
                    )}

                    {/* Real Estate Specifics */}
                    {(mainCategory === '부동산' || mainCategory === '월세') && (
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select value={listingType} onChange={(e) => setListingType(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg">
                                    <option value="Sale">Sale</option>
                                    <option value="Rent">Rent</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                                <input type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg" />
                            </div>
                        </div>
                    )}

                    {/* Job Specifics */}
                    {mainCategory === '취업' && (
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                                <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg">
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Salary ($)</label>
                                <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg" />
                            </div>
                        </div>
                    )}

                    {/* Thumbnail Upload */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail</label>
                        <input
                            type="file"
                            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                            className="w-full p-2 border border-gray-200 rounded-lg"
                            accept="image/*"
                        />
                    </div>
                </div>

                {/* Rich Text Editor */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <div className="h-64 mb-12">
                        <ReactQuill theme="snow" value={content} onChange={setContent} className="h-full" />
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-md disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create Content'}
                    </button>
                </div>
            </form>
        </div>
    );
}
