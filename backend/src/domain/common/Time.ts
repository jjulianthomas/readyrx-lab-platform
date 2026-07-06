export type IsoDateString = string;
export type IsoDateTimeString = string;

export interface Timestamped {
  readonly createdAt: IsoDateTimeString;
  readonly updatedAt: IsoDateTimeString;
}
