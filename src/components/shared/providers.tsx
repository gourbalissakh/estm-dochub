'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { useState } from 'react'

export function Providers({
    children,
    session,
}: {
    children: React.ReactNode
    session: Session | null
}) {
    const [queryClient] = useState(() => new QueryClient())
    return (
        <SessionProvider
            session={session}
            refetchOnWindowFocus={false}
            refetchInterval={0}
        >
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </SessionProvider>
    )
}
