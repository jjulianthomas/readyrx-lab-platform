export class IntegrationFailure extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "IntegrationFailure";
  }
}
