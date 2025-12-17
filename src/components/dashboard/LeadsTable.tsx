import { Lead } from '@/types/lead';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, Eye } from 'lucide-react';
import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface LeadsTableProps {
  leads: Lead[];
}

type SortField = 'FechaHora' | 'LeadScoreIA' | 'EstadoLead' | 'Nombre';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 15;

const ESTADO_BADGE_VARIANTS: Record<string, string> = {
  'Nuevo': 'bg-info/10 text-info border-info/20',
  'Contactado': 'bg-primary/10 text-primary border-primary/20',
  'En seguimiento': 'bg-warning/10 text-warning border-warning/20',
  'En negociación': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
  'Cerrado ganado': 'bg-success/10 text-success border-success/20',
  'Cerrado perdido': 'bg-destructive/10 text-destructive border-destructive/20',
};

const URGENCIA_BADGE_VARIANTS: Record<string, string> = {
  'Alta': 'bg-destructive/10 text-destructive border-destructive/20',
  'Media': 'bg-warning/10 text-warning border-warning/20',
  'Baja': 'bg-success/10 text-success border-success/20',
};

const SENTIMIENTO_BADGE_VARIANTS: Record<string, string> = {
  'Muy interesado': 'bg-success/10 text-success border-success/20',
  'Interesado': 'bg-info/10 text-info border-info/20',
  'Solo curioseando': 'bg-warning/10 text-warning border-warning/20',
  'Molesto': 'bg-destructive/10 text-destructive border-destructive/20',
  'Escéptico': 'bg-muted text-muted-foreground border-border',
};

export function LeadsTable({ leads }: LeadsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('FechaHora');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const sortedLeads = useMemo(() => {
    return [...leads].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'FechaHora':
          comparison = new Date(a.FechaHora).getTime() - new Date(b.FechaHora).getTime();
          break;
        case 'LeadScoreIA':
          comparison = a.LeadScoreIA - b.LeadScoreIA;
          break;
        case 'EstadoLead':
          comparison = a.EstadoLeadNumero - b.EstadoLeadNumero;
          break;
        case 'Nombre':
          comparison = a.Nombre.localeCompare(b.Nombre);
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [leads, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedLeads.length / ITEMS_PER_PAGE);
  const paginatedLeads = sortedLeads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'dd/MM/yyyy HH:mm', { locale: es });
    } catch {
      return dateStr;
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-primary transition-colors"
    >
      {children}
      <ArrowUpDown className={cn(
        'h-3 w-3',
        sortField === field && 'text-primary'
      )} />
    </button>
  );

  if (leads.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8 bg-card rounded-xl border border-border/50">
        No hay leads para mostrar con los filtros actuales
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border/50 shadow-card">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">
            Listado de Leads ({leads.length})
          </h3>
          <div className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages || 1}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[140px]">
                <SortButton field="FechaHora">Fecha</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="Nombre">Nombre</SortButton>
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Intención</TableHead>
              <TableHead>Inmueble</TableHead>
              <TableHead>Zona</TableHead>
              <TableHead className="text-center">
                <SortButton field="LeadScoreIA">Score</SortButton>
              </TableHead>
              <TableHead>Urgencia</TableHead>
              <TableHead>Sentimiento</TableHead>
              <TableHead>
                <SortButton field="EstadoLead">Estado</SortButton>
              </TableHead>
              <TableHead className="w-[80px]">Ver</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLeads.map((lead, index) => (
              <TableRow 
                key={`${lead.Email}-${index}`}
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => setSelectedLead(lead)}
              >
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(lead.FechaHora)}
                </TableCell>
                <TableCell className="font-medium">{lead.Nombre}</TableCell>
                <TableCell className="text-sm">{lead.Email}</TableCell>
                <TableCell className="text-sm">{lead.Telefono}</TableCell>
                <TableCell className="text-sm">{lead.QueQuieresHacer}</TableCell>
                <TableCell className="text-sm">{lead.TipoInmueble}</TableCell>
                <TableCell className="text-sm">{lead.ZonaBarrio}</TableCell>
                <TableCell className="text-center">
                  <span className={cn(
                    'font-bold',
                    lead.LeadScoreIA >= 70 ? 'text-success' :
                    lead.LeadScoreIA >= 40 ? 'text-warning' :
                    'text-destructive'
                  )}>
                    {lead.LeadScoreIA}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn('text-xs', URGENCIA_BADGE_VARIANTS[lead.UrgenciaIA])}>
                    {lead.UrgenciaIA}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn('text-xs', SENTIMIENTO_BADGE_VARIANTS[lead.SentimientoIA])}>
                    {lead.SentimientoIA}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn('text-xs', ESTADO_BADGE_VARIANTS[lead.EstadoLead])}>
                    {lead.EstadoLead}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLead(lead);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-border/50 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, leads.length)} de {leads.length}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-3 text-sm">
            {currentPage} / {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Lead Detail Modal */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span>{selectedLead?.Nombre}</span>
              {selectedLead && (
                <Badge variant="outline" className={cn('text-xs', ESTADO_BADGE_VARIANTS[selectedLead.EstadoLead])}>
                  {selectedLead.EstadoLead}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Email</label>
                  <p className="font-medium">{selectedLead.Email}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Teléfono</label>
                  <p className="font-medium">{selectedLead.Telefono}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Fecha</label>
                  <p className="font-medium">{formatDate(selectedLead.FechaHora)}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Canal</label>
                  <p className="font-medium">{selectedLead.ComoNosHasConocido}</p>
                </div>
              </div>

              {/* Property Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Intención</label>
                  <p className="font-medium">{selectedLead.QueQuieresHacer}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Tipo Inmueble</label>
                  <p className="font-medium">{selectedLead.TipoInmueble}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Zona</label>
                  <p className="font-medium">{selectedLead.ZonaBarrio}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Presupuesto</label>
                  <p className="font-medium">{selectedLead.Presupuesto}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Plazo</label>
                  <p className="font-medium">{selectedLead.Plazo}</p>
                </div>
              </div>

              {/* AI Analysis */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h4 className="font-semibold text-sm">Análisis IA</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground">Score</label>
                    <p className={cn(
                      'text-2xl font-bold',
                      selectedLead.LeadScoreIA >= 70 ? 'text-success' :
                      selectedLead.LeadScoreIA >= 40 ? 'text-warning' :
                      'text-destructive'
                    )}>
                      {selectedLead.LeadScoreIA}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Urgencia</label>
                    <Badge variant="outline" className={cn('mt-1', URGENCIA_BADGE_VARIANTS[selectedLead.UrgenciaIA])}>
                      {selectedLead.UrgenciaIA}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Sentimiento</label>
                    <Badge variant="outline" className={cn('mt-1', SENTIMIENTO_BADGE_VARIANTS[selectedLead.SentimientoIA])}>
                      {selectedLead.SentimientoIA}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Tipo Cliente</label>
                    <p className="font-medium capitalize">{selectedLead.TipoClienteIA}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-muted-foreground">Resumen IA</label>
                  <p className="mt-1 text-sm bg-muted/50 p-3 rounded-lg">{selectedLead.ResumenIA}</p>
                </div>
              </div>

              {/* Original Message */}
              <div className="space-y-2 pt-4 border-t border-border">
                <label className="text-xs text-muted-foreground">Mensaje Original</label>
                <p className="text-sm bg-muted/50 p-3 rounded-lg whitespace-pre-wrap">{selectedLead.Mensaje}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
