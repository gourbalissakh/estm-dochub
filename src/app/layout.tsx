import { Footer } from '@/components/shared/footer'
import { Navbar } from '@/components/shared/navbar'
import { Providers } from '@/components/shared/providers'
import { getCurrentSession } from '@/lib/auth'
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'ESTM DocHub · Plateforme academique des etudiants ESTM Dakar',
    description:
        "Plateforme communautaire de partage de cours, TP, TD et anciens sujets pour les etudiants de l'ESTM Dakar.",
    keywords: [
        'ESTM',
        'Dakar',
        'cours',
        'documents',
        'etudiants',
        'TP',
        'TD',
        'examens',
    ],
    authors: [
        { name: "Amicale des etudiants Tchadiens a l'ESTM" },
    ],
    openGraph: {
        title: 'ESTM DocHub',
        description:
            "Plateforme communautaire pour les etudiants de l'ESTM Dakar.",
        type: 'website',
    },
}

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#f5efe4' },
        { media: '(prefers-color-scheme: dark)', color: '#0d1117' },
    ],
}

const themeScript = `
(function() {
  try {
    var saved = localStorage.getItem('theme');
    var dark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const session = await getCurrentSession()
    return (
        <html lang="fr" className={`h-full ${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body className={`flex min-h-full flex-col ${inter.className}`}>
                <Providers session={session}>
                    <Navbar />
                    <main className="flex-1">{children}</main>
                    <Footer />
                </Providers>
            </body>
        </html>
    )
}
