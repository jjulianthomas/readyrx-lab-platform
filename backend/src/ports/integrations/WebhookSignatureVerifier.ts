export interface WebhookSignatureVerificationRequest {
  readonly labId: string;
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly rawBody: string;
  readonly receivedAt: string;
}

export interface WebhookSignatureVerifier {
  verify(request: WebhookSignatureVerificationRequest): Promise<boolean>;
}
