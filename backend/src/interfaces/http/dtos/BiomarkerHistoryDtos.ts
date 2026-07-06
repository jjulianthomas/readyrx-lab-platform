export interface BiomarkerHistoryPointDto {
  readonly observedAt: string;
  readonly value: number;
  readonly unit: string;
  readonly flag: string;
  readonly labResultId: string;
}

export interface BiomarkerHistoryResponseDto {
  readonly patientId: string;
  readonly biomarkerId: string;
  readonly displayName: string;
  readonly points: readonly BiomarkerHistoryPointDto[];
}
