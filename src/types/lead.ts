export interface Lead {
  Nombre: string;
  Email: string;
  Telefono: string;
  QueQuieresHacer: string;
  TipoInmueble: string;
  ZonaBarrio: string;
  Presupuesto: string;
  Plazo: string;
  ComoNosHasConocido: string;
  Mensaje: string;
  ResumenIA: string;
  TipoClienteIA: string;
  LeadScoreIA: number;
  UrgenciaIA: string;
  SentimientoIA: string;
  FechaHora: string;
  EstadoLeadNumero: number;
  EstadoLead: string;
}

export interface LeadsResponse {
  leads: Lead[];
}

export interface LeadFilters {
  dateRange: { from: Date | undefined; to: Date | undefined };
  estadoLead: string[];
  urgenciaIA: string[];
  sentimientoIA: string[];
  tipoClienteIA: string[];
  queQuieresHacer: string[];
  tipoInmueble: string[];
  comoNosHasConocido: string[];
  leadScoreRange: [number, number];
  searchText: string;
}

export const ESTADO_LEAD_OPTIONS = [
  'Nuevo',
  'Contactado',
  'En seguimiento',
  'En negociación',
  'Cerrado ganado',
  'Cerrado perdido',
];

export const URGENCIA_OPTIONS = ['Alta', 'Media', 'Baja'];

export const SENTIMIENTO_OPTIONS = [
  'Muy interesado',
  'Interesado',
  'Solo curioseando',
  'Molesto',
  'Escéptico',
];

export const TIPO_CLIENTE_OPTIONS = [
  'familia',
  'inversor',
  'joven profesional',
  'empresa',
  'estudiante',
  'jubilado',
  'pareja',
  'otro',
];

export const QUE_QUIERES_HACER_OPTIONS = [
  'Comprar vivienda',
  'Alquilar vivienda',
  'Invertir en inmuebles',
  'Otro',
];

export const COMO_NOS_HAS_CONOCIDO_OPTIONS = [
  'Google',
  'Redes sociales',
  'Portal inmobiliario',
  'Recomendación',
  'Otro',
];
