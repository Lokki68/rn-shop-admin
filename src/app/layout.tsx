import type { Metadata } from "next";
import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import {Toaster} from '@/components/ui/sonner'
import { ThemeProvider } from "@/providers/theme-provider";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "rn Shop Admin",
  description: "React Native Shop Admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={inter.className}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main>{children}</main>
            <Toaster richColors />
          </ThemeProvider>
      </body>
    </html>
  );
}
