import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { PortOnComponent } from './components/port-on/port-on.component';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { GetCustomersBySubscriptionService } from './services/get-customers-by-subscription.service';
import { GetNetworkOperatorService } from './services/get-network-operator-code.service';
import { PostSendAuthenticationService } from './services/post-send-authentication.service';
import { PortinRequestComponent } from './components/portin-request/portin-request.component';
import { TheftComponent } from './components/theft/theft.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PortOnComponent,
    PortinRequestComponent,
    TheftComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    GetCustomersBySubscriptionService,
    GetNetworkOperatorService,
    PostSendAuthenticationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
