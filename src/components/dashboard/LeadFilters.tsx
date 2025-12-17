import { LeadFilters as LeadFiltersType, Lead, ESTADO_LEAD_OPTIONS, URGENCIA_OPTIONS, SENTIMIENTO_OPTIONS, TIPO_CLIENTE_OPTIONS, QUE_QUIERES_HACER_OPTIONS, COMO_NOS_HAS_CONOCIDO_OPTIONS } from '@/types/lead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Search, X, Filter, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';

interface LeadFiltersProps {
  filters: LeadFiltersType;
  onFiltersChange: (filters: Partial<LeadFiltersType>) => void;
  onReset: () => void;
  allLeads: Lead[];
}

function MultiSelect({
  label,
  options,
  selected,
  onChange,
  availableOptions,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  availableOptions: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal h-auto min-h-[40px] py-2"
        >
          <div className="flex flex-wrap gap-1 items-center">
            {selected.length === 0 ? (
              <span className="text-muted-foreground">{label}</span>
            ) : (
              <>
                {selected.slice(0, 2).map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs">
                    {s}
                  </Badge>
                ))}
                {selected.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{selected.length - 2}
                  </Badge>
                )}
              </>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="space-y-1">
          {options.map((option) => {
            const isAvailable = availableOptions.includes(option);
            const isSelected = selected.includes(option);
            return (
              <button
                key={option}
                onClick={() => toggleOption(option)}
                disabled={!isAvailable && !isSelected}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : isAvailable
                    ? 'hover:bg-muted'
                    : 'text-muted-foreground/50 cursor-not-allowed'
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function LeadFiltersComponent({ filters, onFiltersChange, onReset, allLeads }: LeadFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Get available options from data
  const availableOptions = useMemo(() => ({
    estadoLead: [...new Set(allLeads.map((l) => l.EstadoLead))],
    urgenciaIA: [...new Set(allLeads.map((l) => l.UrgenciaIA))],
    sentimientoIA: [...new Set(allLeads.map((l) => l.SentimientoIA))],
    tipoClienteIA: [...new Set(allLeads.map((l) => l.TipoClienteIA))],
    queQuieresHacer: [...new Set(allLeads.map((l) => l.QueQuieresHacer))],
    tipoInmueble: [...new Set(allLeads.map((l) => l.TipoInmueble))],
    comoNosHasConocido: [...new Set(allLeads.map((l) => l.ComoNosHasConocido))],
  }), [allLeads]);

  const hasActiveFilters = 
    filters.estadoLead.length > 0 ||
    filters.urgenciaIA.length > 0 ||
    filters.sentimientoIA.length > 0 ||
    filters.tipoClienteIA.length > 0 ||
    filters.queQuieresHacer.length > 0 ||
    filters.tipoInmueble.length > 0 ||
    filters.comoNosHasConocido.length > 0 ||
    filters.dateRange.from ||
    filters.dateRange.to ||
    filters.searchText ||
    filters.leadScoreRange[0] > 0 ||
    filters.leadScoreRange[1] < 100;

  return (
    <div className="bg-card rounded-xl border border-border/50 shadow-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Filtros</h3>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs">Activos</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground">
              <RotateCcw className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Colapsar' : 'Expandir'}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Search and Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <Label className="text-xs text-muted-foreground mb-1.5 block">Búsqueda</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nombre, email, zona, mensaje..."
                  value={filters.searchText}
                  onChange={(e) => onFiltersChange({ searchText: e.target.value })}
                  className="pl-9"
                />
                {filters.searchText && (
                  <button
                    onClick={() => onFiltersChange({ searchText: '' })}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Fecha Desde</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !filters.dateRange.from && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.from ? (
                      format(filters.dateRange.from, 'dd/MM/yyyy', { locale: es })
                    ) : (
                      'Seleccionar'
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.from}
                    onSelect={(date) =>
                      onFiltersChange({ dateRange: { ...filters.dateRange, from: date } })
                    }
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Fecha Hasta</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !filters.dateRange.to && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.to ? (
                      format(filters.dateRange.to, 'dd/MM/yyyy', { locale: es })
                    ) : (
                      'Seleccionar'
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.to}
                    onSelect={(date) =>
                      onFiltersChange({ dateRange: { ...filters.dateRange, to: date } })
                    }
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Multi-selects Row 1 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Estado</Label>
              <MultiSelect
                label="Todos los estados"
                options={ESTADO_LEAD_OPTIONS}
                selected={filters.estadoLead}
                onChange={(values) => onFiltersChange({ estadoLead: values })}
                availableOptions={availableOptions.estadoLead}
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Urgencia</Label>
              <MultiSelect
                label="Todas las urgencias"
                options={URGENCIA_OPTIONS}
                selected={filters.urgenciaIA}
                onChange={(values) => onFiltersChange({ urgenciaIA: values })}
                availableOptions={availableOptions.urgenciaIA}
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Sentimiento</Label>
              <MultiSelect
                label="Todos los sentimientos"
                options={SENTIMIENTO_OPTIONS}
                selected={filters.sentimientoIA}
                onChange={(values) => onFiltersChange({ sentimientoIA: values })}
                availableOptions={availableOptions.sentimientoIA}
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Tipo Cliente</Label>
              <MultiSelect
                label="Todos los tipos"
                options={TIPO_CLIENTE_OPTIONS}
                selected={filters.tipoClienteIA}
                onChange={(values) => onFiltersChange({ tipoClienteIA: values })}
                availableOptions={availableOptions.tipoClienteIA}
              />
            </div>
          </div>

          {/* Multi-selects Row 2 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Intención</Label>
              <MultiSelect
                label="Todas las intenciones"
                options={QUE_QUIERES_HACER_OPTIONS}
                selected={filters.queQuieresHacer}
                onChange={(values) => onFiltersChange({ queQuieresHacer: values })}
                availableOptions={availableOptions.queQuieresHacer}
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Tipo Inmueble</Label>
              <MultiSelect
                label="Todos los inmuebles"
                options={[...new Set([...availableOptions.tipoInmueble])]}
                selected={filters.tipoInmueble}
                onChange={(values) => onFiltersChange({ tipoInmueble: values })}
                availableOptions={availableOptions.tipoInmueble}
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Canal</Label>
              <MultiSelect
                label="Todos los canales"
                options={COMO_NOS_HAS_CONOCIDO_OPTIONS}
                selected={filters.comoNosHasConocido}
                onChange={(values) => onFiltersChange({ comoNosHasConocido: values })}
                availableOptions={availableOptions.comoNosHasConocido}
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Lead Score: {filters.leadScoreRange[0]} - {filters.leadScoreRange[1]}
              </Label>
              <div className="pt-2 px-1">
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={filters.leadScoreRange}
                  onValueChange={(value) =>
                    onFiltersChange({ leadScoreRange: value as [number, number] })
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
