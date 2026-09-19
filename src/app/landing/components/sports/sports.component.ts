import { Component } from '@angular/core';

interface SportCard {
  name: string;
  tagline: string;
  modalities: string[];
  icon: 'football' | 'basketball' | 'volleyball' | 'baseball' | 'futsal' | 'custom';
  colorClass: string;
}

@Component({
  selector: 'app-sports',
  standalone: true,
  templateUrl: './sports.component.html',
  styleUrl: './sports.component.scss'
})
export class SportsComponent {
  sportsList: SportCard[] = [
    {
      name: 'Fútbol',
      tagline: '11 vs 11, Fútbol 7, Fútbol Playa',
      modalities: ['Fase de Grupos', 'Eliminación Directa', 'Sistema de Liga'],
      icon: 'football',
      colorClass: 'emerald'
    },
    {
      name: 'Baloncesto',
      tagline: '5 vs 5 Tradicional, Baloncesto 3x3',
      modalities: ['Sistema por Cuartos', 'Llaves de Playoff', 'Tabla de Puntos'],
      icon: 'basketball',
      colorClass: 'amber'
    },
    {
      name: 'Voleibol',
      tagline: 'Voleibol de Sala, Voleibol de Playa',
      modalities: ['Puntuación por Sets', 'Punto por Rally', 'Fases de Torneo'],
      icon: 'volleyball',
      colorClass: 'blue'
    },
    {
      name: 'Béisbol',
      tagline: 'Béisbol Estándar, Sóftbol',
      modalities: ['Configuración por Entradas', 'Doble Eliminación', 'Serie al Mejor'],
      icon: 'baseball',
      colorClass: 'teal'
    },
    {
      name: 'Futsal',
      tagline: 'Fútbol de Salón 5 vs 5',
      modalities: ['Faltas Acumuladas', 'Cronómetro con Paradas', 'Grupos y Eliminación'],
      icon: 'futsal',
      colorClass: 'cyan'
    },
    {
      name: 'Personalizado y Extensible',
      tagline: 'Atletismo, Natación, Tenis y más',
      modalities: ['Encuentros Individuales', 'Puntuación Personalizada', 'Métricas Flexibles'],
      icon: 'custom',
      colorClass: 'purple'
    }
  ];
}
