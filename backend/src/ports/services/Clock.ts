import type { IsoDateTimeString } from "../../domain/common/Time";

export interface Clock {
  now(): IsoDateTimeString;
}
