'use client'

import {
    Facebook,
    Instagram,
    Twitter,
    MapPin,
    Phone,
    Mail,
    ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function PublicFooter({ eventName }: { eventName: string }) {
    return (
        <footer className="bg-slate-950 text-slate-300 pt-20 pb-10 border-t border-slate-900">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <div>
                            <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl mb-4 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                                JE
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                                {eventName}
                            </h3>
                            <p className="text-sm leading-relaxed text-slate-400">
                                Referência em organização esportiva, unindo excelência técnica,
                                inovação e compromisso social em cada competição.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <Button
                                    key={i}
                                    size="icon"
                                    variant="outline"
                                    className="rounded-full border-slate-800 bg-slate-900/50 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300"
                                >
                                    <Icon className="h-4 w-4" />
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Nav Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">
                            Navegação
                        </h4>
                        <ul className="space-y-3 text-sm">
                            {['Início', 'Sobre o Evento', 'Parceiros', 'Inscrição'].map(
                                (item) => (
                                    <li key={item}>
                                        <a
                                            href="#"
                                            className="hover:text-blue-600 hover:pl-2 transition-all duration-300 block"
                                        >
                                            {item}
                                        </a>
                                    </li>
                                ),
                            )}
                        </ul>
                    </div>

                    {/* Institutional */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">
                            Institucional
                        </h4>
                        <ul className="space-y-3 text-sm">
                            {[
                                'Portal da Transparência',
                                'Área de Imprensa',
                                'Documentos Oficiais',
                                'Galeria de Fotos',
                            ].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="hover:text-blue-600 hover:pl-2 transition-all duration-300 block"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">
                            Contato
                        </h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3 group">
                                <div className="p-2 bg-slate-900 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <MapPin className="h-4 w-4 shrink-0" />
                                </div>
                                <span className="mt-1 text-slate-400">
                                    Av. do Esporte, 1000
                                    <br />
                                    Centro Olímpico, Bloco C
                                </span>
                            </li>
                            <li className="flex items-center gap-3 group">
                                <div className="p-2 bg-slate-900 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Phone className="h-4 w-4 shrink-0" />
                                </div>
                                <span className="text-slate-400">(11) 99999-9999</span>
                            </li>
                            <li className="flex items-center gap-3 group">
                                <div className="p-2 bg-slate-900 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Mail className="h-4 w-4 shrink-0" />
                                </div>
                                <span className="text-slate-400">
                                    contato@jogosescolares.com
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="bg-slate-800 mb-8" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500 font-medium">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <p>
                            &copy; 2025 {eventName}.{' '}
                            <span className="hidden md:inline">|</span> Todos os direitos
                            reservados.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-white transition-colors">
                                Política de Privacidade
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                Termos de Uso
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
                        <div className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </div>
                        <span className="text-slate-300 uppercase tracking-wide text-[10px] flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3" />
                            Sistemas Operacionais
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
