import type { IsoDateTimeString } from "../../domain/common/Time";
import type { Clock } from "../../ports/services/Clock";

export class SystemClock implements Clock {
  public now(): IsoDateTimeString {
    return new Date().toISOString();
  }
}
