import { Component } from '@angular/core';

interface RuleCard {
  title: string;
  subtitle: string;
  exampleText: string;
  icon: 'windows' | 'eligibility' | 'roster' | 'docs' | 'affiliation' | 'phases';
  tags: string[];
}

@Component({
  selector: 'app-rules',
  standalone: true,
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.scss'
})
export class RulesComponent {
  rulesList: RuleCard[] = [
    {
      title: 'Ventanas de Inscripción',
      subtitle: 'Plazos Estrictos de Inicio y Cierre',
      exampleText: 'Aplique bloqueos automáticos del sistema una vez vencidos los plazos de inscripción para garantizar cero registros extemporáneos.',
      tags: ['Fecha de Apertura', 'Fecha de Cierre', 'Tarifas Extraordinarias'],
      icon: 'windows'
    },
    {
      title: 'Categorías por Edad y Género',
      subtitle: 'Verificación de Elegibilidad',
      exampleText: 'Defina rangos exactos por fecha de nacimiento (p. ej., Sub-16, Mayores, Máster 40+) y ramas masculina, femenina o mixta.',
      tags: ['Sub-14', 'Sub-18', 'Categoría Libre', 'Dobles Mixtos'],
      icon: 'eligibility'
    },
    {
      title: 'Límites de Nómina y Cuerpo Técnico',
      subtitle: 'Reglas de Mínimos y Máximos de Jugadores',
      exampleText: 'Establezca tamaños mínimos estrictos de plantilla (p. ej., mín. 11 jugadores) y cuerpo técnico requerido (Director Técnico, Asistente, Médico).',
      tags: ['Mín 11 / Máx 22', 'Licencia de DT Requerida', 'Médico Obligatorio'],
      icon: 'roster'
    },
    {
      title: 'Documentación Requerida',
      subtitle: 'Cumplimiento Legal y Médico',
      exampleText: 'Exija la carga de documentos digitales: documento de identidad, certificado médico de aptitud, fotografía y consentimiento parental.',
      tags: ['Carga de Documento', 'Certificado Médico', 'Autorización Parental'],
      icon: 'docs'
    },
    {
      title: 'Afiliación Institucional',
      subtitle: 'Colegios, Universidades y Clubes',
      exampleText: 'Valide constancias de matrícula estudiantil, carnés universitarios o credenciales de afiliación municipal antes de la aprobación.',
      tags: ['Código Institucional', 'Carné Estudiantil', 'Registro Municipal'],
      icon: 'affiliation'
    },
    {
      title: 'Fases de Competencia y Patrocinadores',
      subtitle: 'Reglas de Formato e Imagen',
      exampleText: 'Configure criterios de desempate en fase de grupos (diferencia de gol, enfrentamiento directo) y asigne patrocinadores a las planillas oficiales.',
      tags: ['Diferencia de Gol', 'Control de Tarjetas', 'Banners de Patrocinador'],
      icon: 'phases'
    }
  ];
}
