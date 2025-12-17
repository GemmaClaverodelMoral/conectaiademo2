import { useState, useCallback, useMemo } from 'react';
import { Lead, LeadFilters } from '@/types/lead';
import { parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

const initialFilters: LeadFilters = {
  dateRange: { from: undefined, to: undefined },
  estadoLead: [],
  urgenciaIA: [],
  sentimientoIA: [],
  tipoClienteIA: [],
  queQuieresHacer: [],
  tipoInmueble: [],
  comoNosHasConocido: [],
  leadScoreRange: [0, 100],
  searchText: '',
};

export function useLeads() {
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [filters, setFilters] = useState<LeadFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead) => {
      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        try {
          const leadDate = parseISO(lead.FechaHora);
          const from = filters.dateRange.from ? startOfDay(filters.dateRange.from) : new Date(0);
          const to = filters.dateRange.to ? endOfDay(filters.dateRange.to) : new Date();
          if (!isWithinInterval(leadDate, { start: from, end: to })) {
            return false;
          }
        } catch {
          // If date parsing fails, include the lead
        }
      }

      // Estado Lead filter
      if (filters.estadoLead.length > 0 && !filters.estadoLead.includes(lead.EstadoLead)) {
        return false;
      }

      // Urgencia filter
      if (filters.urgenciaIA.length > 0 && !filters.urgenciaIA.includes(lead.UrgenciaIA)) {
        return false;
      }

      // Sentimiento filter
      if (filters.sentimientoIA.length > 0 && !filters.sentimientoIA.includes(lead.SentimientoIA)) {
        return false;
      }

      // Tipo Cliente filter
      if (filters.tipoClienteIA.length > 0 && !filters.tipoClienteIA.includes(lead.TipoClienteIA)) {
        return false;
      }

      // Que Quieres Hacer filter
      if (filters.queQuieresHacer.length > 0 && !filters.queQuieresHacer.includes(lead.QueQuieresHacer)) {
        return false;
      }

      // Tipo Inmueble filter
      if (filters.tipoInmueble.length > 0 && !filters.tipoInmueble.includes(lead.TipoInmueble)) {
        return false;
      }

      // Como Nos Has Conocido filter
      if (filters.comoNosHasConocido.length > 0 && !filters.comoNosHasConocido.includes(lead.ComoNosHasConocido)) {
        return false;
      }

      // Lead Score filter
      if (lead.LeadScoreIA < filters.leadScoreRange[0] || lead.LeadScoreIA > filters.leadScoreRange[1]) {
        return false;
      }

      // Search text filter
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        const searchableFields = [
          lead.Nombre,
          lead.Email,
          lead.ZonaBarrio,
          lead.Mensaje,
        ].map((f) => (f || '').toLowerCase());
        
        if (!searchableFields.some((field) => field.includes(searchLower))) {
          return false;
        }
      }

      return true;
    });
  }, [allLeads, filters]);

  const updateFilters = useCallback((newFilters: Partial<LeadFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const loadLeads = useCallback((leads: Lead[]) => {
    setAllLeads(leads);
    setLastUpdated(new Date());
    setError(null);
  }, []);

  const setLoadingState = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const setErrorState = useCallback((err: string | null) => {
    setError(err);
  }, []);

  return {
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
  };
}
