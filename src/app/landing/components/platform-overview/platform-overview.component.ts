import { Component } from '@angular/core';

interface LifecycleStep {
  stepNumber: string;
  title: string;
  description: string;
  icon: 'planning' | 'configuration' | 'registration' | 'validation' | 'scheduling' | 'competition' | 'results' | 'reporting';
}

@Component({
  selector: 'app-platform-overview',
  standalone: true,
  templateUrl: './platform-overview.component.html',
  styleUrl: './platform-overview.component.scss'
})
export class PlatformOverviewComponent {
  lifecycleSteps: LifecycleStep[] = [
    {
      stepNumber: '01',
      title: 'Planificación',
      description: 'Define el alcance del torneo, estructura de competencia, categorías y objetivos institucionales.',
      icon: 'planning'
    },
    {
      stepNumber: '02',
      title: 'Configuración',
      description: 'Establece límites de edad personalizados, divisiones por género, reglas de documentación y cupos de participantes.',
      icon: 'configuration'
    },
    {
      stepNumber: '03',
      title: 'Inscripción',
      description: 'Registro ágil en línea de nóminas para equipos, jugadores, entrenadores, delegados y cuerpo técnico.',
      icon: 'registration'
    },
    {
      stepNumber: '04',
      title: 'Validación',
      description: 'Auditores y operadores revisan documentos legales cargados, elegibilidad por edad y credenciales institucionales.',
      icon: 'validation'
    },
    {
      stepNumber: '05',
      title: 'Programación',
      description: 'Programación automática o manual de partidos entre sedes, canchas y fechas sin cruces de horario.',
      icon: 'scheduling'
    },
    {
      stepNumber: '06',
      title: 'Competencia',
      description: 'Ejecución del torneo en vivo, asignación de árbitros, control de campo y avance de fases.',
      icon: 'competition'
    },
    {
      stepNumber: '07',
      title: 'Resultados',
      description: 'Registro oficial de marcadores, seguimiento de goles, sanciones y actualización instantánea de tablas de posiciones.',
      icon: 'results'
    },
    {
      stepNumber: '08',
      title: 'Reportes',
      description: 'Historial operativo completo, auditoría de trazabilidad institucional y certificados oficiales de competencia.',
      icon: 'reporting'
    }
  ];
}
