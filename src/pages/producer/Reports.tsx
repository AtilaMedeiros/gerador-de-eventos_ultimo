import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Relatórios</h2>
        <p className="text-muted-foreground">
          Análise de dados dos seus eventos.
        </p>
      </div>

      <Card className="min-h-[400px] flex items-center justify-center text-center p-6">
        <CardContent>
          <div className="bg-muted rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
          <CardTitle className="mb-2">
            Bem-vindo à seção de Relatórios
          </CardTitle>
          <p className="text-muted-foreground max-w-md mx-auto">
            Aqui você poderá consultar e analisar os dados detalhados dos seus
            eventos, como inscrições, pagamentos e estatísticas de participação.
          </p>
          <p className="text-sm text-muted-foreground mt-4 italic">
            (Funcionalidade em desenvolvimento)
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
