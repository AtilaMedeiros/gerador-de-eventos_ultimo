import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Calendar,
    MapPin,
    Clock,
    Info,
    User,
    ArrowLeft,
    Rocket,
    AlertTriangle,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface EventPreviewProps {
    data: any
    onClose: () => void
    onPublish: () => void
}

// Helper hook to manage object URLs and avoid memory leaks
function useFilePreview(file: File | string | undefined | null) {
    const [preview, setPreview] = useState<string | null>(null)

    useEffect(() => {
        if (!file) {
            setPreview(null)
            return
        }

        if (typeof file === 'string') {
            setPreview(file)
            return
        }

        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)

        return () => {
            URL.revokeObjectURL(objectUrl)
        }
    }, [file])

    return preview
}

// Component for rendering image previews from files in lists
function PreviewImage({
    file,
    className,
    alt,
}: {
    file: File | string
    className?: string
    alt?: string
}) {
    const src = useFilePreview(file)
    if (!src) return null
    return <img src={src} alt={alt || 'Preview'} className={className} />
}

export function EventPreview({ data, onClose, onPublish }: EventPreviewProps) {
    const formatDate = (date: Date | string | undefined) => {
        if (!date) return 'Data não definida'
        try {
            return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
        } catch (e) {
            return 'Data inválida'
        }
    }

    // Safe file access
    const coverFile =
        data.imagem && data.imagem.length > 0 ? data.imagem[0] : null
    const coverUrl = useFilePreview(coverFile)
    const coverImage =
        coverUrl ||
        'https://img.usecurling.com/p/1200/400?q=sports%20stadium&color=blue'

    const logoFile =
        data.logoEvento && data.logoEvento.length > 0 ? data.logoEvento[0] : null
    const logoImage = useFilePreview(logoFile)

    return (
        <div className="flex flex-col h-[90vh] w-full bg-background rounded-lg overflow-hidden border shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Preview Header Bar */}
            <div className="bg-primary/5 border-b p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <Badge
                        variant="outline"
                        className="bg-background text-foreground border-primary/50 px-3 py-1"
                    >
                        <AlertTriangle className="mr-1 h-3 w-3 text-warning" />
                        Modo de Pré-visualização
                    </Badge>
                    <span className="text-sm text-muted-foreground hidden md:inline-block">
                        Verifique como os participantes verão o evento antes de publicar.
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={onClose} className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Voltar ao Formulário</span>
                    </Button>
                    <Button
                        onClick={onPublish}
                        // className="bg-success hover:bg-success/90 text-white gap-2 shadow-sm"
                        className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm"
                    >
                        <Rocket className="h-4 w-4" />
                        Publicar Agora
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1 bg-gray-50/50">
                <div className="flex flex-col min-h-full pb-10">
                    {/* Hero Section */}
                    <div className="relative w-full bg-gray-900 text-white">
                        <div className="h-64 md:h-96 w-full relative overflow-hidden">
                            <img
                                src={coverImage}
                                alt="Capa do Evento"
                                className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        </div>

                        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
                            <div className="container mx-auto flex flex-col md:flex-row gap-6 items-end">
                                {logoImage && (
                                    <div className="h-24 w-24 md:h-32 md:w-32 bg-white rounded-lg p-2 shadow-lg shrink-0">
                                        <img
                                            src={logoImage}
                                            alt="Logo"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 space-y-2">
                                    <Badge className="bg-green-600 text-white hover:bg-green-700 mb-2">
                                        Inscrições Abertas
                                    </Badge>
                                    <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                                        {data.name || 'Nome do Evento'}
                                    </h1>
                                    <div className="flex flex-wrap gap-4 text-sm md:text-base text-gray-300 pt-2">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-4 w-4 text-primary" />
                                            {formatDate(data.dataInicio)}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-4 w-4 text-primary" />
                                            {data.horaInicio || '00:00'}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="h-4 w-4 text-primary" />
                                            Local a definir
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="container mx-auto p-4 md:p-8 grid lg:grid-cols-3 gap-8 -mt-4 relative z-10">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* About */}
                            <Card>
                                <CardContent className="p-6 space-y-4">
                                    <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2">
                                        <Info className="h-5 w-5 text-primary" />
                                        Sobre o Evento
                                    </h2>
                                    <div className="prose max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{ __html: data.textoInstitucional || 'Nenhuma informação institucional fornecida.' }} />
                                </CardContent>
                            </Card>

                            {/* Schedule Placeholder */}
                            <Card>
                                <CardContent className="p-6 space-y-4">
                                    <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        Cronograma
                                    </h2>
                                    <div className="p-8 text-center border-2 border-dashed rounded-lg bg-muted/30">
                                        <p className="text-muted-foreground">
                                            O cronograma detalhado de modalidades e jogos será exibido
                                            aqui após a configuração das chaves.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column / Sidebar */}
                        <div className="space-y-6">
                            {/* Registration Card */}
                            <Card className="border-primary/20 shadow-lg sticky top-4">
                                <CardContent className="p-6 space-y-6">
                                    <h3 className="text-xl font-bold">Inscrições</h3>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                            <div className="text-sm">
                                                <p className="font-medium">Coletivas</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Equipes e Times
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs text-muted-foreground block">
                                                    Até
                                                </span>
                                                <span className="font-bold text-sm">
                                                    {formatDate(data.inscricaoColetivaFim)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                            <div className="text-sm">
                                                <p className="font-medium">Individuais</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Atletas Avulsos
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs text-muted-foreground block">
                                                    Até
                                                </span>
                                                <span className="font-bold text-sm">
                                                    {formatDate(data.inscricaoIndividualFim)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button className="w-full h-12 text-lg font-bold" disabled>
                                        FAZER INSCRIÇÃO
                                    </Button>
                                    <div className="text-center space-y-1">
                                        <p className="text-xs text-muted-foreground">
                                            Botão desabilitado na pré-visualização
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Producer Info */}
                            <Card>
                                <CardContent className="p-6 space-y-4">
                                    <h3 className="font-bold flex items-center gap-2 text-lg">
                                        <User className="h-5 w-5 text-primary" />
                                        Organizador
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {data.nomeProdutor?.charAt(0) || 'P'}
                                        </div>
                                        <div>
                                            <p className="font-medium">{data.nomeProdutor}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Produtor Verificado
                                            </p>
                                        </div>
                                    </div>
                                    {data.descricaoProdutor && (
                                        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
                                            {data.descricaoProdutor}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Supporters */}
                            {(data.logosRealizadores?.length > 0 ||
                                data.logosApoiadores?.length > 0) && (
                                    <Card>
                                        <CardContent className="p-6 space-y-6">
                                            {data.logosRealizadores?.length > 0 && (
                                                <div className="space-y-3">
                                                    <p className="text-xs font-bold text-muted-foreground text-center uppercase tracking-widest">
                                                        Realização
                                                    </p>
                                                    <div className="flex flex-wrap justify-center gap-4">
                                                        {data.logosRealizadores.map(
                                                            (file: File | string, i: number) => (
                                                                <div
                                                                    key={`realizer-${i}`}
                                                                    className="h-14 w-14 p-1 border rounded bg-white flex items-center justify-center"
                                                                >
                                                                    <PreviewImage
                                                                        file={file}
                                                                        className="max-h-full max-w-full object-contain"
                                                                        alt="Realizador"
                                                                    />
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {data.logosRealizadores?.length > 0 &&
                                                data.logosApoiadores?.length > 0 && <Separator />}

                                            {data.logosApoiadores?.length > 0 && (
                                                <div className="space-y-3">
                                                    <p className="text-xs font-bold text-muted-foreground text-center uppercase tracking-widest">
                                                        Apoio
                                                    </p>
                                                    <div className="flex flex-wrap justify-center gap-3 grayscale opacity-80 hover:grayscale-0 transition-all">
                                                        {data.logosApoiadores.map((file: File | string, i: number) => (
                                                            <div
                                                                key={`supporter-${i}`}
                                                                className="h-10 w-10 p-1 border rounded bg-white flex items-center justify-center"
                                                            >
                                                                <PreviewImage
                                                                    file={file}
                                                                    className="max-h-full max-w-full object-contain"
                                                                    alt="Apoiador"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}
