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
      title: 'Registration Windows',
      subtitle: 'Strict Start & End Timelines',
      exampleText: 'Enforce automatic system lockouts after registration deadlines pass to ensure zero late entries.',
      tags: ['Opening Date', 'Closing Date', 'Late Registration Fees'],
      icon: 'windows'
    },
    {
      title: 'Age & Gender Categories',
      subtitle: 'Eligibility Verification',
      exampleText: 'Define exact birthdate brackets (e.g. Under-16, Senior, Master 40+) and male, female, or mixed categories.',
      tags: ['Sub-14', 'Sub-18', 'Open Category', 'Mixed Doubles'],
      icon: 'eligibility'
    },
    {
      title: 'Roster Limits & Technical Staff',
      subtitle: 'Min & Max Player Rules',
      exampleText: 'Set strict minimum roster size (e.g., min 11 players) and required staff (Head Coach, Assistant, Medic).',
      tags: ['Min 11 / Max 22', 'Coach License Required', 'Medic Mandatory'],
      icon: 'roster'
    },
    {
      title: 'Required Documentation',
      subtitle: 'Legal & Medical Compliance',
      exampleText: 'Mandate digital document uploads: National ID card, medical fitness clearance, photo, and parental consent.',
      tags: ['ID Upload', 'Medical Fitness Certificate', 'Parental Waiver'],
      icon: 'docs'
    },
    {
      title: 'Institutional Affiliation',
      subtitle: 'Schools, Universities & Clubs',
      exampleText: 'Validate student enrollment certificates, university IDs, or municipal affiliation credentials before approval.',
      tags: ['School Code', 'Student ID', 'Municipal Registry'],
      icon: 'affiliation'
    },
    {
      title: 'Competition Phases & Sponsors',
      subtitle: 'Format & Branding Rules',
      exampleText: 'Configure group stage tiebreakers (goal difference, head-to-head) and assign tournament sponsors to scorecards.',
      tags: ['Goal Difference Rule', 'Yellow Card Audit', 'Sponsor Banners'],
      icon: 'phases'
    }
  ];
}
