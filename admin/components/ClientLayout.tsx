'use client';

import { AppShell, Burger, Group, NavLink, Text, ActionIcon, Button, Avatar, SegmentedControl, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { LayoutDashboard, Users, FileText, LogOut, Globe, BarChart2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '../app/i18n';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [opened, { toggle }] = useDisclosure();
    const { t, i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        // Log access
        fetch(`${API_URL}/statistics/log`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: window.location.pathname, userAgent: navigator.userAgent })
        }).catch(err => console.error('Access log failed', err));
    }, []);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };
    if (!mounted) return null;

    return (
        <AppShell
            header={{ height: 70 }}
            navbar={{ width: 280, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header style={{ borderBottom: '1px solid #eee' }}>
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <Text fw={900} variant="gradient" gradient={{ from: 'laosGreen', to: 'lime', deg: 45 }} size="xl">
                            Laos Life Admin
                        </Text>
                    </Group>
                    <Group>
                        <SegmentedControl
                            value={i18n.language}
                            onChange={changeLanguage}
                            data={[
                                { label: 'EN', value: 'en' },
                                { label: 'KO', value: 'ko' },
                                { label: 'LO', value: 'lo' },
                            ]}
                            size="xs"
                            radius="md"
                        />
                        <Avatar color="laosGreen" radius="xl" variant="light">A</Avatar>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md" className="bg-gradient-to-b from-[#006400] to-[#004d00]" style={{ borderRight: 'none' }}>
                <ScrollArea>
                    <Text size="xs" c="gray.3" mb="lg" mt="xs" fw={700} tt="uppercase" opacity={0.7} px="xs">DASHBOARD</Text>

                    <NavLink
                        component={Link}
                        href="/"
                        label={t('dashboard')}
                        leftSection={<LayoutDashboard size="1.2rem" />}
                        active={pathname === '/'}
                        variant="subtle"
                        c={pathname === '/' ? 'white' : 'gray.3'}
                        bg={pathname === '/' ? 'white/20' : 'transparent'}
                        style={{ borderRadius: 8 }}
                        fw={500}
                        mb={4}
                    />
                    <NavLink
                        component={Link}
                        href="/users"
                        label={t('user_management')}
                        leftSection={<Users size="1.2rem" />}
                        active={pathname === '/users'}
                        variant="subtle"
                        c={pathname === '/users' ? 'white' : 'gray.3'}
                        bg={pathname === '/users' ? 'white/20' : 'transparent'}
                        style={{ borderRadius: 8 }}
                        fw={500}
                        mb={4}
                    />
                    <NavLink
                        component={Link}
                        href="/content"
                        label={t('content_management')}
                        leftSection={<FileText size="1.2rem" />}
                        active={pathname === '/content'}
                        variant="subtle"
                        c={pathname === '/content' ? 'white' : 'gray.3'}
                        bg={pathname === '/content' ? 'white/20' : 'transparent'}
                        style={{ borderRadius: 8 }}
                        fw={500}
                        mb={4}
                    />
                    <NavLink
                        component={Link}
                        href="/codes"
                        label={t('code_management')}
                        leftSection={<Globe size="1.2rem" />}
                        active={pathname === '/codes'}
                        variant="subtle"
                        c={pathname === '/codes' ? 'white' : 'gray.3'}
                        bg={pathname === '/codes' ? 'white/20' : 'transparent'}
                        style={{ borderRadius: 8 }}
                        fw={500}
                        mb={4}
                    />
                    <NavLink
                        component={Link}
                        href="/statistics"
                        label={t('statistics')}
                        leftSection={<BarChart2 size="1.2rem" />}
                        active={pathname === '/statistics'}
                        variant="subtle"
                        c={pathname === '/statistics' ? 'white' : 'gray.3'}
                        bg={pathname === '/statistics' ? 'white/20' : 'transparent'}
                        style={{ borderRadius: 8 }}
                        fw={500}
                        mb={4}
                    />
                    <NavLink
                        component={Link}
                        href="/banners"
                        label="Banner Management"
                        leftSection={<ImageIcon size="1.2rem" />}
                        active={pathname === '/banners'}
                        variant="subtle"
                        c={pathname === '/banners' ? 'white' : 'gray.3'}
                        bg={pathname === '/banners' ? 'white/20' : 'transparent'}
                        style={{ borderRadius: 8 }}
                        fw={500}
                        mb={4}
                    />

                    <div style={{ height: 40 }} />

                    <Button variant="white" color="red" leftSection={<LogOut size="1rem" />} fullWidth justify="flex-start" bg="white/10" style={{ border: 'none', color: '#ffc9c9' }}>
                        {t('logout')}
                    </Button>
                </ScrollArea>
            </AppShell.Navbar>

            <AppShell.Main>
                {children}
            </AppShell.Main>
        </AppShell>
    );
}
