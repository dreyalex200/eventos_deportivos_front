import { Component } from '@angular/core';

interface CompetitionModel {
  title: string;
  category: string;
  description: string;
  features: string[];
}

@Component({
  selector: 'app-competition-types',
  standalone: true,
  templateUrl: './competition-types.component.html',
  styleUrl: './competition-types.component.scss'
})
export class CompetitionTypesComponent {
  competitionModels: CompetitionModel[] = [
    {
      title: 'Competencias Municipales',
      category: 'Administración Pública',
      description: 'Ligas deportivas de ámbito local organizadas por secretarías de deportes y alcaldías municipales.',
      features: ['Distribución por escenarios barriales', 'Portales públicos de inscripción', 'Control estricto de edades']
    },
    {
      title: 'Juegos Intercolegiados y Universitarios',
      category: 'Sector Educativo',
      description: 'Torneos escolares, intercolegiales y universitarios con verificación de matrícula y afiliación institucional.',
      features: ['Verificación de nóminas estudiantiles', 'Reglas de elegibilidad académica', 'Gestión de delegados escolares']
    },
    {
      title: 'Torneos Federados y Ligas Oficiales',
      category: 'Federaciones Deportivas',
      description: 'Competencias de alto rendimiento bajo normativas oficiales de federaciones nacionales y auditoría arbitral.',
      features: ['Licenciamiento oficial de jugadores', 'Seguimiento disciplinario', 'Tablas de clasificación nacional']
    },
    {
      title: 'Juegos Institucionales y del Estado',
      category: 'Sector Público',
      description: 'Encuentros multidisciplinarios para servidores públicos, fuerzas de seguridad o dependencias estatales.',
      features: ['Puntaje por dependencias', 'Medallero multideportivo', 'Acreditación institucional']
    },
    {
      title: 'Ligas Empresariales y Corporativas',
      category: 'Empresas Privadas',
      description: 'Torneos de integración laboral diseñados para promover el bienestar, la salud y el trabajo en equipo.',
      features: ['Validación de identificación laboral', 'Programación en horarios no laborales', 'Imagen y patrocinio corporativo']
    },
    {
      title: 'Torneos Abiertos Comunitarios',
      category: 'Deporte Social y Barrial',
      description: 'Competencias comunitarias abiertas para clubes independientes, equipos aficionados y entusiastas del deporte.',
      features: ['Autogestión de inscripción de equipos', 'Control de pagos de participación', 'Generación ágil de llaves y cuadros']
    },
    {
      title: 'Campeonatos Regionales e Interdepartamentales',
      category: 'Multirregional',
      description: 'Grandes eventos que involucran desplazamientos entre municipios, múltiples sedes anfitrionas y fases sucesivas.',
      features: ['Programación multisede', 'Control de logística y desplazamientos', 'Avance automático entre fases']
    },
    {
      title: 'Competencias Híbridas a Medida',
      category: 'Formatos Personalizados',
      description: 'Copas de exhibición, eventos benéficos o sistemas híbridos de fase de grupos con llaves de eliminación directa.',
      features: ['Fórmulas personalizadas de puntuación', 'Lógica flexible de rondas', 'Reglamentos a la medida']
    }
  ];
}
