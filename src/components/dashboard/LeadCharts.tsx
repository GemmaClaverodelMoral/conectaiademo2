import { Lead, ESTADO_LEAD_OPTIONS } from '@/types/lead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  LabelList,
} from 'recharts';
import { useMemo } from 'react';

interface LeadChartsProps {
  leads: Lead[];
}

const COLORS = {
  primary: 'hsl(217, 91%, 60%)',
  success: 'hsl(142, 76%, 36%)',
  warning: 'hsl(38, 92%, 50%)',
  destructive: 'hsl(0, 84%, 60%)',
  info: 'hsl(199, 89%, 48%)',
  muted: 'hsl(215, 16%, 47%)',
};

const ESTADO_COLORS: Record<string, string> = {
  'Nuevo': COLORS.info,
  'Contactado': COLORS.primary,
  'En seguimiento': COLORS.warning,
  'En negociación': '#8b5cf6',
  'Cerrado ganado': COLORS.success,
  'Cerrado perdido': COLORS.destructive,
};

const URGENCIA_COLORS: Record<string, string> = {
  'Alta': COLORS.destructive,
  'Media': COLORS.warning,
  'Baja': COLORS.success,
};

const SENTIMIENTO_COLORS: Record<string, string> = {
  'Muy interesado': COLORS.success,
  'Interesado': COLORS.info,
  'Solo curioseando': COLORS.warning,
  'Molesto': COLORS.destructive,
  'Escéptico': COLORS.muted,
};

export function LeadCharts({ leads }: LeadChartsProps) {
  // Funnel by Estado
  const funnelData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => {
      counts[l.EstadoLead] = (counts[l.EstadoLead] || 0) + 1;
    });
    
    return ESTADO_LEAD_OPTIONS.map((estado) => ({
      name: estado,
      value: counts[estado] || 0,
      fill: ESTADO_COLORS[estado],
    }));
  }, [leads]);

  // Bar chart by Urgencia
  const urgenciaData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => {
      counts[l.UrgenciaIA] = (counts[l.UrgenciaIA] || 0) + 1;
    });
    
    return ['Alta', 'Media', 'Baja'].map((urgencia) => ({
      name: urgencia,
      value: counts[urgencia] || 0,
      fill: URGENCIA_COLORS[urgencia],
    }));
  }, [leads]);

  // Pie chart by Sentimiento
  const sentimientoData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => {
      counts[l.SentimientoIA] = (counts[l.SentimientoIA] || 0) + 1;
    });
    
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      fill: SENTIMIENTO_COLORS[name] || COLORS.muted,
    }));
  }, [leads]);

  // Bar chart by Tipo Cliente
  const tipoClienteData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => {
      counts[l.TipoClienteIA] = (counts[l.TipoClienteIA] || 0) + 1;
    });
    
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({
        name,
        value,
      }));
  }, [leads]);

  // Score distribution
  const scoreDistribution = useMemo(() => {
    const ranges = [
      { name: '0-20', min: 0, max: 20 },
      { name: '21-40', min: 21, max: 40 },
      { name: '41-60', min: 41, max: 60 },
      { name: '61-80', min: 61, max: 80 },
      { name: '81-100', min: 81, max: 100 },
    ];
    
    return ranges.map((range) => ({
      name: range.name,
      value: leads.filter((l) => l.LeadScoreIA >= range.min && l.LeadScoreIA <= range.max).length,
    }));
  }, [leads]);

  // Channel data
  const channelData = useMemo(() => {
    const counts: Record<string, { count: number; totalScore: number }> = {};
    leads.forEach((l) => {
      if (!counts[l.ComoNosHasConocido]) {
        counts[l.ComoNosHasConocido] = { count: 0, totalScore: 0 };
      }
      counts[l.ComoNosHasConocido].count++;
      counts[l.ComoNosHasConocido].totalScore += l.LeadScoreIA;
    });
    
    return Object.entries(counts)
      .map(([name, data]) => ({
        name,
        leads: data.count,
        avgScore: Math.round(data.totalScore / data.count),
      }))
      .sort((a, b) => b.leads - a.leads);
  }, [leads]);

  if (leads.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No hay datos para mostrar gráficas
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Funnel by Estado */}
      <Card className="border-border/50 shadow-card lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Funnel por Estado</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={funnelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Urgencia Chart */}
      <Card className="border-border/50 shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Por Urgencia</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={urgenciaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {urgenciaData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sentimiento Pie Chart */}
      <Card className="border-border/50 shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Sentimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={sentimientoData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {sentimientoData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {sentimientoData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1 text-xs">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.fill }}
                />
                <span className="text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tipo Cliente */}
      <Card className="border-border/50 shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Tipo de Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={tipoClienteData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Score Distribution */}
      <Card className="border-border/50 shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Distribución Score</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" fill={COLORS.info} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Channel Chart */}
      <Card className="border-border/50 shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Por Canal</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={channelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="leads" fill={COLORS.primary} name="Leads" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
