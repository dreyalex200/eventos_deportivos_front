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
      title: 'Centralized Information',
      description: 'Single authoritative source of truth for all tournament rosters, match statistics, venues, and administrative records.',
      metric: '100%',
      metricLabel: 'Data Consolidation',
      icon: 'database'
    },
    {
      title: 'Dramatically Less Manual Work',
      description: 'Automated roster verification, automated fixture generation, and automated standings updates eliminate spreadsheets.',
      metric: '-80%',
      metricLabel: 'Admin Workload',
      icon: 'lightning'
    },
    {
      title: 'Transparent Governance & Audit',
      description: 'Full traceability for registration approvals, score changes, sanction logs, and disciplinary decisions.',
      metric: 'Full',
      metricLabel: 'Auditing Traceability',
      icon: 'shield'
    },
    {
      title: 'Optimized Venue Scheduling',
      description: 'Intelligent conflict detection prevents double-booking pitches, courts, or referee assignments across venues.',
      metric: '0',
      metricLabel: 'Schedule Conflicts',
      icon: 'calendar'
    },
    {
      title: 'Scalable Sports Management',
      description: 'Seamlessly scale from local single-court weekend cups to multi-city institutional leagues with thousands of athletes.',
      metric: '&infin;',
      metricLabel: 'Scalability Potential',
      icon: 'cloud'
    },
    {
      title: 'Consistent & Immediate Data',
      description: 'Instant updates ensure players, delegates, press, and spectators always see identical, real-time standings.',
      metric: 'Real-time',
      metricLabel: 'Standings Sync',
      icon: 'sync'
    }
  ];
}
