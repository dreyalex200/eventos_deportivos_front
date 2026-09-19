import { Component } from '@angular/core';

interface WorkflowStep {
  num: number;
  title: string;
  desc: string;
}

@Component({
  selector: 'app-workflow',
  standalone: true,
  templateUrl: './workflow.component.html',
  styleUrl: './workflow.component.scss'
})
export class WorkflowComponent {
  steps: WorkflowStep[] = [
    { num: 1, title: 'Crear Competencia', desc: 'Establece el título del torneo, entidad anfitriona, disciplinas deportivas y fechas maestras.' },
    { num: 2, title: 'Configurar Reglamentos', desc: 'Define límites de edad, cupos de nómina, documentación requerida y criterios de desempate.' },
    { num: 3, title: 'Definir Categorías', desc: 'Establece divisiones por género, niveles de habilidad y rangos de edad (ej. Sub-18, Mayores).' },
    { num: 4, title: 'Habilitar Inscripción', desc: 'Publica enlaces públicos de registro o restringe el acceso a instituciones invitadas.' },
    { num: 5, title: 'Registrar Equipos', desc: 'Entrenadores y delegados cargan nóminas de jugadores, certificados médicos y cuerpo técnico.' },
    { num: 6, title: 'Validar Participantes', desc: 'Los auditores inspeccionan documentos, verifican el cumplimiento de edad y expiden acreditaciones oficiales.' },
    { num: 7, title: 'Programar Partidos', desc: 'Programa automáticamente los enfrentamientos en sedes deportivas, fechas y horarios.' },
    { num: 8, title: 'Ejecutar Competencia', desc: 'Desarrollo de partidos en vivo, actas arbitrales de campo y actualización de estados en tiempo real.' },
    { num: 9, title: 'Registrar Resultados', desc: 'Ingreso de marcadores, sanciones, tarjetas y anotadores con verificación instantánea.' },
    { num: 10, title: 'Generar Tablas y Clasificaciones', desc: 'Actualización automática de posiciones, clasificación a fases finales y reportes descargables.' }
  ];
}
