'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Shield, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
    Title, Group, Button, Table, Badge, Card, LoadingOverlay, Alert, Avatar, Text, TextInput
} from '@mantine/core';

interface UserData {
    id: number;
    username: string;
    email: string;
    role: string;
    status: string;
    profileImage?: string;
    createdAt: string;
}

export default function UsersPage() {
    const { t } = useTranslation();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        try {
            const response = await axios.get(`${API_URL}/users`);
            // Mock data if empty
            if (!response.data || response.data.length === 0) {
                setUsers([
                    { id: 1, username: 'admin', email: 'admin@laoslife.com', role: 'ADMIN', status: 'ACTIVE', createdAt: '2025-01-01' },
                    { id: 2, username: 'user1', email: 'user1@gmail.com', role: 'USER', status: 'ACTIVE', createdAt: '2025-01-02' },
                    { id: 3, username: 'seller_kim', email: 'kim@store.com', role: 'SELLER', status: 'PENDING', createdAt: '2025-01-03' },
                ]);
            } else {
                setUsers(response.data);
            }
        } catch (error) {
            console.error(error);
            setUsers([
                { id: 1, username: 'admin', email: 'admin@laoslife.com', role: 'ADMIN', status: 'ACTIVE', createdAt: '2025-01-01' },
                { id: 2, username: 'user1', email: 'user1@gmail.com', role: 'USER', status: 'ACTIVE', createdAt: '2025-01-02' },
                { id: 3, username: 'seller_kim', email: 'kim@store.com', role: 'SELLER', status: 'PENDING', createdAt: '2025-01-03' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const rows = users
        .filter(u => u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
        .map((user) => (
            <Table.Tr key={user.id}>
                <Table.Td>
                    <Group gap="sm">
                        <Avatar size={30} radius="xl" color="initials">{user.username.substring(0, 2).toUpperCase()}</Avatar>
                        <Text size="sm" fw={500}>{user.username}</Text>
                    </Group>
                </Table.Td>
                <Table.Td>{user.email}</Table.Td>
                <Table.Td>
                    <Badge
                        color={user.role === 'ADMIN' ? 'red' : user.role === 'SELLER' ? 'blue' : 'gray'}
                        variant="light"
                    >
                        {user.role}
                    </Badge>
                </Table.Td>
                <Table.Td>
                    <Badge
                        color={user.status === 'ACTIVE' ? 'green' : 'orange'}
                        variant="dot"
                    >
                        {user.status}
                    </Badge>
                </Table.Td>
                <Table.Td>{new Date(user.createdAt).toLocaleDateString()}</Table.Td>
                <Table.Td>
                    <Button variant="subtle" size="xs" color="gray">Edit</Button>
                </Table.Td>
            </Table.Tr>
        ));

    return (
        <div className="p-4">
            <Group justify="space-between" mb="lg">
                <Title order={2} c="gray.8">
                    <User className="inline-block mr-2" size={28} />
                    {t('user_management')}
                </Title>
                <TextInput
                    placeholder="Search users..."
                    leftSection={<Search size={14} />}
                    value={search}
                    onChange={(e) => setSearch(e.currentTarget.value)}
                />
            </Group>

            <Card shadow="sm" radius="md" withBorder p={0}>
                <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />

                <Table striped highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead bg="gray.0">
                        <Table.Tr>
                            <Table.Th>User</Table.Th>
                            <Table.Th>Email</Table.Th>
                            <Table.Th>Role</Table.Th>
                            <Table.Th>Status</Table.Th>
                            <Table.Th>Joined</Table.Th>
                            <Table.Th>Action</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>

                {rows.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No users found
                    </div>
                )}
            </Card>
        </div>
    );
}
