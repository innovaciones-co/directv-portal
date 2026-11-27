import { Component, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerData, DonorData, SimData } from './portability.service';
import { SimStepComponent } from './steps/sim-step.component';
import { DonorStepComponent } from './steps/donor-step.component';
import { CustomerStepComponent } from './steps/customer-step.component';
import { formatPhone } from './digits';

// What the customer entered so far, so going back a step or reloading the page loses nothing.
// Per tab (sessionStorage) and cleared once the request is sent.
const DRAFT_KEY = 'dtv.portability';

interface Draft {
  step: number;
  sim: SimData | null;
  donor: DonorData | null;
  customer: Partial<CustomerData> | null;
}

/** "Pórtate a DIRECTV": a guided port-in in three steps that remembers where the customer left. */
@Component({
  selector: 'app-portability',
  standalone: true,
  imports: [RouterLink, SimStepComponent, DonorStepComponent, CustomerStepComponent],
  templateUrl: './portability.component.html',
  styleUrl: './portability.component.scss',
  // The draft is read in the browser only: the server's (empty) first step isn't reused.
  host: { ngSkipHydration: 'true' },
})
export class PortabilityComponent {
  private browser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly steps = ['Tu SIM DIRECTV', 'Número a traer', 'Autoriza'];
  step = signal(0);
  sim = signal<SimData | null>(null);
  donor = signal<DonorData | null>(null);
  customer = signal<Partial<CustomerData> | null>(null);
  sent = signal<{ number: string; date: string } | null>(null);

  constructor() {
    this.restore();
    effect(() => {
      const draft: Draft = { step: this.step(), sim: this.sim(), donor: this.donor(), customer: this.customer() };
      if (!this.browser || this.sent()) return;
      try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch { /* no storage (private mode) */ }
    });
  }

  back(): void {
    this.step.update(step => Math.max(0, step - 1));
    this.scrollUp();
  }

  onSim(sim: SimData): void {
    // Another line: what was entered for the previous one no longer applies.
    if (this.sim()?.subscriberId !== sim.subscriberId) {
      this.donor.set(null);
      this.customer.set(null);
    }
    this.sim.set(sim);
    this.go(1);
  }

  onDonor(donor: DonorData): void {
    this.donor.set(donor);
    this.go(2);
  }

  onSent(data: CustomerData): void {
    this.sent.set({ number: formatPhone(this.donor()!.donorNumber), date: longDate(data.portinDate) });
    try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* no storage */ }
    this.scrollUp();
  }

  /** A new request after one was sent. */
  restart(): void {
    this.sent.set(null);
    this.sim.set(null);
    this.donor.set(null);
    this.customer.set(null);
    this.step.set(0);
  }

  private go(step: number): void {
    this.step.set(step);
    this.scrollUp();
  }

  private scrollUp(): void {
    if (this.browser) document.getElementById('portabilidad')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private restore(): void {
    if (!this.browser) return;
    let draft: Draft | null = null;
    try { draft = JSON.parse(sessionStorage.getItem(DRAFT_KEY) ?? 'null'); } catch { return; }
    if (!draft) return;
    this.sim.set(draft.sim ?? null);
    this.donor.set(draft.donor ?? null);
    this.customer.set(draft.customer ?? null);
    // Never past a step whose earlier data is missing.
    const reachable = !draft.sim ? 0 : !draft.donor ? 1 : 2;
    this.step.set(Math.min(draft.step ?? 0, reachable));
  }
}

/** 2026-11-28 → "viernes 28 de noviembre" */
function longDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
}
