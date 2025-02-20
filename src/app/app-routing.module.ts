import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortOnComponent } from './components/port-on/port-on.component';
import { PortinRequestComponent } from './components/portin-request/portin-request.component';
import { TheftComponent } from './components/theft/theft.component';

const routes: Routes = [
  { path: 'port-on', component: PortOnComponent },
  { path: 'portin-request', component: PortinRequestComponent },
  { path: 'theft', component: TheftComponent },  
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
