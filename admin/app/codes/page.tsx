'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Plus, Trash2, Edit } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
    Table, Button, TextInput, NumberInput, Select, Modal, Group, Title, ActionIcon,
    Badge, Card, LoadingOverlay, Grid
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

interface CommonCode {
    id: number;
    type: string;
    code: string;
    valueKo: string;
    valueEn: string;
    valueLo: string;
    valueZh: string;
    order: number;
    isActive: boolean;
}

export default function CodeManagementPage() {
    const { t, i18n } = useTranslation();
    const [codes, setCodes] = useState<CommonCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<string | null>('ALL');

    // Modal State
    const [opened, { open, close }] = useDisclosure(false);
    const [editingCode, setEditingCode] = useState<CommonCode | null>(null);
    const [formData, setFormData] = useState<Partial<CommonCode>>({
        type: '',
        code: '',
        valueKo: '',
        valueEn: '',
        valueLo: '',
        valueZh: '',
        order: 0,
        isActive: true
    });

    useEffect(() => {
        fetchCodes();
    }, []);

    const fetchCodes = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:3000/common-codes');
            setCodes(res.data);
        } catch (error) {
            console.error('Failed to fetch codes', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingCode(null);
        setFormData({
            type: '',
            code: '',
            valueKo: '',
            valueEn: '',
            valueLo: '',
            valueZh: '',
            order: 0,
            isActive: true
        });
        open();
    };

    const handleEdit = (code: CommonCode) => {
        setEditingCode(code);
        setFormData({ ...code });
        open();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this code?')) return;
        try {
            await axios.delete(`http://localhost:3000/common-codes/${id}`);
            setCodes(codes.filter(c => c.id !== id));
        } catch (error) {
            console.error('Failed to delete code', error);
            alert('Failed to delete code');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCode) {
                const res = await axios.patch(`http://localhost:3000/common-codes/${editingCode.id}`, formData);
                setCodes(codes.map(c => c.id === editingCode.id ? res.data : c));
            } else {
                const res = await axios.post('http://localhost:3000/common-codes', formData);
                setCodes([...codes, res.data]);
            }
            close();
        } catch (error) {
            console.error('Failed to save code', error);
            alert('Failed to save code');
        }
    };

    // Derived values
    const uniqueTypes = Array.from(new Set(codes.map(c => c.type)));
    const filteredCodes = (!filterType || filterType === 'ALL') ? codes : codes.filter(c => c.type === filterType);

    const getDisplayValue = (code: CommonCode) => {
        const lang = i18n.language || 'ko';
        if (lang.startsWith('en')) return code.valueEn;
        if (lang.startsWith('lo')) return code.valueLo;
        if (lang.startsWith('zh')) return code.valueZh;
        return code.valueKo;
    }

    const rows = filteredCodes.map((code) => (
        <Table.Tr key={code.id}>
            <Table.Td><Badge color="gray" variant="light">{code.type}</Badge></Table.Td>
            <Table.Td style={{ fontFamily: 'monospace' }}>{code.code}</Table.Td>
            <Table.Td fw={700}>{getDisplayValue(code)}</Table.Td>
            <Table.Td>
                <div className="text-xs text-gray-500">
                    <div>KO: {code.valueKo}</div>
                    <div>EN: {code.valueEn}</div>
                    <div>LO: {code.valueLo}</div>
                    <div>ZH: {code.valueZh}</div>
                </div>
            </Table.Td>
            <Table.Td>{code.order}</Table.Td>
            <Table.Td align="right">
                <Group gap="xs" justify="flex-end">
                    <ActionIcon variant="subtle" color="indigo" onClick={() => handleEdit(code)}>
                        <Edit size="1rem" />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(code.id)}>
                        <Trash2 size="1rem" />
                    </ActionIcon>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <div className="p-4">
            <Group justify="space-between" mb="lg">
                <Title order={2}>{t('code_management')}</Title>
                <Button leftSection={<Plus size="1rem" />} color="laosGreen" onClick={handleCreate}>
                    Add Code
                </Button>
            </Group>

            {/* Filter */}
            <Card shadow="sm" radius="md" mb="lg" p="md" withBorder>
                <Group>
                    <Select
                        label="Filter by Type"
                        placeholder="Select type"
                        data={['ALL', ...uniqueTypes]}
                        value={filterType}
                        onChange={setFilterType}
                        searchable
                        clearable
                        style={{ width: 300 }}
                    />
                </Group>
            </Card>

            {/* Table */}
            <Card shadow="sm" radius="md" withBorder>
                <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} loaderProps={{ color: 'laosGreen' }} />
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Type</Table.Th>
                            <Table.Th>Code</Table.Th>
                            <Table.Th>Value (Current)</Table.Th>
                            <Table.Th>All Values</Table.Th>
                            <Table.Th>Order</Table.Th>
                            <Table.Th style={{ textAlign: 'right' }}>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </Card>

            {/* Modal */}
            <Modal opened={opened} onClose={close} title={editingCode ? 'Edit Code' : 'Add New Code'} size="lg">
                <form onSubmit={handleSubmit}>
                    <Grid>
                        <Grid.Col span={6}>
                            <TextInput
                                label="Type"
                                placeholder="e.g. CAR_BRAND"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.currentTarget.value })}
                                required
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput
                                label="Code"
                                placeholder="e.g. HYUNDAI"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.currentTarget.value })}
                                required
                            />
                        </Grid.Col>

                        <Grid.Col span={6}>
                            <TextInput
                                label="Value (Korean)"
                                value={formData.valueKo}
                                onChange={(e) => setFormData({ ...formData, valueKo: e.currentTarget.value })}
                                required
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput
                                label="Value (English)"
                                value={formData.valueEn}
                                onChange={(e) => setFormData({ ...formData, valueEn: e.currentTarget.value })}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput
                                label="Value (Lao)"
                                value={formData.valueLo}
                                onChange={(e) => setFormData({ ...formData, valueLo: e.currentTarget.value })}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput
                                label="Value (Chinese)"
                                value={formData.valueZh}
                                onChange={(e) => setFormData({ ...formData, valueZh: e.currentTarget.value })}
                            />
                        </Grid.Col>

                        <Grid.Col span={6}>
                            <NumberInput
                                label="Order"
                                value={formData.order}
                                onChange={(val) => setFormData({ ...formData, order: Number(val) })}
                            />
                        </Grid.Col>
                    </Grid>

                    <Group justify="flex-end" mt="xl">
                        <Button variant="default" onClick={close}>Cancel</Button>
                        <Button type="submit" color="laosGreen">Save Code</Button>
                    </Group>
                </form>
            </Modal>
        </div>
    );
}
