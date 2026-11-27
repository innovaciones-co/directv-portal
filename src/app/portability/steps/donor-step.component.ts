import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { DonorData, PortabilityService, SimData, portabilityError } from '../portability.service';
import { onlyDigits } from '../digits';

/** Step 2: the number being brought. Its operator is detected, then it texts the NIP. */
@Component({
  selector: 'dtv-donor-step',
  standalone: true,
  templateUrl: './donor-step.component.html',
})
export class DonorStepComponent implements OnInit {
  private service = inject(PortabilityService);

  sim = input.required<SimData>();
  initial = input<DonorData | null>(null);
  done = output<DonorData>();

  readonly plans = [
    { label: 'Prepago', value: 'PREPAID' as const },
    { label: 'Pospago', value: 'POSTPAID' as const },
  ];

  number = signal('');
  confirm = signal('');
  plan = signal<DonorData['plan']>('');
  operator = signal<{ code: string; name: string } | null>(null);
  lookingUp = signal(false);
  operatorMissing = signal(false);
  touched = signal(false);
  loading = signal(false);
  error = signal('');

  readonly numberOk = computed(() => /^3[0-9]{9}$/.test(this.number()));
  readonly matches = computed(() => this.numberOk() && this.number() === this.confirm());
  readonly sameAsDirectv = computed(() => this.numberOk() && this.number() === this.sim().directvNumber);
  readonly ready = computed(() => this.matches() && !this.sameAsDirectv() && !!this.operator() && !!this.plan());

  private lookupFor = '';

  ngOnInit(): void {
    const initial = this.initial();
    if (initial) {
      this.number.set(initial.donorNumber);
      this.confirm.set(initial.donorNumber);
      this.plan.set(initial.plan);
      this.operator.set({ code: initial.operatorCode, name: initial.operatorName });
      this.lookupFor = initial.donorNumber;
    }
  }

  onNumber(which: 'number' | 'confirm', field: HTMLInputElement): void {
    this[which].set(onlyDigits(field, 10, 'phone'));
    this.error.set('');
    this.detectOperator();
  }

  /** Once both fields match, find out the number's current operator (once per number). */
  private async detectOperator(): Promise<void> {
    if (!this.matches() || this.sameAsDirectv()) {
      if (this.number() !== this.lookupFor) {
        this.operator.set(null);
        this.lookupFor = '';
      }
      this.lookingUp.set(false);
      this.operatorMissing.set(false);
      return;
    }
    const number = this.number();
    if (number === this.lookupFor) return;
    this.lookupFor = number;
    this.operator.set(null);
    this.operatorMissing.set(false);
    this.lookingUp.set(true);
    const operator = await this.service.lookupOperator(number);
    if (this.number() !== number) return; // typed something else meanwhile
    this.lookingUp.set(false);
    this.operator.set(operator);
    this.operatorMissing.set(!operator);
    if (!operator) this.lookupFor = '';
  }

  private data(): DonorData {
    const operator = this.operator()!;
    return { donorNumber: this.number(), operatorCode: operator.code, operatorName: operator.name, plan: this.plan() };
  }

  async requestNip(): Promise<void> {
    this.touched.set(true);
    this.error.set('');
    if (!this.ready()) return;

    this.loading.set(true);
    try {
      const donor = this.data();
      await this.service.requestNip(this.sim(), donor);
      this.done.emit(donor);
    } catch (error: any) {
      this.error.set(error?.status === 429
        ? 'Ya se enviaron varios códigos NIP a este número. Si ya te llegó uno, continúa con "Ya tengo mi NIP".'
        : portabilityError(error));
    } finally {
      this.loading.set(false);
    }
  }

  /** The NIP was already texted (a process left halfway, or a second try): go on without another. */
  haveNip(): void {
    this.touched.set(true);
    if (this.ready()) this.done.emit(this.data());
  }
}
