import { Component } from '@angular/core';

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  badge: string;
  icon: 'sports' | 'teams' | 'registration' | 'rules' | 'scheduling' | 'venues' | 'results' | 'audit';
}

@Component({
  selector: 'app-features',
  standalone: true,
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss'
})
export class FeaturesComponent {
  featuresList: FeatureItem[] = [
    {
      id: 'sports-competitions',
      title: 'Deportes y Competencias',
      description: 'Configura deportes, modalidades, tipos de competencia, categorías y estructuras de torneo con máxima flexibilidad.',
      badge: 'Motor Principal',
      icon: 'sports'
    },
    {
      id: 'teams-participants',
      title: 'Equipos y Participantes',
      description: 'Gestiona equipos, jugadores, cuerpo técnico, entrenadores, asistentes, delegados y perfiles integrales de participantes.',
      badge: 'Control de Nóminas',
      icon: 'teams'
    },
    {
      id: 'registration-management',
      title: 'Gestión de Inscripciones',
      description: 'Optimiza las inscripciones de equipos y participantes individuales según las reglas específicas de cada competencia.',
      badge: 'Flujos Ágiles',
      icon: 'registration'
    },
    {
      id: 'tournament-rules',
      title: 'Reglamentos de Torneo',
      description: 'Configura reglas de competencia, restricciones de edad, categorías por género, períodos de inscripción, cupos y requisitos documentales.',
      badge: 'Configurable',
      icon: 'rules'
    },
    {
      id: 'scheduling',
      title: 'Programación y Calendario',
      description: 'Planifica partidos, fechas, horarios, sedes, canchas y fases de torneo evitando cruces de horario de forma automática.',
      badge: 'Automatización',
      icon: 'scheduling'
    },
    {
      id: 'sports-venues',
      title: 'Sedes Deportivas',
      description: 'Administra instalaciones deportivas, canchas, campos, disponibilidad de escenarios y asigna sedes según las necesidades de la competencia.',
      badge: 'Instalaciones',
      icon: 'venues'
    },
    {
      id: 'results-standings',
      title: 'Resultados y Clasificaciones',
      description: 'Registra resultados de partidos, mantén clasificaciones en vivo, realiza seguimiento de fases, tablas de líderes y avance de torneos.',
      badge: 'Datos en Vivo',
      icon: 'results'
    },
    {
      id: 'audit-traceability',
      title: 'Auditoría y Trazabilidad',
      description: 'Conserva un historial operativo completo, registros de modificaciones, cambios de estado de participantes y acciones administrativas.',
      badge: 'Seguridad',
      icon: 'audit'
    }
  ];
}
