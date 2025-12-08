'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
    Title, Group, SegmentedControl, Card, Text, Grid, Badge, RingProgress, LoadingOverlay, ThemeIcon
} from '@mantine/core';

interface AccessStats {
    dailyVisits: { date: string, count: string }[];
    dailyNewUsers: { date: string, count: string }[];
}

interface ContentStats {
    topCars: any[];
    topRealEstates: any[];
    topJobs: any[];
}

export default function StatisticsPage() {
    const { t } = useTranslation();
    const [statsType, setStatsType] = useState<string>('access');
    const [loading, setLoading] = useState(true);
    const [accessData, setAccessData] = useState<AccessStats | null>(null);
    const [contentData, setContentData] = useState<ContentStats | null>(null);

    useEffect(() => {
        fetchData();
    }, [statsType]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (statsType === 'access') {
                const res = await axios.get('http://localhost:3000/statistics/access');
                setAccessData(res.data);
            } else {
                const res = await axios.get('http://localhost:3000/statistics/content');
                setContentData(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch statistics', error);
        } finally {
            setLoading(false);
        }
    };

    const getAccessChartData = () => {
        if (!accessData) return [];
        const visits = accessData.dailyVisits;
        const users = accessData.dailyNewUsers;
        const allDates = Array.from(new Set([...visits.map(v => v.date), ...users.map(u => u.date)])).sort();

        return allDates.map(date => ({
            date,
            visits: parseInt(visits.find(v => v.date === date)?.count || '0'),
            newUsers: parseInt(users.find(u => u.date === date)?.count || '0')
        }));
    };

    return (
        <div className="p-4">
            <Title order={2} mb="lg" c="gray.8">
                <TrendingUp className="inline-block mr-2 text-green-600" size={28} />
                {t('statistics')}
            </Title>

            <Group mb="xl">
                <SegmentedControl
                    value={statsType}
                    onChange={setStatsType}
                    data={[
                        { label: 'Access & Users', value: 'access' },
                        { label: 'Content Views', value: 'content' },
                    ]}
                    color="laosGreen"
                    size="md"
                />
            </Group>

            <div style={{ position: 'relative', minHeight: 400 }}>
                <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} loaderProps={{ color: 'laosGreen' }} />

                {statsType === 'access' && accessData && (
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Title order={4} mb="md">Daily Activity</Title>
                        <div style={{ height: 400, width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={getAccessChartData()}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="visits" stroke="#16a34a" name="Page Visits" strokeWidth={2} activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="newUsers" stroke="#2563eb" name="New Users" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                )}

                {statsType === 'content' && contentData && (
                    <Grid>
                        {/* Top Cars */}
                        <Grid.Col span={{ base: 12, lg: 6 }}>
                            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                                <Group mb="md">
                                    <ThemeIcon variant="light" color="green" size="lg">
                                        <Eye size="1.2rem" />
                                    </ThemeIcon>
                                    <Title order={4}>Top Viewed Cars</Title>
                                </Group>

                                {contentData.topCars.map((car: any, index: number) => (
                                    <Group key={car.id} justify="space-between" mb="sm" p="xs" bg="gray.0" style={{ borderRadius: 8 }}>
                                        <Group>
                                            <Badge circle size="lg" color="green">{index + 1}</Badge>
                                            <div>
                                                <Text size="sm" fw={500}>{car.brand} {car.model}</Text>
                                                <Text size="xs" c="dimmed">{car.year} • {car.location}</Text>
                                            </div>
                                        </Group>
                                        <div style={{ textAlign: 'right' }}>
                                            <Text fw={700}>{car.viewCount}</Text>
                                            <Text size="xs" c="dimmed">views</Text>
                                        </div>
                                    </Group>
                                ))}
                            </Card>
                        </Grid.Col>

                        {/* Top Real Estate */}
                        <Grid.Col span={{ base: 12, lg: 6 }}>
                            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                                <Group mb="md">
                                    <ThemeIcon variant="light" color="blue" size="lg">
                                        <Eye size="1.2rem" />
                                    </ThemeIcon>
                                    <Title order={4}>Top Viewed Real Estate</Title>
                                </Group>

                                {contentData.topRealEstates.map((item: any, index: number) => (
                                    <Group key={item.id} justify="space-between" mb="sm" p="xs" bg="gray.0" style={{ borderRadius: 8 }}>
                                        <Group>
                                            <Badge circle size="lg" color="blue">{index + 1}</Badge>
                                            <div>
                                                <Text size="sm" fw={500}>{item.propertyType} in {item.location}</Text>
                                                <Text size="xs" c="dimmed">{item.listingType} • ${item.price}</Text>
                                            </div>
                                        </Group>
                                        <div style={{ textAlign: 'right' }}>
                                            <Text fw={700}>{item.viewCount}</Text>
                                            <Text size="xs" c="dimmed">views</Text>
                                        </div>
                                    </Group>
                                ))}
                            </Card>
                        </Grid.Col>

                        {/* Top Jobs */}
                        <Grid.Col span={12}>
                            <Card shadow="sm" padding="lg" radius="md" withBorder>
                                <Group mb="md">
                                    <ThemeIcon variant="light" color="grape" size="lg">
                                        <Eye size="1.2rem" />
                                    </ThemeIcon>
                                    <Title order={4}>Top Viewed Jobs</Title>
                                </Group>

                                <Grid>
                                    {contentData.topJobs.map((item: any, index: number) => (
                                        <Grid.Col span={{ base: 12, md: 6 }} key={item.id}>
                                            <Group justify="space-between" p="xs" bg="gray.0" style={{ borderRadius: 8 }}>
                                                <Group>
                                                    <Badge circle size="lg" color="grape">{index + 1}</Badge>
                                                    <div>
                                                        <Text size="sm" fw={500}>{item.industry}</Text>
                                                        <Text size="xs" c="dimmed">{item.jobType} • {item.salaryRange}</Text>
                                                    </div>
                                                </Group>
                                                <div style={{ textAlign: 'right' }}>
                                                    <Text fw={700}>{item.viewCount}</Text>
                                                    <Text size="xs" c="dimmed">views</Text>
                                                </div>
                                            </Group>
                                        </Grid.Col>
                                    ))}
                                </Grid>
                            </Card>
                        </Grid.Col>
                    </Grid>
                )}
            </div>
        </div>
    );
}
