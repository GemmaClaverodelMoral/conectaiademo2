import { useEffect, useCallback } from 'react';
import { useLeads } from '@/hooks/useLeads';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { KPICards } from '@/components/dashboard/KPICards';
import { LeadFiltersComponent } from '@/components/dashboard/LeadFilters';
import { LeadCharts } from '@/components/dashboard/LeadCharts';
import { LeadsTable } from '@/components/dashboard/LeadsTable';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Building2 } from 'lucide-react';
import { Lead } from '@/types/lead';

// Real leads data from n8n workflow "DEMO Inmobiliaria - Consultar Leads"
const INITIAL_LEADS: Lead[] = [
  {"Nombre":"Carlos Pérez","Email":"carlos.perez@gmail.com","Telefono":"698589318","QueQuieresHacer":"Invertir en inmuebles","TipoInmueble":"Piso","ZonaBarrio":"Centro Madrid","Presupuesto":"250.000 €","Plazo":"Lo antes posible (0–3 meses)","ComoNosHasConocido":"Otro","Mensaje":"Busco piso en Centro Madrid con presupuesto aproximado de 250.000 €. Necesito mudarme pronto.","ResumenIA":"Quiere invertir piso en Centro Madrid - presupuesto 250.000 €.","TipoClienteIA":"Empresa","LeadScoreIA":72,"UrgenciaIA":"Media","SentimientoIA":"Muy interesado","FechaHora":"2025-01-03T09:00:00.000Z","EstadoLeadNumero":4,"EstadoLead":"Cerrado ganado"},
  {"Nombre":"María López","Email":"maria.lopez@gmail.com","Telefono":"631413936","QueQuieresHacer":"Otro","TipoInmueble":"Casa","ZonaBarrio":"Salamanca","Presupuesto":"450.000 €","Plazo":"Más de 6 meses","ComoNosHasConocido":"Recomendación","Mensaje":"Busco casa en Salamanca con presupuesto aproximado de 450.000 €. Estoy valorando opciones con calma.","ResumenIA":"Quiere otro casa en Salamanca - presupuesto 450.000 €.","TipoClienteIA":"Familia","LeadScoreIA":48,"UrgenciaIA":"Media","SentimientoIA":"Escéptico","FechaHora":"2025-01-03T12:00:00.000Z","EstadoLeadNumero":0,"EstadoLead":"Nuevo"},
  {"Nombre":"Javier García","Email":"javier.garcia@gmail.com","Telefono":"622926603","QueQuieresHacer":"Otro","TipoInmueble":"Local comercial","ZonaBarrio":"Sevilla Triana","Presupuesto":"400.000 €","Plazo":"Lo antes posible (0–3 meses)","ComoNosHasConocido":"Otro","Mensaje":"Busco local comercial en Sevilla Triana con presupuesto aproximado de 400.000 €. Necesito mudarme pronto.","ResumenIA":"Quiere otro local comercial en Sevilla Triana - presupuesto 400.000 €.","TipoClienteIA":"Familia","LeadScoreIA":48,"UrgenciaIA":"Alta","SentimientoIA":"Solo curioseando","FechaHora":"2025-01-03T15:00:00.000Z","EstadoLeadNumero":0,"EstadoLead":"Nuevo"},
  {"Nombre":"Lucía Fernández","Email":"lucia.fernandez@gmail.com","Telefono":"697054775","QueQuieresHacer":"Otro","TipoInmueble":"Estudio","ZonaBarrio":"Arganzuela","Presupuesto":"350.000 €","Plazo":"Solo estoy mirando opciones","ComoNosHasConocido":"Redes sociales","Mensaje":"Busco estudio en Arganzuela con presupuesto aproximado de 350.000 €. Estoy valorando opciones con calma.","ResumenIA":"Quiere otro estudio en Arganzuela - presupuesto 350.000 €.","TipoClienteIA":"Estudiante","LeadScoreIA":46,"UrgenciaIA":"Baja","SentimientoIA":"Molesto","FechaHora":"2025-01-03T18:00:00.000Z","EstadoLeadNumero":3,"EstadoLead":"En negociación"},
  {"Nombre":"Sergio Martín","Email":"sergio.martin@gmail.com","Telefono":"661626917","QueQuieresHacer":"Alquilar vivienda","TipoInmueble":"Chalet","ZonaBarrio":"Leganés","Presupuesto":"750 € / mes","Plazo":"Más de 6 meses","ComoNosHasConocido":"Google","Mensaje":"Busco chalet en Leganés con presupuesto aproximado de 750 € / mes. Estoy valorando opciones con calma.","ResumenIA":"Quiere alquilar chalet en Leganés - presupuesto 750 € / mes.","TipoClienteIA":"Inversor","LeadScoreIA":67,"UrgenciaIA":"Baja","SentimientoIA":"Escéptico","FechaHora":"2025-01-03T21:00:00.000Z","EstadoLeadNumero":2,"EstadoLead":"En seguimiento"},
  {"Nombre":"Ana Rodríguez","Email":"ana.rodriguez@gmail.com","Telefono":"684731200","QueQuieresHacer":"Invertir en inmuebles","TipoInmueble":"Piso","ZonaBarrio":"Barcelona Eixample","Presupuesto":"600.000 €","Plazo":"En 3–6 meses","ComoNosHasConocido":"Portal inmobiliario","Mensaje":"Busco piso en Barcelona Eixample con presupuesto aproximado de 600.000 €. Estoy valorando opciones con calma.","ResumenIA":"Quiere invertir piso en Barcelona Eixample - presupuesto 600.000 €.","TipoClienteIA":"Inversor","LeadScoreIA":77,"UrgenciaIA":"Media","SentimientoIA":"Solo curioseando","FechaHora":"2025-02-03T00:00:00.000Z","EstadoLeadNumero":0,"EstadoLead":"Nuevo"},
  {"Nombre":"Pablo Díaz","Email":"pablo.diaz@gmail.com","Telefono":"608688244","QueQuieresHacer":"Otro","TipoInmueble":"Oficina","ZonaBarrio":"Usera","Presupuesto":"750 € / mes","Plazo":"Lo antes posible (0–3 meses)","ComoNosHasConocido":"Recomendación","Mensaje":"Busco oficina en Usera con presupuesto aproximado de 750 € / mes. Necesito mudarme pronto.","ResumenIA":"Quiere otro oficina en Usera - presupuesto 750 € / mes.","TipoClienteIA":"Pareja","LeadScoreIA":98,"UrgenciaIA":"Baja","SentimientoIA":"Muy interesado","FechaHora":"2025-02-03T03:00:00.000Z","EstadoLeadNumero":2,"EstadoLead":"En seguimiento"},
  {"Nombre":"Laura Sánchez","Email":"laura.sanchez@gmail.com","Telefono":"603445194","QueQuieresHacer":"Invertir en inmuebles","TipoInmueble":"Local comercial","ZonaBarrio":"Valencia centro","Presupuesto":"900 € / mes","Plazo":"Lo antes posible (0–3 meses)","ComoNosHasConocido":"Redes sociales","Mensaje":"Busco local comercial en Valencia centro con presupuesto aproximado de 900 € / mes. Necesito mudarme pronto.","ResumenIA":"Quiere invertir local comercial en Valencia centro - presupuesto 900 € / mes.","TipoClienteIA":"Pareja","LeadScoreIA":59,"UrgenciaIA":"Media","SentimientoIA":"Solo curioseando","FechaHora":"2025-02-03T06:00:00.000Z","EstadoLeadNumero":2,"EstadoLead":"En seguimiento"},
  {"Nombre":"Diego Romero","Email":"diego.romero@gmail.com","Telefono":"699661671","QueQuieresHacer":"Otro","TipoInmueble":"Chalet","ZonaBarrio":"Chamberí","Presupuesto":"300.000 €","Plazo":"Lo antes posible (0–3 meses)","ComoNosHasConocido":"Google","Mensaje":"Busco chalet en Chamberí con presupuesto aproximado de 300.000 €. Necesito mudarme pronto.","ResumenIA":"Quiere otro chalet en Chamberí - presupuesto 300.000 €.","TipoClienteIA":"Pareja","LeadScoreIA":44,"UrgenciaIA":"Alta","SentimientoIA":"Solo curioseando","FechaHora":"2025-02-03T09:00:00.000Z","EstadoLeadNumero":0,"EstadoLead":"Nuevo"},
  {"Nombre":"Elena Morales","Email":"elena.morales@gmail.com","Telefono":"628867561","QueQuieresHacer":"Invertir en inmuebles","TipoInmueble":"Piso","ZonaBarrio":"Malasaña","Presupuesto":"800.000 €","Plazo":"Lo antes posible (0–3 meses)","ComoNosHasConocido":"Portal inmobiliario","Mensaje":"Busco piso en Malasaña con presupuesto aproximado de 800.000 €. Necesito mudarme pronto.","ResumenIA":"Quiere invertir piso en Malasaña - presupuesto 800.000 €.","TipoClienteIA":"Joven profesional","LeadScoreIA":71,"UrgenciaIA":"Alta","SentimientoIA":"Interesado","FechaHora":"2025-02-03T12:00:00.000Z","EstadoLeadNumero":1,"EstadoLead":"Contactado"},
  {"Nombre":"Raúl Navarro","Email":"raul.navarro@gmail.com","Telefono":"676407806","QueQuieresHacer":"Alquilar vivienda","TipoInmueble":"Piso","ZonaBarrio":"Retiro","Presupuesto":"900 € / mes","Plazo":"Lo antes posible (0–3 meses)","ComoNosHasConocido":"Google","Mensaje":"Busco piso en Retiro con presupuesto aproximado de 900 € / mes. Necesito mudarme pronto.","ResumenIA":"Quiere alquilar piso en Retiro - presupuesto 900 € / mes.","TipoClienteIA":"Jubilado","LeadScoreIA":63,"UrgenciaIA":"Alta","SentimientoIA":"Muy interesado","FechaHora":"2025-02-03T15:00:00.000Z","EstadoLeadNumero":1,"EstadoLead":"Contactado"},
  {"Nombre":"Marta Ortega","Email":"marta.ortega@gmail.com","Telefono":"636457882","QueQuieresHacer":"Otro","TipoInmueble":"Piso","ZonaBarrio":"Lavapiés","Presupuesto":"500.000 €","Plazo":"Lo antes posible (0–3 meses)","ComoNosHasConocido":"Redes sociales","Mensaje":"Busco piso en Lavapiés con presupuesto aproximado de 500.000 €. Necesito mudarme pronto.","ResumenIA":"Quiere otro piso en Lavapiés - presupuesto 500.000 €.","TipoClienteIA":"Joven profesional","LeadScoreIA":42,"UrgenciaIA":"Alta","SentimientoIA":"Escéptico","FechaHora":"2025-02-03T18:00:00.000Z","EstadoLeadNumero":1,"EstadoLead":"Contactado"},
  {"Nombre":"Alberto Castillo","Email":"alberto.castillo@gmail.com","Telefono":"618241751","QueQuieresHacer":"Comprar vivienda","TipoInmueble":"Chalet","ZonaBarrio":"Pozuelo","Presupuesto":"800.000 €","Plazo":"Solo estoy mirando opciones","ComoNosHasConocido":"Portal inmobiliario","Mensaje":"Busco chalet en Pozuelo con presupuesto aproximado de 800.000 €. Estoy valorando opciones con calma.","ResumenIA":"Quiere comprar chalet en Pozuelo - presupuesto 800.000 €.","TipoClienteIA":"Inversor","LeadScoreIA":43,"UrgenciaIA":"Alta","SentimientoIA":"Molesto","FechaHora":"2025-02-03T21:00:00.000Z","EstadoLeadNumero":4,"EstadoLead":"Cerrado ganado"},
  {"Nombre":"Patricia Rubio","Email":"patricia.rubio@gmail.com","Telefono":"613270755","QueQuieresHacer":"Otro","TipoInmueble":"Estudio","ZonaBarrio":"Getafe","Presupuesto":"350.000 €","Plazo":"En 3–6 meses","ComoNosHasConocido":"Redes sociales","Mensaje":"Busco estudio en Getafe con presupuesto aproximado de 350.000 €. Estoy valorando opciones con calma.","ResumenIA":"Quiere otro estudio en Getafe - presupuesto 350.000 €.","TipoClienteIA":"Pareja","LeadScoreIA":44,"UrgenciaIA":"Media","SentimientoIA":"Molesto","FechaHora":"2025-03-03T00:00:00.000Z","EstadoLeadNumero":2,"EstadoLead":"En seguimiento"},
  {"Nombre":"Hugo Alonso","Email":"hugo.alonso@gmail.com","Telefono":"648255556","QueQuieresHacer":"Alquilar vivienda","TipoInmueble":"Casa","ZonaBarrio":"Sevilla Triana","Presupuesto":"750 € / mes","Plazo":"Más de 6 meses","ComoNosHasConocido":"Google","Mensaje":"Busco casa en Sevilla Triana con presupuesto aproximado de 750 € / mes. Estoy valorando opciones con calma.","ResumenIA":"Quiere alquilar casa en Sevilla Triana - presupuesto 750 € / mes.","TipoClienteIA":"Joven profesional","LeadScoreIA":78,"UrgenciaIA":"Baja","SentimientoIA":"Molesto","FechaHora":"2025-03-03T03:00:00.000Z","EstadoLeadNumero":4,"EstadoLead":"Cerrado ganado"},
  {"Nombre":"Noelia Campos","Email":"noelia.campos@gmail.com","Telefono":"662997329","QueQuieresHacer":"Invertir en inmuebles","TipoInmueble":"Local comercial","ZonaBarrio":"Centro Madrid","Presupuesto":"600.000 €","Plazo":"Solo estoy mirando opciones","ComoNosHasConocido":"Portal inmobiliario","Mensaje":"Busco local comercial en Centro Madrid con presupuesto aproximado de 600.000 €. Estoy valorando opciones con calma.","ResumenIA":"Quiere invertir local comercial en Centro Madrid - presupuesto 600.000 €.","TipoClienteIA":"Empresa","LeadScoreIA":50,"UrgenciaIA":"Baja","SentimientoIA":"Solo curioseando","FechaHora":"2025-03-03T06:00:00.000Z","EstadoLeadNumero":2,"EstadoLead":"En seguimiento"},
  {"Nombre":"Iván Herrera","Email":"ivan.herrera@gmail.com","Telefono":"645149909","QueQuieresHacer":"Comprar vivienda","TipoInmueble":"Estudio","ZonaBarrio":"Retiro","Presupuesto":"400.000 €","Plazo":"Más de 6 meses","ComoNosHasConocido":"Google","Mensaje":"Busco estudio en Retiro con presupuesto aproximado de 400.000 €. Estoy valorando opciones con calma.","ResumenIA":"Quiere comprar estudio en Retiro - presupuesto 400.000 €.","TipoClienteIA":"Estudiante","LeadScoreIA":66,"UrgenciaIA":"Baja","SentimientoIA":"Interesado","FechaHora":"2025-03-03T09:00:00.000Z","EstadoLeadNumero":0,"EstadoLead":"Nuevo"},
  {"Nombre":"Cristina Vega","Email":"cristina.vega@gmail.com","Telefono":"680595241","QueQuieresHacer":"Alquilar vivienda","TipoInmueble":"Piso","ZonaBarrio":"Valencia centro","Presupuesto":"800.000 €","Plazo":"Solo estoy mirando opciones","ComoNosHasConocido":"Redes sociales","Mensaje":"Busco piso en Valencia centro con presupuesto aproximado de 800.000 €. Estoy valorando opciones con calma.","ResumenIA":"Quiere alquilar piso en Valencia centro - presupuesto 800.000 €.","TipoClienteIA":"Inversor","LeadScoreIA":76,"UrgenciaIA":"Baja","SentimientoIA":"Interesado","FechaHora":"2025-03-03T12:00:00.000Z","EstadoLeadNumero":0,"EstadoLead":"Nuevo"},
  {"Nombre":"Adrián Molina","Email":"adrian.molina@gmail.com","Telefono":"662989184","QueQuieresHacer":"Otro","TipoInmueble":"Local comercial","ZonaBarrio":"Usera","Presupuesto":"350.000 €","Plazo":"Solo estoy mirando opciones","ComoNosHasConocido":"Recomendación","Mensaje":"Busco local comercial en Usera con presupuesto aproximado de 350.000 €. Estoy valorando opciones con calma.","ResumenIA":"Quiere otro local comercial en Usera - presupuesto 350.000 €.","TipoClienteIA":"Familia","LeadScoreIA":65,"UrgenciaIA":"Baja","SentimientoIA":"Solo curioseando","FechaHora":"2025-03-03T15:00:00.000Z","EstadoLeadNumero":5,"EstadoLead":"Cerrado perdido"},
  {"Nombre":"Silvia Reyes","Email":"silvia.reyes@gmail.com","Telefono":"675049071","QueQuieresHacer":"Alquilar vivienda","TipoInmueble":"Apartamento","ZonaBarrio":"Alcobendas","Presupuesto":"1.200 € / mes","Plazo":"Lo antes posible (0–3 meses)","ComoNosHasConocido":"Google","Mensaje":"Busco apartamento en Alcobendas con presupuesto aproximado de 1.200 € / mes. Necesito mudarme pronto.","ResumenIA":"Quiere alquilar apartamento en Alcobendas - presupuesto 1.200 € / mes.","TipoClienteIA":"Empresa","LeadScoreIA":66,"UrgenciaIA":"Alta","SentimientoIA":"Escéptico","FechaHora":"2025-03-03T18:00:00.000Z","EstadoLeadNumero":5,"EstadoLead":"Cerrado perdido"},
  {"Nombre":"Rubén Iglesias","Email":"ruben.iglesias@gmail.com","Telefono":"647540041","QueQuieresHacer":"Comprar vivienda","TipoInmueble":"Casa","ZonaBarrio":"Chamberí","Presupuesto":"500.000 €","Plazo":"Lo antes posible (0–3 meses)","ComoNosHasConocido":"Portal inmobiliario","Mensaje":"Busco casa en Chamberí con presupuesto aproximado de 500.000 €. Necesito mudarme pronto.","ResumenIA":"Quiere comprar casa en Chamberí - presupuesto 500.000 €.","TipoClienteIA":"Joven profesional","LeadScoreIA":68,"UrgenciaIA":"Alta","SentimientoIA":"Solo curioseando","FechaHora":"2025-03-03T21:00:00.000Z","EstadoLeadNumero":5,"EstadoLead":"Cerrado perdido"},
  {"Nombre":"Natalia Rivas","Email":"natalia.rivas@gmail.com","Telefono":"652109113","QueQuieresHacer":"Comprar vivienda","TipoInmueble":"Piso","ZonaBarrio":"Malasaña","Presupuesto":"450.000 €","Plazo":"Más de 6 meses","ComoNosHasConocido":"Redes sociales","Mensaje":"Busco piso en Malasaña con presupuesto aproximado de 450.000 €. Estoy valorando opciones con calma.","ResumenIA":"Quiere comprar piso en Malasaña - presupuesto 450.000 €.","TipoClienteIA":"Inversor","LeadScoreIA":83,"UrgenciaIA":"Baja","SentimientoIA":"Interesado","FechaHora":"2025-04-03T00:00:00.000Z","EstadoLeadNumero":4,"EstadoLead":"Cerrado ganado"},
  {"Nombre":"Óscar Rubio","Email":"oscar.rubio@gmail.com","Telefono":"637720161","QueQuieresHacer":"Invertir en inmuebles","TipoInmueble":"Local comercial","ZonaBarrio":"Arganzuela","Presupuesto":"600.000 €","Plazo":"Más de 6 meses","ComoNosHasConocido":"Google","Mensaje":"Busco local comercial en Arganzuela con presupuesto aproximado de 600.000 €. Estoy valorando opciones con calma.","ResumenIA":"Quiere invertir local comercial en Arganzuela - presupuesto 600.000 €.","TipoClienteIA":"Inversor","LeadScoreIA":71,"UrgenciaIA":"Baja","SentimientoIA":"Interesado","FechaHora":"2025-04-03T03:00:00.000Z","EstadoLeadNumero":5,"EstadoLead":"Cerrado perdido"},
  {"Nombre":"Beatriz Cano","Email":"beatriz.cano@gmail.com","Telefono":"633343477","QueQuieresHacer":"Alquilar vivienda","TipoInmueble":"Apartamento","ZonaBarrio":"Centro Madrid","Presupuesto":"900 € / mes","Plazo":"En 3–6 meses","ComoNosHasConocido":"Portal inmobiliario","Mensaje":"Busco apartamento en Centro Madrid con presupuesto aproximado de 900 € / mes. Estoy valorando opciones con calma.","ResumenIA":"Quiere alquilar apartamento en Centro Madrid - presupuesto 900 € / mes.","TipoClienteIA":"Inversor","LeadScoreIA":94,"UrgenciaIA":"Baja","SentimientoIA":"Solo curioseando","FechaHora":"2025-04-03T06:00:00.000Z","EstadoLeadNumero":4,"EstadoLead":"Cerrado ganado"},
  {"Nombre":"Daniel Serrano","Email":"daniel.serrano@gmail.com","Telefono":"644284870","QueQuieresHacer":"Invertir en inmuebles","TipoInmueble":"Piso","ZonaBarrio":"Sevilla Triana","Presupuesto":"1.000.000 €","Plazo":"Lo antes posible (0–3 meses)","ComoNosHasConocido":"Recomendación","Mensaje":"Busco piso en Sevilla Triana con presupuesto aproximado de 1.000.000 €. Necesito mudarme pronto.","ResumenIA":"Quiere invertir piso en Sevilla Triana - presupuesto 1.000.000 €.","TipoClienteIA":"Empresa","LeadScoreIA":98,"UrgenciaIA":"Alta","SentimientoIA":"Escéptico","FechaHora":"2025-04-03T09:00:00.000Z","EstadoLeadNumero":2,"EstadoLead":"En seguimiento"},
  {"Nombre":"Rocío Sáez","Email":"rocio.saez@gmail.com","Telefono":"639016025","QueQuieresHacer":"Comprar vivienda","TipoInmueble":"Piso","ZonaBarrio":"Retiro","Presupuesto":"350.000 €","Plazo":"En 3–6 meses","ComoNosHasConocido":"Google","Mensaje":"Busco piso en Retiro con presupuesto aproximado de 350.000 €. Estoy valorando opciones con calma.","ResumenIA":"Quiere comprar piso en Retiro - presupuesto 350.000 €.","TipoClienteIA":"Inversor","LeadScoreIA":80,"UrgenciaIA":"Alta","SentimientoIA":"Escéptico","FechaHora":"2025-04-03T12:00:00.000Z","EstadoLeadNumero":1,"EstadoLead":"Contactado"},
  {"Nombre":"Gonzalo Cruz","Email":"gonzalo.cruz@gmail.com","Telefono":"676483881","QueQuieresHacer":"Alquilar vivienda","TipoInmueble":"Estudio","ZonaBarrio":"Getafe","Presupuesto":"750 € / mes","Plazo":"En 3–6 meses","ComoNosHasConocido":"Portal inmobiliario","Mensaje":"Busco estudio en Getafe con presupuesto aproximado de 750 € / mes. Estoy valorando opciones con calma.","ResumenIA":"Quiere alquilar estudio en Getafe - presupuesto 750 € / mes.","TipoClienteIA":"Inversor","LeadScoreIA":80,"UrgenciaIA":"Media","SentimientoIA":"Solo curioseando","FechaHora":"2025-04-03T15:00:00.000Z","EstadoLeadNumero":5,"EstadoLead":"Cerrado perdido"},
  {"Nombre":"Inés Delgado","Email":"ines.delgado@gmail.com","Telefono":"623681351","QueQuieresHacer":"Otro","TipoInmueble":"Apartamento","ZonaBarrio":"Barcelona Eixample","Presupuesto":"800.000 €","Plazo":"Más de 6 meses","ComoNosHasConocido":"Redes sociales","Mensaje":"Busco apartamento en Barcelona Eixample con presupuesto aproximado de 800.000 €. Estoy valorando opciones con calma.","ResumenIA":"Quiere otro apartamento en Barcelona Eixample - presupuesto 800.000 €.","TipoClienteIA":"Estudiante","LeadScoreIA":78,"UrgenciaIA":"Baja","SentimientoIA":"Interesado","FechaHora":"2025-04-03T18:00:00.000Z","EstadoLeadNumero":0,"EstadoLead":"Nuevo"},
  {"Nombre":"Víctor Soler","Email":"victor.soler@gmail.com","Telefono":"661879180","QueQuieresHacer":"Comprar vivienda","TipoInmueble":"Local comercial","ZonaBarrio":"Usera","Presupuesto":"400.000 €","Plazo":"En 3–6 meses","ComoNosHasConocido":"Google","Mensaje":"Busco local comercial en Usera con presupuesto aproximado de 400.000 €. Estoy valorando opciones con calma.","ResumenIA":"Quiere comprar local comercial en Usera - presupuesto 400.000 €.","TipoClienteIA":"Empresa","LeadScoreIA":45,"UrgenciaIA":"Media","SentimientoIA":"Escéptico","FechaHora":"2025-04-03T21:00:00.000Z","EstadoLeadNumero":3,"EstadoLead":"En negociación"},
  {"Nombre":"Clara Méndez","Email":"clara.mendez@gmail.com","Telefono":"633374110","QueQuieresHacer":"Comprar vivienda","TipoInmueble":"Piso","ZonaBarrio":"Valencia centro","Presupuesto":"750 € / mes","Plazo":"Más de 6 meses","ComoNosHasConocido":"Portal inmobiliario","Mensaje":"Busco piso en Valencia centro con presupuesto aproximado de 750 € / mes. Estoy valorando opciones con calma.","ResumenIA":"Quiere comprar piso en Valencia centro - presupuesto 750 € / mes.","TipoClienteIA":"Inversor","LeadScoreIA":94,"UrgenciaIA":"Baja","SentimientoIA":"Interesado","FechaHora":"2025-05-03T00:00:00.000Z","EstadoLeadNumero":0,"EstadoLead":"Nuevo"},
  {"Nombre":"Gemma Clavero","Email":"casagemmayraul@yahoo.es","Telefono":"3208342737","QueQuieresHacer":"Comprar vivienda","TipoInmueble":"Casa / chalet","ZonaBarrio":"Suba, Bogotá, Colombia","Presupuesto":"5000.000.000 COP","Plazo":"Lo antes posible (0–3 meses)","ComoNosHasConocido":"Otro","Mensaje":"Busco casa en Suba para vivir. Que no necesite reformas","ResumenIA":"Quiere comprar casa en Suba, Bogotá, para vivir, presupuesto 5000000000 COP y mudanza en menos de 3 meses.","TipoClienteIA":"familia","LeadScoreIA":90,"UrgenciaIA":"Alta","SentimientoIA":"Muy interesado","FechaHora":"2025-12-17T16:55:25.947Z","EstadoLeadNumero":0,"EstadoLead":"Nuevo"},
  {"Nombre":"Gemma Clavero del Moral","Email":"casagemmayraul@yahoo.es","Telefono":"3208342737","QueQuieresHacer":"Arrendar vivienda","TipoInmueble":"Apartamento / estudio","ZonaBarrio":"Chico, Bogotá","Presupuesto":"2.500.000 COP","Plazo":"Más de 6 meses","ComoNosHasConocido":"Redes sociales","Mensaje":"Alquiler amueblado","ResumenIA":"Quiere arrendar apartamento o estudio amueblado en Chico, Bogotá, con presupuesto de 2.500.000 COP y plazo superior a 6 meses.","TipoClienteIA":"otro","LeadScoreIA":55,"UrgenciaIA":"Baja","SentimientoIA":"Interesado","FechaHora":"2025-12-17T19:16:28.421Z","EstadoLeadNumero":0,"EstadoLead":"Nuevo"}
];

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

  const fetchLeads = useCallback(async () => {
    setLoadingState(true);
    setErrorState(null);

    try {
      // Simulate loading time for UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Load the leads from n8n workflow data
      // In production, this would be a real API call to n8n
      loadLeads(INITIAL_LEADS);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar los leads';
      setErrorState(errorMessage);
    } finally {
      setLoadingState(false);
    }
  }, [loadLeads, setLoadingState, setErrorState]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  if (error && allLeads.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No se han podido cargar los datos</h2>
          <p className="text-muted-foreground mb-6">
            {error}
          </p>
          <Button onClick={fetchLeads} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading && allLeads.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <Building2 className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Cargando datos...</h2>
          <p className="text-muted-foreground">
            Obteniendo leads desde n8n
          </p>
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
