import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '../services/config.service';

/** The customer's DIRECTV line, validated in step 1. */
export interface SimData {
  directvNumber: string;   // 10 digits, without 57
  simDigits: string;       // last 4 digits of the SIM serial
  subscriberId: number;
  /** Signed by the backend once the SIM is proved; the NIP and the port-in need it. */
  portPass: string;
  // From the line's owner, to fill step 3 in (always editable there).
  holder?: { fullName?: string; documentType?: string; documentId?: string; address?: string };
}

/** Whether the SIM proof is there and still has a few minutes left (read from the pass itself). */
export function portPassValid(sim: SimData | null | undefined): boolean {
  if (!sim?.portPass) return false;
  try {
    const payload = JSON.parse(atob(sim.portPass.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now() + 5 * 60 * 1000;
  } catch {
    return false;
  }
}

/** The number being brought, from step 2. */
export interface DonorData {
  donorNumber: string;     // 10 digits, without 57
  operatorCode: string;
  operatorName: string;
  plan: 'PREPAID' | 'POSTPAID' | '';
}

/** Step 3: the NIP, the date and the owner's data, as the operator has them. */
export interface CustomerData {
  nip: string;
  portinDate: string;      // YYYY-MM-DD
  subscriberType: 'NATURAL' | 'COMPANY' | '';
  fullName: string;
  documentType: string;
  documentId: string;
  documentIssueDate: string; // YYYY-MM-DD
  address: string;
}

// Errors the portability platform answers with, said so a customer understands them.
const PLATFORM_ERRORS: Record<number, string> = {
  1020080013: 'Ya hay una portabilidad en curso para este número o ya se pidió el máximo de códigos NIP permitidos. Si ya te llegó el NIP, continúa con "Ya tengo mi NIP".',
  1020080014: 'No pudimos validar los datos del titular del número.',
  1037000001: 'No encontramos una línea DIRECTV con estos datos.',
  1024020001: 'El servicio de portabilidad no está disponible en este momento. Intenta de nuevo en unos minutos.',
  1024020002: 'El servicio de portabilidad tardó demasiado en responder. Intenta de nuevo en unos minutos.',
};

const GENERIC_ERROR = 'No pudimos procesar tu solicitud. Intenta de nuevo en unos minutos o comunícate con la línea de atención 01 8000 423 690.';

// The backend's own refusals (attempt limits, SIM proof missing or expired): its message is
// already written for the customer.
const BACKEND_CODES = ['TOO_MANY_ATTEMPTS', 'LINE_LOCKED', 'PORT_PASS_REQUIRED', 'PORT_PASS_EXPIRED'];

/** A customer-facing message for a failed call: never the platform's technical text. */
export function portabilityError(error: any): string {
  const body = error?.error;
  if (BACKEND_CODES.includes(body?.code) && typeof body?.message === 'string') return body.message;
  const code = Number(error?.responseCode ?? body?.responseCode ?? body?.error?.responseCode);
  return PLATFORM_ERRORS[code] ?? GENERIC_ERROR;
}

/** The DIRECTV backend (/api-dtv) calls the port-in needs. Numbers go with 57 in front. */
@Injectable({ providedIn: 'root' })
export class PortabilityService {
  private http = inject(HttpClient);
  private api = `${inject(ConfigService).apiBaseUrl}/api-dtv`;

  /** The line with that number whose SIM serial ends in those digits, or null. */
  async validateSim(directvNumber: string, simDigits: string): Promise<SimData | null> {
    // The backend checks the serial digits and only then returns the owner (and the port pass).
    let response: any;
    try {
      response = await firstValueFrom(
        this.http.post<any>(`${this.api}/validateSim`, { phoneNumber: '57' + directvNumber, simDigits })
      );
    } catch (error: any) {
      if (error?.status === 404) return null;
      throw error;
    }
    if (response?.subscriberId == null || !response?.portPass) return null;

    return {
      directvNumber,
      simDigits,
      subscriberId: Number(response.subscriberId),
      portPass: response.portPass,
      holder: response.holder ?? undefined,
    };
  }

  /** The operator the number is with today, or null when it can't be told. */
  async lookupOperator(donorNumber: string): Promise<{ code: string; name: string } | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<any>(`${this.api}/getNetworkOperator`, { params: { phoneNumber: '57' + donorNumber } })
      );
      const code = response?.payload?.operatorCode;
      if (!code) return null;
      return { code, name: response?.payload?.operatorName || 'Operador detectado' };
    } catch {
      return null;
    }
  }

  /** Asks the current operator to text the NIP to the number being brought. Throws on failure. */
  async requestNip(sim: SimData, donor: DonorData): Promise<void> {
    const response = await firstValueFrom(this.http.post<any>(`${this.api}/postSendAuthentication`, {
      phoneNumber: '57' + donor.donorNumber,
      subscriberId: sim.subscriberId,
      operatorCode: donor.operatorCode,
      portPass: sim.portPass,
    }));
    if (Number(response?.responseCode) !== 0) throw response;
  }

  /** Sends the port-in request. Throws on failure. */
  async submit(sim: SimData, donor: DonorData, customer: CustomerData): Promise<void> {
    // The port happens at night: the chosen day, 9:00 a.m. Colombia, as the portal always sent it.
    const requestedFutureDate = new Date(`${customer.portinDate}T09:00:00-05:00`).toISOString();

    const response = await firstValueFrom(this.http.put<any>(`${this.api}/portInRequest`, {
      subscriberId: String(sim.subscriberId),
      portPass: sim.portPass,
      authCode: customer.nip,
      donorOperator: donor.operatorCode,
      newMsisdn: '57' + donor.donorNumber,
      recipientOperator: '00018',
      requestedFutureDate,
      subscriberType: customer.subscriberType,
      transparentData: {
        subscriberIdentityType: customer.documentType,
        subscriberIdentity: customer.documentId,
        subscriberIdentityIssue: customer.documentIssueDate.replace(/-/g, '/'),
        nip: customer.nip,
        subscriberName: customer.fullName.trim(),
        subscriberAddress: customer.address.trim(),
        subscriberServiceType: donor.plan,
      },
    }));
    if (Number(response?.responseCode) !== 0) throw response;
  }
}
