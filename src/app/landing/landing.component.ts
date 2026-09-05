import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { PlatformOverviewComponent } from './components/platform-overview/platform-overview.component';
import { FeaturesComponent } from './components/features/features.component';
import { SportsComponent } from './components/sports/sports.component';
import { CompetitionTypesComponent } from './components/competition-types/competition-types.component';
import { RulesComponent } from './components/rules/rules.component';
import { WorkflowComponent } from './components/workflow/workflow.component';
import { UsersComponent } from './components/users/users.component';
import { BenefitsComponent } from './components/benefits/benefits.component';
import { CallToActionComponent } from './components/call-to-action/call-to-action.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    PlatformOverviewComponent,
    FeaturesComponent,
    SportsComponent,
    CompetitionTypesComponent,
    RulesComponent,
    WorkflowComponent,
    UsersComponent,
    BenefitsComponent,
    CallToActionComponent,
    FooterComponent
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {}
