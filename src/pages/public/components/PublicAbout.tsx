import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Heart, Users } from 'lucide-react'

export function PublicAbout() {
  const features = [
    {
      icon: Users,
      title: 'Inclusão',
      desc: 'Promovendo a participação ativa de estudantes de todas as redes de ensino.',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      icon: Trophy,
      title: 'Talento',
      desc: 'Um palco profissional para descobrir as futuras estrelas do esporte nacional.',
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      icon: Heart,
      title: 'Cidadania',
      desc: 'Formação integral através dos valores éticos e morais do esporte.',
      color: 'text-red-500',
      bg: 'bg-red-50',
      border: 'border-red-100',
    },
  ]

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 relative inline-block">
            Sobre os Jogos
            <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/10 -z-10 transform skew-x-12" />
          </h2>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
            Nossa missão é promover a integração social, o exercício da
            cidadania e a descoberta de novos talentos através do desporto
            escolar de alto nível.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <Card
              key={i}
              className={`border ${feature.border} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full bg-white`}
            >
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <div
                  className={`p-4 rounded-2xl ${feature.bg} ${feature.color} mb-6 transform transition-transform group-hover:scale-110`}
                >
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
