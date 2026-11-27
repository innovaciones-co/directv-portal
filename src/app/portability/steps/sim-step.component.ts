import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { PortabilityService, SimData, portabilityError } from '../portability.service';
import { onlyDigits } from '../digits';

/** Step 1: the DIRECTV line the number is brought to, proved with the SIM serial's last digits. */
@Component({
  selector: 'dtv-sim-step',
  standalone: true,
  templateUrl: './sim-step.component.html',
})
export class SimStepComponent implements OnInit {
  private service = inject(PortabilityService);

  initial = input<SimData | null>(null);
  done = output<SimData>();

  readonly simDigitsLength = 4;
  number = signal('');
  simDigits = signal('');
  touched = signal(false);
  loading = signal(false);
  error = signal('');

  readonly numberOk = computed(() => /^3[0-9]{9}$/.test(this.number()));
  readonly simDigitsOk = computed(() => new RegExp(`^[0-9]{${this.simDigitsLength}}$`).test(this.simDigits()));

  ngOnInit(): void {
    const initial = this.initial();
    if (initial) {
      this.number.set(initial.directvNumber);
      this.simDigits.set(initial.simDigits);
    }
  }

  onNumber(field: HTMLInputElement): void {
    this.number.set(onlyDigits(field, 10, 'phone'));
  }

  onSimDigits(field: HTMLInputElement): void {
    this.simDigits.set(onlyDigits(field, this.simDigitsLength, 'last'));
  }

  async submit(): Promise<void> {
    this.touched.set(true);
    this.error.set('');
    if (!this.numberOk() || !this.simDigitsOk()) return;

    this.loading.set(true);
    try {
      const sim = await this.service.validateSim(this.number(), this.simDigits());
      if (sim) {
        this.done.emit(sim);
      } else {
        this.error.set(`No encontramos una línea DIRECTV con ese número cuya SIM termine en ${this.simDigits()}. Revisa los dos datos e intenta de nuevo.`);
      }
    } catch (error: any) {
      this.error.set(error?.status === 404
        ? 'No encontramos una línea DIRECTV con ese número. Revísalo e intenta de nuevo.'
        : portabilityError(error));
    } finally {
      this.loading.set(false);
    }
  }
}
