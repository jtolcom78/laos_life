'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { useTranslation } from 'react-i18next';
import { Upload, X, FileText } from 'lucide-react';
import { MultiLangEditor } from '@/components/MultiLangEditor';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

// Define Category Structure matched with API/Entity
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

interface CommonCode {
    id: number;
    type: string;
    code: string;
    valueKo: string;
    valueEn: string;
    valueLo: string;
    valueZh: string;
    order: number;
}

export default function CreateContentPage() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);

    // Common Codes State
    const [codes, setCodes] = useState<Record<string, CommonCode[]>>({});

    // Base Fields - Multi-Language
    const [title, setTitle] = useState<{ [key: string]: string }>({});
    const [content, setContent] = useState<{ [key: string]: string }>({});

    const [mainCategory, setMainCategory] = useState(categoryStructure[0].name);
    const [subCategory, setSubCategory] = useState(categoryStructure[0].subs[0]);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [attachments, setAttachments] = useState<File[]>([]);

    // Dynamic Fields State
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState(''); // Text for now, could be multilang later? Entity uses JSONB for location. 
    // Wait, RealEstate/Shop/Car location IS JSONB.
    // So Location input SHOULD be MultiLangEditor too!
    // I'll change location to object.
    const [multiLangLocation, setMultiLangLocation] = useState<{ [key: string]: string }>({});

    // Car State
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [mileage, setMileage] = useState('');
    const [fuelType, setFuelType] = useState('');
    const [transmission, setTransmission] = useState('');

    // Real Estate State
    const [listingType, setListingType] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [bedrooms, setBedrooms] = useState('');
    const [bathrooms, setBathrooms] = useState('');

    // Job State
    const [salary, setSalary] = useState('');
    const [jobType, setJobType] = useState('');
    const [experience, setExperience] = useState('');

    // Fetch Codes
    useEffect(() => {
        const fetchCodes = async () => {
            const types = [
                'CAR_BRAND', 'CAR_FUEL', 'CAR_TRANSMISSION',
                'JOB_TYPE', 'JOB_EXPERIENCE',
                'REAL_ESTATE_TYPE', 'REAL_ESTATE_LISTING'
            ];
            const newCodes: Record<string, CommonCode[]> = {};

            for (const type of types) {
                try {
                    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
                    const res = await fetch(`${API_URL}/common-codes/${type}`);
                    if (res.ok) {
                        newCodes[type] = await res.json();
                    }
                } catch (e) {
                    console.error(`Error fetching code ${type}`, e);
                }
            }
            setCodes(newCodes);
        };
        fetchCodes();
    }, []);

    // Update sub-categories when main category changes
    useEffect(() => {
        const cat = categoryStructure.find(c => c.name === mainCategory);
        if (cat && cat.subs.length > 0) {
            setSubCategory(cat.subs[0]);
        } else {
            setSubCategory('');
        }
        setAttachments([]);
    }, [mainCategory]);

    const getCodeValue = (code: CommonCode) => {
        const lang = i18n.language || 'ko'; // Default to Korean
        if (lang.startsWith('en')) return code.valueEn;
        if (lang.startsWith('lo')) return code.valueLo;
        if (lang.startsWith('zh')) return code.valueZh;
        return code.valueKo;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachments(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate MultiLang Fields
        const hasTitle = Object.values(title).some(t => t.trim());
        const hasContent = Object.values(content).some(c => c.trim());

        if (!hasTitle) {
            alert('Please enter a title in at least one language.');
            return;
        }

        setLoading(true);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

            // determine folder...
            let folder = 'others';
            if (mainCategory === '중고거래') folder = 'products';
            else if (['부동산'].includes(mainCategory)) folder = 'real_estates';
            else if (mainCategory === '월세') folder = 'rents';
            else if (mainCategory === '중고차') folder = 'cars';
            else if (mainCategory === '취업') folder = 'jobs';
            else if (mainCategory === '음식점') folder = 'restaurants';
            else if (mainCategory === '설치/수리') folder = 'repairs';
            else if (mainCategory === '청소') folder = 'cleaning';
            else if (mainCategory === '서비스') folder = 'services';
            else if (mainCategory === '정부소식') folder = 'news';

            // 1. Upload Thumbnail if exists
            let thumbnailUrl = '';
            if (thumbnail) {
                const formData = new FormData();
                formData.append('file', thumbnail);
                formData.append('folder', folder);
                const uploadRes = await fetch(`${API_URL}/upload`, {
                    method: 'POST',
                    body: formData,
                });
                const uploadData = await uploadRes.json();
                thumbnailUrl = uploadData.url;
            }

            // 2. Upload Attachments (if any)
            const attachmentUrls: string[] = [];
            if (attachments.length > 0) {
                for (const file of attachments) {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('folder', 'attachments'); // Specifically to attachments folder
                    const uploadRes = await fetch(`${API_URL}/upload`, {
                        method: 'POST',
                        body: formData,
                    });
                    const uploadData = await uploadRes.json();
                    attachmentUrls.push(uploadData.url);
                }
            }

            // 3. Prepare Payload based on Category
            // NOTE: title and content are now objects {lo, en...}
            const payload: any = {
                title, // JSONB
                content, // JSONB (Note: some entities use 'description' or 'content')
                description: content, // Map to description as fallback/primary depending on entity
                // Product: title (jsonb), description (jsonb)
                // RealEstate: location (jsonb), description (jsonb)
                // Job: title (jsonb), content (jsonb)
                // Post: title (jsonb), content (jsonb)
                // Car: description (jsonb), location (jsonb)
                // Shop: name (jsonb, mapped from title?), location (jsonb?), menuOrServices (jsonb?)

                category: mainCategory,
                subCategory,
                thumbnail: thumbnailUrl,
            };

            if (mainCategory === '취업' || mainCategory === '정부소식') {
                payload.attachments = attachmentUrls;
            }

            // Add dynamic fields
            if (mainCategory === '중고거래') {
                payload.price = Number(price);
            } else if (mainCategory === '중고차') {
                payload.brand = brand;
                payload.model = model;
                // Car doesnt have title field. It has description.
                payload.year = Number(year);
                payload.mileage = Number(mileage);
                payload.price = Number(price);
                payload.fuelType = fuelType;
                payload.transmission = transmission;
                payload.location = multiLangLocation; // Car uses JSONB location
            } else if (mainCategory === '부동산' || mainCategory === '월세') {
                payload.price = Number(price);
                payload.location = multiLangLocation; // RealEstate uses JSONB location
                payload.listingType = mainCategory === '월세' ? 'Rent' : listingType;
                payload.propertyType = propertyType;
                payload.bedrooms = Number(bedrooms);
            } else if (mainCategory === '취업') {
                payload.salary = Number(salary);
                payload.jobType = jobType;
                payload.experience = experience;
                payload.location = multiLangLocation; // Job uses JSONB location (updated?)
                // Job Entity has location? Let's assume yes or use default
            } else if (['음식점', '설치/수리', '청소', '서비스'].includes(mainCategory)) {
                payload.name = title;
                payload.menuOrServices = content;
                payload.location = multiLangLocation;
            }

            // 4. Create Post
            let endpoint = `${API_URL}/posts`;

            // Adjust endpoint base
            if (mainCategory === '중고차') endpoint = `${API_URL}/cars`;
            else if (mainCategory === '부동산' || mainCategory === '월세') endpoint = `${API_URL}/real-estates`;
            else if (mainCategory === '중고거래') endpoint = `${API_URL}/products`;
            else endpoint = `${API_URL}/posts`; // Default for jobs, news, etc? Or logic needs refinement

            // NOTE: Jobs/News might need specific endpoints or 'posts' with 'type'
            // For now assuming backend handles it or we use 'posts' generic? 
            // The Original code used `http://localhost:3000/${contentType}` which suggests different endpoints.
            // Let's route based on category ID logic if possible, or keep simple.

            // Actually, based on previous file content, it seemed to default to /posts but had specific ones.
            // Let's stick to the specific ones we identified:
            // products, real-estates, rents(usually real-estates with listingType=Rent), cars
            // jobs -> ? (maybe jobs endpoint?)
            // shops -> ? (maybe shops endpoint?)

            // For now, let's use the logic I wrote earlier:
            if (mainCategory === '취업') endpoint = `${API_URL}/jobs`; // Assuming exists

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
                    {/* Title / Name (Multilingual) */}
                    <div className="mb-4">
                        <MultiLangEditor
                            label={['음식점', '설치/수리', '청소', '서비스'].includes(mainCategory) ? 'Shop Name' : 'Title'}
                            value={title}
                            onChange={setTitle}
                            renderInput={(val, onChange, placeholder) => (
                                <input
                                    type="text"
                                    value={val}
                                    onChange={(e) => onChange(e.target.value)}
                                    placeholder={placeholder}
                                    className="w-full p-3 border-none outline-none focus:ring-0 text-gray-800"
                                />
                            )}
                        />
                    </div>

                    {/* Location (Multilingual) - for RealEstate, Shop, Car */}
                    {['부동산', '월세', '중고차', '음식점', '설치/수리', '청소', '서비스', '취업'].includes(mainCategory) && (
                        <div className="mb-4">
                            <MultiLangEditor
                                label="Location"
                                value={multiLangLocation}
                                onChange={setMultiLangLocation}
                                renderInput={(val, onChange, placeholder) => (
                                    <input
                                        type="text"
                                        value={val}
                                        onChange={(e) => onChange(e.target.value)}
                                        placeholder={placeholder}
                                        className="w-full p-3 border-none outline-none focus:ring-0 text-gray-800"
                                    />
                                )}
                            />
                        </div>
                    )}

                    {/* Used Car Specifics */}
                    {mainCategory === '중고차' && (
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                <select value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg">
                                    <option value="">Select Brand</option>
                                    {codes['CAR_BRAND']?.map(c => <option key={c.code} value={c.valueKo}>{getCodeValue(c)}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                                <input type="text" value={model} onChange={(e) => setModel(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                <input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                                <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg">
                                    <option value="">Select Fuel</option>
                                    {codes['CAR_FUEL']?.map(c => <option key={c.code} value={c.valueKo}>{getCodeValue(c)}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                                <select value={transmission} onChange={(e) => setTransmission(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg">
                                    <option value="">Select Transmission</option>
                                    {codes['CAR_TRANSMISSION']?.map(c => <option key={c.code} value={c.valueKo}>{getCodeValue(c)}</option>)}
                                </select>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type</label>
                                <select value={listingType} onChange={(e) => setListingType(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg">
                                    <option value="">Select Type</option>
                                    {codes['REAL_ESTATE_LISTING']?.map(c => <option key={c.code} value={c.valueKo}>{getCodeValue(c)}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                                <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg">
                                    <option value="">Select Property Type</option>
                                    {codes['REAL_ESTATE_TYPE']?.map(c => <option key={c.code} value={c.valueKo}>{getCodeValue(c)}</option>)}
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
                        </div>
                    )}

                    {/* Job Specifics */}
                    {mainCategory === '취업' && (
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                                <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg">
                                    <option value="">Select Job Type</option>
                                    {codes['JOB_TYPE']?.map(c => <option key={c.code} value={c.valueKo}>{getCodeValue(c)}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                                <select value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg">
                                    <option value="">Select Experience</option>
                                    {codes['JOB_EXPERIENCE']?.map(c => <option key={c.code} value={c.valueKo}>{getCodeValue(c)}</option>)}
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
                    {/* Attachment Upload (For Jobs and News) */}
                    {(mainCategory === '취업' || mainCategory === '정부소식') && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Attachments / Images
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition cursor-pointer relative">
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-400 mt-1">Supports images and documents</p>
                            </div>

                            {/* Preview Selected Files */}
                            {attachments.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {attachments.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="flex items-center space-x-3">
                                                <FileText className="w-5 h-5 text-gray-500" />
                                                <span className="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
                                                <span className="text-xs text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                                                className="text-gray-400 hover:text-red-500 transition"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Rich Text Editor */}
                {/* Content (Multilingual) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="h-80 mb-12">
                        <MultiLangEditor
                            label="Content / Description"
                            value={content}
                            onChange={setContent}
                            renderInput={(val, onChange, placeholder) => (
                                <ReactQuill
                                    theme="snow"
                                    value={val}
                                    onChange={onChange}
                                    placeholder={placeholder}
                                    className="h-64"
                                />
                            )}
                        />
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
