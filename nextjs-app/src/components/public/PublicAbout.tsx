'use client'

interface PublicAboutProps {
    description?: string
}

export function PublicAbout({ description }: PublicAboutProps) {
    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 right-0 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-5xl mx-auto space-y-12">
                    <div className="text-center">
                        <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter text-slate-900 relative inline-block mb-4">
                            Sobre o Evento
                        </h2>
                    </div>

                    <div className="prose prose-lg md:prose-xl mx-auto text-slate-600 max-w-none text-left">
                        {description ? (
                            <div
                                className="leading-relaxed [&>h1]:font-black [&>h1]:text-3xl [&>h1]:mb-6 [&>h1]:text-slate-900 [&>p]:mb-4"
                                dangerouslySetInnerHTML={{ __html: description }}
                            />
                        ) : (
                            <>
                                <p className="leading-relaxed font-medium">
                                    Nossa missão é promover a integração social, o exercício da
                                    cidadania e a descoberta de novos talentos através do desporto
                                    escolar de alto nível.
                                </p>
                                <p className="mt-4 text-base md:text-lg text-slate-500 font-normal">
                                    Acreditamos que o esporte é uma ferramenta poderosa de transformação,
                                    capaz de unir comunidades, desenvolver disciplina e inspirar a próxima
                                    geração de atletas e cidadãos conscientes.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
