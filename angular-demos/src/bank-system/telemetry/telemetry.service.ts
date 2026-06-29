import { Injectable } from '@angular/core';

export interface TelemetryEvent {
  name: string;
  properties: Record<string, string | number | boolean>;
}

@Injectable()
export class TelemetryService {
  readonly events: TelemetryEvent[] = [];

  track(name: string, properties: Record<string, string | number | boolean> = {}): void {
    this.events.unshift({ name, properties });
    this.events.splice(8);
  }
}
