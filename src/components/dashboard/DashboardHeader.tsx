import { Button } from '@/components/ui/button';
import { RefreshCw, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DashboardHeaderProps {
  lastUpdated: Date | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export function DashboardHeader({ lastUpdated, isLoading, onRefresh }: DashboardHeaderProps) {
  return (
    <header className="bg-card border-b border-border/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              ConectaIA
              <span className="text-primary ml-2">DEMO Inmobiliaria - Dashboard de Leads</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Vista general de leads, estados, urgencia y nivel de interés.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  Última actualización: {format(lastUpdated, 'HH:mm:ss', { locale: es })}
                </span>
              </div>
            )}
            
            <Button
              onClick={onRefresh}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Cargando...' : 'Refrescar datos'}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
