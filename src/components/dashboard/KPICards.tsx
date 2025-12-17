import { Lead } from '@/types/lead';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  UserPlus, 
  AlertTriangle, 
  Heart, 
  Trophy, 
  XCircle, 
  TrendingUp,
  Clock
} from 'lucide-react';
import { differenceInHours, parseISO } from 'date-fns';

interface KPICardsProps {
  leads: Lead[];
}

export function KPICards({ leads }: KPICardsProps) {
  const totalLeads = leads.length;
  
  const newLeads = leads.filter((l) => l.EstadoLead === 'Nuevo').length;
  const urgentLeads = leads.filter((l) => l.UrgenciaIA === 'Alta').length;
  const veryInterestedLeads = leads.filter((l) => l.SentimientoIA === 'Muy interesado').length;
  const closedWon = leads.filter((l) => l.EstadoLead === 'Cerrado ganado').length;
  const closedLost = leads.filter((l) => l.EstadoLead === 'Cerrado perdido').length;
  
  const avgScore = leads.length > 0 
    ? Math.round(leads.reduce((acc, l) => acc + l.LeadScoreIA, 0) / leads.length) 
    : 0;

  // Calculate average age of "Nuevo" leads
  const newLeadsData = leads.filter((l) => l.EstadoLead === 'Nuevo');
  const avgAgeHours = newLeadsData.length > 0
    ? Math.round(
        newLeadsData.reduce((acc, l) => {
          try {
            const leadDate = parseISO(l.FechaHora);
            return acc + differenceInHours(new Date(), leadDate);
          } catch {
            return acc;
          }
        }, 0) / newLeadsData.length
      )
    : 0;

  const kpis = [
    {
      title: 'Total Leads',
      value: totalLeads,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Leads Nuevos',
      value: newLeads,
      icon: UserPlus,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      title: 'Urgentes',
      value: urgentLeads,
      icon: AlertTriangle,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Muy Interesados',
      value: veryInterestedLeads,
      icon: Heart,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Cerrado Ganado',
      value: closedWon,
      icon: Trophy,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Cerrado Perdido',
      value: closedLost,
      icon: XCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      title: 'Score Medio',
      value: avgScore,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Antigüedad Media (h)',
      value: avgAgeHours,
      icon: Clock,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      subtitle: 'Leads nuevos',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="border-border/50 shadow-card hover:shadow-card-hover transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-xs text-muted-foreground truncate">{kpi.title}</p>
                {kpi.subtitle && (
                  <p className="text-[10px] text-muted-foreground/70">{kpi.subtitle}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
