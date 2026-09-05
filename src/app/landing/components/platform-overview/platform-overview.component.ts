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
      title: 'Planning',
      description: 'Define tournament scope, competition structure, categories, and institutional objectives.',
      icon: 'planning'
    },
    {
      stepNumber: '02',
      title: 'Configuration',
      description: 'Establish custom age limits, gender categories, documentation rules, and participant quotas.',
      icon: 'configuration'
    },
    {
      stepNumber: '03',
      title: 'Registration',
      description: 'Streamlined online roster submission for teams, players, coaches, delegates, and staff.',
      icon: 'registration'
    },
    {
      stepNumber: '04',
      title: 'Validation',
      description: 'Auditors and operators review uploaded legal documents, age eligibility, and institutional credentials.',
      icon: 'validation'
    },
    {
      stepNumber: '05',
      title: 'Scheduling',
      description: 'Automatic or manual match programming across venues, fields, and dates without conflicts.',
      icon: 'scheduling'
    },
    {
      stepNumber: '06',
      title: 'Competition',
      description: 'Live tournament execution, referee assignment, pitch control, and phase advancement.',
      icon: 'competition'
    },
    {
      stepNumber: '07',
      title: 'Results',
      description: 'Official score registration, goal tracking, sanctions, and instant group standings update.',
      icon: 'results'
    },
    {
      stepNumber: '08',
      title: 'Reporting',
      description: 'Comprehensive historical logs, institutional trace audits, and printable competition certificates.',
      icon: 'reporting'
    }
  ];
}
