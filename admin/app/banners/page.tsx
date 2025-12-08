'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Title, Group, Button, Table, Badge, Card, LoadingOverlay,
    Modal, TextInput, NumberInput, Switch, ActionIcon, Text, Image as MantineImage, Tabs
} from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconUpload, IconPhoto, IconX, IconTrash, IconEdit, IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

interface Banner {
    id: number;
    title: string;
    images: { [key: string]: string };
    imageUrl?: string; // Legacy
    linkUrl?: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
}

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [opened, { open, close }] = useDisclosure(false);

    // Form State
    const [editingId, setEditingId] = useState<number | null>(null);
    const [title, setTitle] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [sortOrder, setSortOrder] = useState<number>(0);
    const [isActive, setIsActive] = useState(true);

    // Multi-language Images State
    const [images, setImages] = useState<{ [key: string]: string }>({
        lo: '', en: '', ko: '', zh: ''
    });
    const [activeTab, setActiveTab] = useState<string | null>('lo');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        try {
            const response = await axios.get(`${API_URL}/banners`);
            setBanners(response.data);
        } catch (error) {
            console.error('Failed to fetch banners:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (files: File[]) => {
        if (files.length === 0 || !activeTab) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', files[0]);
        formData.append('folder', 'banners');

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        try {
            const response = await axios.post(`${API_URL}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setImages(prev => ({ ...prev, [activeTab]: response.data.url }));
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        // Validation: At least Lao (default) is nice, but let's check if ANY image exists
        const hasImage = Object.values(images).some(url => !!url);
        if (!hasImage) {
            alert('At least one banner image is required');
            return;
        }

        const payload = {
            title,
            images,
            imageUrl: images.lo || Object.values(images)[0], // Fallback for legacy
            linkUrl,
            isActive,
            sortOrder
        };

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        try {
            if (editingId) {
                await axios.patch(`${API_URL}/banners/${editingId}`, payload);
            } else {
                await axios.post(`${API_URL}/banners`, payload);
            }
            closeModal();
            fetchBanners();
        } catch (error) {
            console.error('Save failed:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure?')) return;
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        try {
            await axios.delete(`${API_URL}/banners/${id}`);
            fetchBanners();
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const openEdit = (banner: Banner) => {
        setEditingId(banner.id);
        setTitle(banner.title);
        // Handle migration from legacy imageUrl to images object if needed
        if (banner.images) {
            setImages({
                lo: banner.images.lo || '',
                en: banner.images.en || '',
                ko: banner.images.ko || '',
                zh: banner.images.zh || ''
            });
        } else if (banner.imageUrl) {
            // Legacy fallback
            setImages({ lo: banner.imageUrl, en: '', ko: '', zh: '' });
        } else {
            setImages({ lo: '', en: '', ko: '', zh: '' });
        }

        setLinkUrl(banner.linkUrl || '');
        setSortOrder(banner.sortOrder);
        setIsActive(banner.isActive);
        open();
    };

    const closeModal = () => {
        setEditingId(null);
        setTitle('');
        setImages({ lo: '', en: '', ko: '', zh: '' });
        setLinkUrl('');
        setSortOrder(0);
        setIsActive(true);
        setActiveTab('lo');
        close();
    };

    const rows = banners.map((banner) => {
        // Display primary image (LO or first available)
        const displayImage = banner.images?.lo || banner.images?.en || banner.imageUrl || '';

        return (
            <Table.Tr key={banner.id}>
                <Table.Td>
                    <MantineImage src={displayImage} h={60} w={100} radius="sm" fit="cover" />
                </Table.Td>
                <Table.Td>{banner.title}</Table.Td>
                <Table.Td>{banner.linkUrl || '-'}</Table.Td>
                <Table.Td>{banner.sortOrder}</Table.Td>
                <Table.Td>
                    <Badge color={banner.isActive ? 'green' : 'gray'}>
                        {banner.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                </Table.Td>
                <Table.Td>
                    <Group gap="xs">
                        <ActionIcon variant="light" color="blue" onClick={() => openEdit(banner)}>
                            <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon variant="light" color="red" onClick={() => handleDelete(banner.id)}>
                            <IconTrash size={16} />
                        </ActionIcon>
                    </Group>
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <div className="p-6">
            <Group justify="space-between" mb="lg">
                <Title order={2}>Banner Management</Title>
                <Button leftSection={<IconPlus size={16} />} onClick={open}>
                    Add Banner
                </Button>
            </Group>

            <Card withBorder radius="md" p="md">
                <LoadingOverlay visible={loading} />
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Preview</Table.Th>
                            <Table.Th>Title</Table.Th>
                            <Table.Th>Link</Table.Th>
                            <Table.Th>Order</Table.Th>
                            <Table.Th>Status</Table.Th>
                            <Table.Th>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {rows.length > 0 ? rows : (
                            <Table.Tr>
                                <Table.Td colSpan={6} align="center">No banners found</Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </Card>

            <Modal opened={opened} onClose={closeModal} title={editingId ? "Edit Banner" : "New Banner"} size="lg">
                <div className="space-y-4">
                    <TextInput
                        label="Title (Optional)"
                        placeholder="Banner title"
                        value={title}
                        onChange={(e) => setTitle(e.currentTarget.value)}
                    />

                    <div>
                        <Text size="sm" fw={500} mb={4}>Banner Images (Multilingual)</Text>
                        <Tabs value={activeTab} onChange={setActiveTab} variant="outline">
                            <Tabs.List>
                                <Tabs.Tab value="lo" leftSection={<Text>🇱🇦</Text>}>Lao</Tabs.Tab>
                                <Tabs.Tab value="en" leftSection={<Text>🇺🇸</Text>}>English</Tabs.Tab>
                                <Tabs.Tab value="ko" leftSection={<Text>🇰🇷</Text>}>Korean</Tabs.Tab>
                                <Tabs.Tab value="zh" leftSection={<Text>🇨🇳</Text>}>Chinese</Tabs.Tab>
                            </Tabs.List>

                            {['lo', 'en', 'ko', 'zh'].map((lang) => (
                                <Tabs.Panel key={lang} value={lang} pt="xs">
                                    <Dropzone
                                        onDrop={handleUpload}
                                        onReject={(files) => console.log('rejected files', files)}
                                        maxSize={3 * 1024 ** 2}
                                        accept={IMAGE_MIME_TYPE}
                                        loading={uploading}
                                        multiple={false}
                                    >
                                        <Group justify="center" gap="xl" style={{ minHeight: 120, pointerEvents: 'none' }}>
                                            <Dropzone.Accept>
                                                <IconUpload size="3.2rem" stroke={1.5} />
                                            </Dropzone.Accept>
                                            <Dropzone.Reject>
                                                <IconX size="3.2rem" stroke={1.5} />
                                            </Dropzone.Reject>
                                            <Dropzone.Idle>
                                                <div className="text-center">
                                                    <IconPhoto size="3.2rem" stroke={1.5} />
                                                    <Text size="xl" inline>
                                                        Upload {lang.toUpperCase()} Banner
                                                    </Text>
                                                    <Text size="sm" c="dimmed" inline mt={7}>
                                                        Max 3MB. Recommended: 1000x400px (5:2)
                                                    </Text>
                                                </div>
                                            </Dropzone.Idle>
                                        </Group>
                                    </Dropzone>

                                    {images[lang] && (
                                        <MantineImage src={images[lang]} h={150} mt="sm" radius="md" fit="contain" />
                                    )}
                                </Tabs.Panel>
                            ))}
                        </Tabs>
                    </div>

                    <TextInput
                        label="Link URL (Optional)"
                        placeholder="https://..."
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.currentTarget.value)}
                    />

                    <Group grow>
                        <NumberInput
                            label="Sort Order"
                            value={sortOrder}
                            onChange={(val) => setSortOrder(Number(val))}
                        />
                        <Switch
                            label="Active Status"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.currentTarget.checked)}
                            mt="xl"
                        />
                    </Group>

                    <Button fullWidth onClick={handleSubmit} mt="md" loading={uploading}>
                        Save Banner
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
