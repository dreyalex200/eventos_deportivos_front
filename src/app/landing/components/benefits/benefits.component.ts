import { Component } from '@angular/core';

interface BenefitItem {
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  icon: 'database' | 'lightning' | 'shield' | 'calendar' | 'cloud' | 'sync';
}

@Component({
  selector: 'app-benefits',
  standalone: true,
  templateUrl: './benefits.component.html',
  styleUrl: './benefits.component.scss'
})
export class BenefitsComponent {
  benefits: BenefitItem[] = [
    {
      title: 'Información Centralizada',
      description: 'Única fuente de verdad para nóminas de torneos, estadísticas de partidos, sedes y registros administrativos.',
      metric: '100%',
      metricLabel: 'Consolidación de Datos',
      icon: 'database'
    },
    {
      title: 'Reducción Drástica de Trabajo Manual',
      description: 'Validación automatizada de nóminas, generación de calendarios y actualización de tablas que eliminan las hojas de cálculo.',
      metric: '-80%',
      metricLabel: 'Carga Operativa',
      icon: 'lightning'
    },
    {
      title: 'Gobernanza Transparente y Auditoría',
      description: 'Trazabilidad total en aprobación de inscripciones, cambios de marcadores, registros de sanciones y fallos disciplinarios.',
      metric: 'Total',
      metricLabel: 'Trazabilidad y Auditoría',
      icon: 'shield'
    },
    {
      title: 'Programación Inteligente de Sedes',
      description: 'Detección inteligente de conflictos para evitar cruces en canchas, campos o asignación de árbitros entre escenarios.',
      metric: '0',
      metricLabel: 'Conflictos de Calendario',
      icon: 'calendar'
    },
    {
      title: 'Gestión Deportiva Escalable',
      description: 'Escala sin dificultades desde copas de fin de semana en una sola cancha hasta ligas institucionales con miles de deportistas.',
      metric: '&infin;',
      metricLabel: 'Potencial de Escalamiento',
      icon: 'cloud'
    },
    {
      title: 'Datos Consistentes e Inmediatos',
      description: 'Actualizaciones instantáneas para que jugadores, delegados, prensa y aficionados consulten clasificaciones en tiempo real.',
      metric: 'Tiempo Real',
      metricLabel: 'Sincronización en Vivo',
      icon: 'sync'
    }
  ];
}
