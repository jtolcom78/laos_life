import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import "@mantine/core/styles.css";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";
import { theme } from "../theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Laos Life Admin",
  description: "Admin Dashboard for Laos Life Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`${inter.className} bg-gray-50`}>
        <MantineProvider theme={theme}>
          <ClientLayout>{children}</ClientLayout>
        </MantineProvider>
      </body>
    </html>
  );
}
