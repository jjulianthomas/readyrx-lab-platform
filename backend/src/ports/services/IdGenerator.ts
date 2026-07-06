export interface IdGenerator {
  create(prefix: string): string;
}
