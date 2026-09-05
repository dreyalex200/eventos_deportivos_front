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
      title: 'Sports & Competitions',
      description: 'Configure sports, modalities, competition types, categories, and tournament structures with maximum flexibility.',
      badge: 'Core Engine',
      icon: 'sports'
    },
    {
      id: 'teams-participants',
      title: 'Teams & Participants',
      description: 'Manage teams, players, technical staff, coaches, assistants, delegates, and comprehensive participant profiles.',
      badge: 'Roster Control',
      icon: 'teams'
    },
    {
      id: 'registration-management',
      title: 'Registration Management',
      description: 'Streamline team and individual participant registrations according to the specific rules defined per competition.',
      badge: 'Workflows',
      icon: 'registration'
    },
    {
      id: 'tournament-rules',
      title: 'Tournament Rules',
      description: 'Configure competition rules, age restrictions, gender categories, registration windows, quotas, and document requirements.',
      badge: 'Configurable',
      icon: 'rules'
    },
    {
      id: 'scheduling',
      title: 'Scheduling & Match Programming',
      description: 'Plan matches, dates, times, venues, fields, courts, and tournament phases while automatically preventing scheduling conflicts.',
      badge: 'Automation',
      icon: 'scheduling'
    },
    {
      id: 'sports-venues',
      title: 'Sports Venues',
      description: 'Manage sports facilities, courts, pitches, stadium availability, and assign venues based on competition needs.',
      badge: 'Facilities',
      icon: 'venues'
    },
    {
      id: 'results-standings',
      title: 'Results & Standings',
      description: 'Record match outcomes, maintain live classifications, track tournament phases, leaderboards, and competition progress.',
      badge: 'Live Data',
      icon: 'results'
    },
    {
      id: 'audit-traceability',
      title: 'Audit & Traceability',
      description: 'Maintain a complete operational history, audit logs of modifications, participant status changes, and administrator actions.',
      badge: 'Security',
      icon: 'audit'
    }
  ];
}
