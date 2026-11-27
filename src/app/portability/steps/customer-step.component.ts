import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { CustomerData, DonorData, PortabilityService, SimData, portabilityError } from '../portability.service';
import { formatPhone, onlyDigits } from '../digits';

type Field = keyof CustomerData;

/** YYYY-MM-DD of today plus `days`, in the customer's time zone. */
function isoDay(days = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

/** "mañana, vie 28 nov" */
function tomorrowLabel(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const day = date.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })
    .replace(/[.,]/g, '').replace(' de ', ' ');
  return `mañana, ${day}`;
}

const EMPTY: CustomerData = {
  nip: '', portinDate: '', subscriberType: 'NATURAL', fullName: '', documentType: '', documentId: '',
  documentIssueDate: '', address: '',
};

/** Step 3: the NIP that authorizes it, the date, and the owner's data as their operator has them. */
@Component({
  selector: 'dtv-customer-step',
  standalone: true,
  templateUrl: './customer-step.component.html',
})
export class CustomerStepComponent implements OnInit {
  private service = inject(PortabilityService);

  sim = input.required<SimData>();
  donor = input.required<DonorData>();
  // What the customer already typed (saved draft): wins over the line's data.
  initial = input<Partial<CustomerData> | null>(null);
  draftChange = output<Partial<CustomerData>>();
  done = output<CustomerData>();

  readonly holderTypes = [
    { label: 'Persona', value: 'NATURAL' as const },
    { label: 'Empresa', value: 'COMPANY' as const },
  ];
  readonly documentTypes = [
    { label: 'Cédula', value: 'ID' },
    { label: 'Cédula de extranjería', value: 'FOREIGN_ID' },
    { label: 'NIT', value: 'NIT' },
    { label: 'Pasaporte', value: 'PASSPORT' },
  ];

  readonly tomorrow = isoDay(1);
  readonly tomorrowLabel = tomorrowLabel();
  readonly today = isoDay(0);
  readonly donorNumber = computed(() => formatPhone(this.donor().donorNumber));

  form = signal<CustomerData>({ ...EMPTY });
  dateChoice = signal<'soonest' | 'other'>('soonest');
  terms = signal(false);
  touched = signal(false);
  loading = signal(false);
  error = signal('');

  private readonly checks = computed<Record<Field, boolean>>(() => {
    const f = this.form();
    return {
      nip: /^[0-9]{5}$/.test(f.nip),
      portinDate: !!f.portinDate && f.portinDate >= this.tomorrow,
      subscriberType: !!f.subscriberType,
      // A person writes name and surname; a company, its name.
      fullName: f.subscriberType === 'COMPANY' ? f.fullName.trim().length >= 3 : f.fullName.trim().split(/\s+/).length >= 2,
      documentType: !!f.documentType,
      documentId: f.documentType === 'PASSPORT' ? /^[A-Za-z0-9]{5,15}$/.test(f.documentId) : /^[0-9]{5,15}$/.test(f.documentId),
      documentIssueDate: !!f.documentIssueDate && f.documentIssueDate < this.today,
      address: f.address.trim().length >= 5,
    };
  });
  readonly valid = computed(() => Object.values(this.checks()).every(Boolean) && this.terms());

  ngOnInit(): void {
    const draft = this.initial();
    const holder = this.sim().holder ?? {};
    if (draft) {
      this.form.set({ ...EMPTY, ...draft });
    } else {
      this.form.set({
        ...EMPTY,
        fullName: holder.fullName ?? '',
        documentType: this.documentTypes.find(t => sameType(t.value, holder.documentType))?.value ?? '',
        documentId: holder.documentId ?? '',
        address: holder.address ?? '',
      });
    }
    // A date picked earlier stays; none, or one already past, becomes the soonest.
    const date = this.form().portinDate;
    if (date && date >= this.tomorrow && date !== this.tomorrow) {
      this.dateChoice.set('other');
    } else {
      this.chooseSoonest();
    }
  }

  set(field: Field, value: string): void {
    this.form.update(form => ({ ...form, [field]: value }));
    this.error.set('');
    this.draftChange.emit(this.form());
  }

  onDigits(field: 'nip' | 'documentId', input: HTMLInputElement, max: number): void {
    if (field === 'documentId' && this.form().documentType === 'PASSPORT') {
      const value = input.value.replace(/[^A-Za-z0-9]/g, '').slice(0, max).toUpperCase();
      input.value = value;
      this.set(field, value);
      return;
    }
    this.set(field, onlyDigits(input, max));
  }

  chooseSoonest(): void {
    this.dateChoice.set('soonest');
    this.set('portinDate', this.tomorrow);
  }

  invalid(field: Field): boolean {
    return this.touched() && !this.checks()[field];
  }

  async submit(): Promise<void> {
    this.touched.set(true);
    this.error.set('');
    if (!this.valid()) return;

    this.loading.set(true);
    try {
      const data = this.form();
      await this.service.submit(this.sim(), this.donor(), data);
      this.done.emit(data);
    } catch (error: any) {
      this.error.set(portabilityError(error));
    } finally {
      this.loading.set(false);
    }
  }
}

/** The line's document type as the platform names it ("ID", "foreignID"...) against ours. */
function sameType(ours: string, theirs?: string): boolean {
  const normalize = (value: string) => value.replace(/[^a-z]/gi, '').toLowerCase();
  return !!theirs && normalize(ours) === normalize(theirs);
}
