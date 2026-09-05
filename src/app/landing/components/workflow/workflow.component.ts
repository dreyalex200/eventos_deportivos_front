import { Component } from '@angular/core';

interface WorkflowStep {
  num: number;
  title: string;
  desc: string;
}

@Component({
  selector: 'app-workflow',
  standalone: true,
  templateUrl: './workflow.component.html',
  styleUrl: './workflow.component.scss'
})
export class WorkflowComponent {
  steps: WorkflowStep[] = [
    { num: 1, title: 'Create Competition', desc: 'Set tournament title, host entity, sports disciplines, and master dates.' },
    { num: 2, title: 'Configure Rules', desc: 'Define age limits, roster quotas, required documentation, and tiebreakers.' },
    { num: 3, title: 'Define Categories', desc: 'Establish gender divisions, skill tiers, and age brackets (e.g. Sub-18, Men Open).' },
    { num: 4, title: 'Open Registration', desc: 'Publish public registration links or restrict to invited institutions.' },
    { num: 5, title: 'Register Teams', desc: 'Coaches and delegates upload player rosters, medicals, and staff details.' },
    { num: 6, title: 'Validate Participants', desc: 'Auditors inspect documents, age compliance, and issue official passes.' },
    { num: 7, title: 'Schedule Matches', desc: 'Auto-program pitch fixtures across sports venues, dates, and times.' },
    { num: 8, title: 'Run Competition', desc: 'Execute live matches, referee field logs, and real-time status updates.' },
    { num: 9, title: 'Record Results', desc: 'Input scores, sanctions, cards, and goalscorers with instant verification.' },
    { num: 10, title: 'Generate Standings', desc: 'Automatic leaderboard updates, phase qualification, and printable reports.' }
  ];
}
