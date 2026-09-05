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
      title: 'Municipal Competitions',
      category: 'Public Administration',
      description: 'City-wide sports leagues organized by local sports directorates and municipal governments.',
      features: ['District venue routing', 'Public registration portals', 'Age bracket control']
    },
    {
      title: 'Inter-School & Academic Games',
      category: 'Education Sector',
      description: 'Primary, secondary, and university tournaments with school affiliation verification.',
      features: ['Student roster verification', 'Academic eligibility rules', 'Institutional delegates']
    },
    {
      title: 'Federated & Official League Tournaments',
      category: 'Sports Federations',
      description: 'High-level competitions adhering to official state or national federation rules and referee audits.',
      features: ['Official player licensing', 'Disciplinary tracking', 'National standings']
    },
    {
      title: 'Institutional & Government Games',
      category: 'Public Sector',
      description: 'Multi-discipline athletic meets for public employees, armed forces, or municipal workers.',
      features: ['Departmental scoring', 'Multi-sport medal tallies', 'Entity verification']
    },
    {
      title: 'Corporate & Business Leagues',
      category: 'Private Companies',
      description: 'Internal or inter-company recreation tournaments designed to promote wellness and team spirit.',
      features: ['Employee ID validation', 'After-work fixture schedules', 'Sponsor branding']
    },
    {
      title: 'Open Public Tournaments',
      category: 'Community Sports',
      description: 'Community-driven open tournaments accessible to independent clubs, neighborhood teams, and enthusiasts.',
      features: ['Online team self-registration', 'Fee management tags', 'Bracket generators']
    },
    {
      title: 'Regional & Interstate Championships',
      category: 'Multi-Region',
      description: 'Large scale inter-city or regional tournaments involving travel, multiple host venues, and complex phases.',
      features: ['Multi-venue programming', 'Travel accommodation logs', 'Phase advancement']
    },
    {
      title: 'Custom Hybrid Competitions',
      category: 'Tailored Formats',
      description: 'Special exhibition cups, charity matches, or hybrid round-robin plus knockout systems.',
      features: ['Custom scoring formulas', 'Configurable round logic', 'Tailored rulesets']
    }
  ];
}
