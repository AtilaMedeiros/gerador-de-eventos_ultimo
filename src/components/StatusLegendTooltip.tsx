import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipPortal,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function StatusLegendTooltip({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div className="cursor-help hover:opacity-80 transition-opacity">{children}</div>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            side="top"
            sideOffset={10}
            className="p-0 border shadow-2xl bg-white dark:bg-zinc-950 rounded-xl overflow-hidden z-[9999]"
          >
            <div className="flex flex-row w-[380px] text-[10px]">
              {/* Admin Section */}
              <div className="flex-1 bg-slate-50 dark:bg-zinc-900 p-4 border-r border-border/40">
                <h4 className="font-bold text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-4">
                  Negócio (manual)
                </h4>
                <div className="space-y-3">
                  <StatusItem
                    label="Rascunho"
                    color="text-orange-500 dark:text-orange-400"
                    desc="Em criação, invisível."
                  />
                  <StatusItem
                    label="Publicado"
                    color="text-blue-600 dark:text-blue-500"
                    desc="Visível e acessível."
                  />
                  <StatusItem
                    label="Reaberto"
                    color="text-emerald-500 dark:text-emerald-400"
                    desc="Ajustes temporários."
                  />

                  <StatusItem
                    label="Desativado"
                    color="text-red-500 dark:text-red-400"
                    desc="Invalidado, sem uso."
                  />
                </div>
              </div>

              {/* Time Section */}
              <div className="flex-1 p-4 bg-white dark:bg-zinc-950">
                <h4 className="font-bold text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-4">
                  Data (automático)
                </h4>
                <div className="space-y-3">
                  <StatusItem
                    label="Agendado"
                    color="text-orange-500 dark:text-orange-400"
                    desc="Futuro, não iniciado."
                  />
                  <StatusItem
                    label="Em Andamento"
                    color="text-blue-600 dark:text-blue-500"
                    desc="Acontece no momento."
                  />
                  <StatusItem
                    label="Encerrado"
                    color="text-red-500 dark:text-red-400"
                    desc="Ciclo finalizado."
                  />
                </div>
              </div>
            </div>
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  )
}

function StatusItem({ label, color, desc }: { label: string, color: string, desc: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5">
        <span className={cn("w-1.5 h-1.5 rounded-full bg-current opacity-80", color)} />
        <span className={cn("font-bold uppercase tracking-wide", color)}>
          {label}
        </span>
      </div>
      <p className="text-muted-foreground leading-tight pl-3 font-medium opacity-80">
        {desc}
      </p>
    </div>
  )
}
