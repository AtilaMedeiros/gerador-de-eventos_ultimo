'use client'

import { EventProvider } from '@/contexts/EventContext'
import { ModalityProvider } from '@/contexts/ModalityContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from 'next-themes'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <AuthProvider>
                <EventProvider>
                    <ModalityProvider>
                        <TooltipProvider>
                            {children}
                            <Toaster />
                            <Sonner />
                        </TooltipProvider>
                    </ModalityProvider>
                </EventProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}
