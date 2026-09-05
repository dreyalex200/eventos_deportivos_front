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
      name: 'Football (Soccer)',
      tagline: '11v11, 7v7, Beach Football',
      modalities: ['Group Stage', 'Single Elimination', 'League System'],
      icon: 'football',
      colorClass: 'emerald'
    },
    {
      name: 'Basketball',
      tagline: '5v5 Traditional, 3x3 Streetball',
      modalities: ['Quarter System', 'Playoff Brackets', 'Points Table'],
      icon: 'basketball',
      colorClass: 'amber'
    },
    {
      name: 'Volleyball',
      tagline: 'Indoor, Beach Volleyball',
      modalities: ['Set Scoring', 'Rally Point System', 'Tournament Phases'],
      icon: 'volleyball',
      colorClass: 'blue'
    },
    {
      name: 'Baseball',
      tagline: 'Standard Baseball, Softball',
      modalities: ['Inning Config', 'Double Elimination', 'Series Bracket'],
      icon: 'baseball',
      colorClass: 'teal'
    },
    {
      name: 'Futsal',
      tagline: 'Indoor 5v5 Hardcourt',
      modalities: ['Accumulated Fouls', 'Stop-clock Timer', 'Group Knockout'],
      icon: 'futsal',
      colorClass: 'cyan'
    },
    {
      name: 'Custom & Extensible',
      tagline: 'Track & Field, Swimming, Tennis, etc.',
      modalities: ['Individual Meets', 'Custom Scoring', 'Flexible Metrics'],
      icon: 'custom',
      colorClass: 'purple'
    }
  ];
}
