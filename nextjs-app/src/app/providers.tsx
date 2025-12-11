'use client'

import { EventProvider } from '@/contexts/EventContext'
import { ModalityProvider } from '@/contexts/ModalityContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { ParticipantProvider } from '@/contexts/ParticipantContext'
import { EventThemeProvider } from '@/contexts/EventThemeContext'
import { ThemeProvider } from 'next-themes'
import { Toaster as Sonner } from '@/components/ui/sonner'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <EventThemeProvider>
                <AuthProvider>
                    <EventProvider>
                        <ModalityProvider>
                            <ParticipantProvider>
                                {children}
                                <Sonner />
                            </ParticipantProvider>
                        </ModalityProvider>
                    </EventProvider>
                </AuthProvider>
            </EventThemeProvider>
        </ThemeProvider>
    )
}
