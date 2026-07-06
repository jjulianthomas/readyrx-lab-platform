import type { LabResult } from "../../domain/results/LabResult";
import type {
  ReceiveLabResultCommand,
  ReceiveLabResultUseCase
} from "../results/ReceiveLabResultUseCase";
import { resultFrom, type Result } from "../common/Result";

export class LabResultService {
  public constructor(private readonly receiveResult: ReceiveLabResultUseCase) {}

  public async receive(
    command: ReceiveLabResultCommand
  ): Promise<Result<LabResult>> {
    return resultFrom(() => this.receiveResult.execute(command));
  }
}
