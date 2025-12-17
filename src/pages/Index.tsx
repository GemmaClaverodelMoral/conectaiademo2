import { useEffect, useCallback, useState } from 'react';
import { useLeads } from '@/hooks/useLeads';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { KPICards } from '@/components/dashboard/KPICards';
import { LeadFiltersComponent } from '@/components/dashboard/LeadFilters';
import { LeadCharts } from '@/components/dashboard/LeadCharts';
import { LeadsTable } from '@/components/dashboard/LeadsTable';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

const N8N_WORKFLOW_ID = '9Ly68s9ccEP8Mqea';

export default function Index() {
  const {
    allLeads,
    filteredLeads,
    filters,
    isLoading,
    error,
    lastUpdated,
    loadLeads,
    updateFilters,
    resetFilters,
    setLoadingState,
    setErrorState,
  } = useLeads();

  const [mcpError, setMcpError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoadingState(true);
    setErrorState(null);
    setMcpError(null);

    try {
      // This will be called via MCP from the parent window
      const response = await new Promise<{ leads: any[] }>((resolve, reject) => {
        // Create a custom event to request MCP execution
        const requestId = `mcp-request-${Date.now()}`;
        
        const handleResponse = (event: MessageEvent) => {
          if (event.data?.type === 'mcp-response' && event.data?.requestId === requestId) {
            window.removeEventListener('message', handleResponse);
            if (event.data.error) {
              reject(new Error(event.data.error));
            } else {
              resolve(event.data.result);
            }
          }
        };

        window.addEventListener('message', handleResponse);

        // For now, we'll simulate the data since MCP calls happen at build time
        // In production, this would be replaced with actual MCP integration
        setTimeout(() => {
          window.removeEventListener('message', handleResponse);
          // Simulate some demo data
          const demoLeads = generateDemoLeads();
          resolve({ leads: demoLeads });
        }, 1000);
      });

      if (response && response.leads) {
        loadLeads(response.leads);
      } else {
        throw new Error('No se recibieron datos de leads');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar los leads';
      setErrorState(errorMessage);
      setMcpError(errorMessage);
    } finally {
      setLoadingState(false);
    }
  }, [loadLeads, setLoadingState, setErrorState]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  if (mcpError && allLeads.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No se han podido cargar los datos</h2>
          <p className="text-muted-foreground mb-6">
            {mcpError}
          </p>
          <Button onClick={fetchLeads} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        lastUpdated={lastUpdated}
        isLoading={isLoading}
        onRefresh={fetchLeads}
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Filters */}
        <LeadFiltersComponent
          filters={filters}
          onFiltersChange={updateFilters}
          onReset={resetFilters}
          allLeads={allLeads}
        />

        {/* KPI Cards */}
        <KPICards leads={filteredLeads} />

        {/* Charts */}
        <LeadCharts leads={filteredLeads} />

        {/* Table */}
        <LeadsTable leads={filteredLeads} />
      </main>
    </div>
  );
}

// Demo data generator for testing
function generateDemoLeads() {
  const nombres = ['Ana García', 'Carlos López', 'María Rodríguez', 'Juan Martínez', 'Laura Sánchez', 'Pedro Fernández', 'Carmen Díaz', 'Miguel Torres', 'Isabel Ruiz', 'Francisco Moreno', 'Elena Castro', 'David Ortiz', 'Lucía Jiménez', 'Antonio Vargas', 'Paula Romero'];
  const intenciones = ['Comprar vivienda', 'Alquilar vivienda', 'Invertir en inmuebles', 'Otro'];
  const inmuebles = ['Piso', 'Casa', 'Chalet', 'Apartamento', 'Estudio', 'Local comercial'];
  const zonas = ['Centro Madrid', 'Malasaña', 'Chamberí', 'Salamanca', 'Retiro', 'Arganzuela', 'Lavapiés', 'La Latina'];
  const presupuestos = ['200.000 €', '300.000 €', '350.000 €', '400.000 €', '500.000 €', '600.000 €', 'hasta 450.000 €'];
  const plazos = ['Lo antes posible (0–3 meses)', 'En 3–6 meses', 'Más de 6 meses', 'Solo estoy mirando opciones'];
  const canales = ['Google', 'Redes sociales', 'Portal inmobiliario', 'Recomendación', 'Otro'];
  const tiposCliente = ['familia', 'inversor', 'joven profesional', 'empresa', 'estudiante', 'jubilado', 'pareja', 'otro'];
  const urgencias = ['Alta', 'Media', 'Baja'];
  const sentimientos = ['Muy interesado', 'Interesado', 'Solo curioseando', 'Molesto', 'Escéptico'];
  const estados = ['Nuevo', 'Contactado', 'En seguimiento', 'En negociación', 'Cerrado ganado', 'Cerrado perdido'];

  const leads = [];
  
  for (let i = 0; i < 45; i++) {
    const nombre = nombres[Math.floor(Math.random() * nombres.length)];
    const email = nombre.toLowerCase().replace(' ', '.') + '@example.com';
    const estadoIndex = Math.floor(Math.random() * estados.length);
    
    // Generate a date within the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    leads.push({
      Nombre: nombre,
      Email: email,
      Telefono: `+34 6${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      QueQuieresHacer: intenciones[Math.floor(Math.random() * intenciones.length)],
      TipoInmueble: inmuebles[Math.floor(Math.random() * inmuebles.length)],
      ZonaBarrio: zonas[Math.floor(Math.random() * zonas.length)],
      Presupuesto: presupuestos[Math.floor(Math.random() * presupuestos.length)],
      Plazo: plazos[Math.floor(Math.random() * plazos.length)],
      ComoNosHasConocido: canales[Math.floor(Math.random() * canales.length)],
      Mensaje: `Estoy buscando un inmueble en la zona indicada. Mi presupuesto es flexible y necesito orientación sobre las mejores opciones disponibles.`,
      ResumenIA: `Cliente busca ${inmuebles[Math.floor(Math.random() * inmuebles.length)].toLowerCase()} en ${zonas[Math.floor(Math.random() * zonas.length)]}, presupuesto aproximado ${presupuestos[Math.floor(Math.random() * presupuestos.length)]}.`,
      TipoClienteIA: tiposCliente[Math.floor(Math.random() * tiposCliente.length)],
      LeadScoreIA: Math.floor(Math.random() * 100),
      UrgenciaIA: urgencias[Math.floor(Math.random() * urgencias.length)],
      SentimientoIA: sentimientos[Math.floor(Math.random() * sentimientos.length)],
      FechaHora: date.toISOString(),
      EstadoLeadNumero: estadoIndex,
      EstadoLead: estados[estadoIndex],
    });
  }

  return leads;
}
