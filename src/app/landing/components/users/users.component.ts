import { Component } from '@angular/core';

interface UserRole {
  roleName: string;
  badge: string;
  description: string;
  responsibilities: string[];
  icon: 'admin' | 'operator' | 'auditor';
}

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  roles: UserRole[] = [
    {
      roleName: 'Administrators',
      badge: 'System Governance',
      description: 'Complete platform configuration, user access management, master rules definition, and security parameters.',
      responsibilities: [
        'Master sport & rule set creation',
        'User permission & role provisioning',
        'Venue & facility catalog management'
      ],
      icon: 'admin'
    },
    {
      roleName: 'Operators & Field Directors',
      badge: 'Day-to-Day Operations',
      description: 'Manage tournament execution, team roster approvals, match scheduling, score inputs, and venue assignments.',
      responsibilities: [
        'Registration validation & team review',
        'Pitch match scheduling & referee logs',
        'Real-time score & standings entry'
      ],
      icon: 'operator'
    },
    {
      roleName: 'Auditors & Compliance Officers',
      badge: 'Verification & Traceability',
      description: 'Review historical logs, participant eligibility, legal document authenticity, and sanction records.',
      responsibilities: [
        'Document authenticity verification',
        'System audit trail inspection',
        'Official compliance certification'
      ],
      icon: 'auditor'
    }
  ];

  targetInstitutions = [
    'Government Entities & Sports Secretariats',
    'Municipalities & Local Councils',
    'Educational Institutions & Universities',
    'Sports Clubs & Athletic Associations',
    'Sports Federations & Regional Leagues',
    'Independent Tournament Organizers',
    'Corporate & Private Entities'
  ];
}
