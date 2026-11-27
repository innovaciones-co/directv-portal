import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortabilityComponent } from './portability/portability.component';
import { TheftComponent } from './components/theft/theft.component';
import { PqrComponent } from './components/pqr/pqr.component';
import { QuienesSomosComponent } from './components/quienes-somos/quienes-somos.component';
import { PlanesComponent } from './components/planes/planes.component';
import { LegalesComponent } from './components/legales/legales.component';
import { TerminosCondicionesComponent } from './components/terminos-condiciones/terminos-condiciones.component';
import { ConsultPqrComponent } from './components/consult-pqr/consult-pqr.component';
import { HandsetComponent } from './components/handset/handset.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { HomologationComponent } from './components/homologation/homologation.component';

const routes: Routes = [
  { path: 'port-on', component: PortabilityComponent, title: 'Pórtate a DIRECTV' },
  // The old second and "resume" pages: the guided port-in remembers where the customer left.
  { path: 'portin-request', redirectTo: '/port-on' },
  { path: 'port-on-continue', redirectTo: '/port-on' },
  { path: 'theft', component: TheftComponent },
  { path: 'pqr', component: PqrComponent },
  { path: 'home', component: QuienesSomosComponent},
  { path: 'plans', component: PlanesComponent},
  { path:'legales', component: LegalesComponent},
  { path: 'terminos-y-condiciones', component:TerminosCondicionesComponent},
  { path: 'pqr-consult', component:ConsultPqrComponent},
  { path: 'handset', component:HandsetComponent},
  { path: 'questions', component:QuestionsComponent},
  { path: 'homologation', component:HomologationComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
