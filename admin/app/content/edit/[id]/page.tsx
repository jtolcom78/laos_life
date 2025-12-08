'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { Loader2, Upload, X, FileText } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { MultiLangEditor } from '@/components/MultiLangEditor';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function EditContentPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    // State for Multi-Language
    const [title, setTitle] = useState<{ [key: string]: string }>({});
    const [content, setContent] = useState<{ [key: string]: string }>({});

    const [category, setCategory] = useState('Notice');
    const [thumbnail, setThumbnail] = useState('');
    const [attachments, setAttachments] = useState<string[]>([]);
    const [newAttachments, setNewAttachments] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const quillRef = useRef<any>(null);

    // TODO: Sync these categories with CreatePage or API
    const categories = ['정부소식', 'Notice', '취업', 'Government', 'Event', 'Promotion'];

    useEffect(() => {
        if (id) fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/posts/${id}`);
            const post = res.data;

            // Handle Title (String or Object)
            if (typeof post.title === 'string') {
                setTitle({ ko: post.title }); // Default to Korean if string
            } else {
                setTitle(post.title || {});
            }

            setCategory(post.category || 'Notice');

            // Handle Content (String or Object)
            if (typeof post.content === 'string') {
                setContent({ ko: post.content });
            } else {
                setContent(post.content || {});
            }

            setThumbnail(post.thumbnail || '');
            setAttachments(post.attachments || []);
        } catch (err) {
            console.error('Failed to fetch post:', err);
            alert('Failed to load post');
            router.push('/content');
        } finally {
            setFetching(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewAttachments(Array.from(e.target.files));
        }
    };

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'posts');

        try {
            const res = await axios.post('http://localhost:3000/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setThumbnail(res.data.url);
        } catch (err) {
            console.error('Thumbnail upload failed:', err);
            alert('Thumbnail upload failed');
        }
    };

    // Image Handler for Quill (in MultiLangEditor, this might need adjustment if we pass modules)
    // Since we are moving to MultiLangEditor, we pass `renderInput`.
    // We can define the Quill instance inside renderInput.
    // NOTE: `quillRef` behaves differently with multiple editors. 
    // We might lose the ability to insert image into specific editor easily unless we refactor.
    // For now, let's use a simple Quill config for MultiLang.

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Upload New Attachments
            const attachmentUrls: string[] = [...attachments];
            if (newAttachments.length > 0) {
                for (const file of newAttachments) {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('folder', 'attachments');
                    const uploadRes = await axios.post('http://localhost:3000/upload', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    attachmentUrls.push(uploadRes.data.url);
                }
            }

            await axios.patch(`http://localhost:3000/posts/${id}`, {
                title,   // Object
                category,
                content, // Object
                thumbnail,
                attachments: attachmentUrls
            });
            router.push('/content');
        } catch (err) {
            console.error('Failed to update post:', err);
            alert('Failed to update post');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Content</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        {/* Title MultiLang */}
                        <div className="mb-1">
                            <MultiLangEditor
                                label="Title"
                                value={title}
                                onChange={setTitle}
                                renderInput={(val, onChange, placeholder) => (
                                    <input
                                        type="text"
                                        value={val}
                                        onChange={(e) => onChange(e.target.value)}
                                        required // Only validates active input? No, standard required doesn't work well here.
                                        // We should validate manually or rely on logic inside editor. 
                                        // MultiLangEditor doesn't propagate 'required'.
                                        className="w-full px-4 py-2 border-none outline-none focus:ring-0"
                                        placeholder={placeholder}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail</label>
                    <div className="flex items-center space-x-4">
                        {thumbnail && (
                            <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                                <img src={thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setThumbnail('')}
                                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg hover:bg-red-600"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                        <label className="cursor-pointer bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Image
                            <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload} />
                        </label>
                    </div>
                </div>

                {/* Attachments Section */}
                {(category === '정부소식' || category === '취업') && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>

                        {/* New Upload Area */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition cursor-pointer relative mb-4">
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                        </div>

                        {/* Existing Attachments */}
                        {attachments.length > 0 && (
                            <div className="space-y-2 mb-4">
                                <p className="text-xs font-semibold text-gray-500 uppercase">Existing Files</p>
                                {attachments.map((url, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <FileText className="w-5 h-5 text-gray-500" />
                                            <a href={url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline truncate max-w-xs">
                                                {url.split('/').pop()}
                                            </a>
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

                        {/* New Selected Files */}
                        {newAttachments.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-gray-500 uppercase">New Files</p>
                                {newAttachments.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                                        <div className="flex items-center space-x-3">
                                            <FileText className="w-5 h-5 text-green-600" />
                                            <span className="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setNewAttachments(prev => prev.filter((_, i) => i !== index))}
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

                <div>
                    <div className="h-96 mb-12">
                        <MultiLangEditor
                            label="Content"
                            value={content}
                            onChange={setContent}
                            renderInput={(val, onChange, placeholder) => (
                                <ReactQuill
                                    theme="snow"
                                    value={val}
                                    onChange={onChange}
                                    placeholder={placeholder}
                                    className="h-80"
                                />
                            )}
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg mr-4"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition flex items-center disabled:opacity-50"
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Update Post
                    </button>
                </div>
            </form>
        </div>
    );
}
