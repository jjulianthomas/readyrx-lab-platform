import type { LabId } from "../../../domain/common/Identifiers";
import type { Lab } from "../../../domain/labs/Lab";
import type { LabRepository } from "../../../ports/repositories/LabRepository";
import type { JsonCollection } from "./JsonCollection";

export class JsonLabRepository implements LabRepository {
  public constructor(private readonly labs: JsonCollection<Lab>) {}

  public async findById(id: LabId): Promise<Lab | undefined> {
    return this.labs.findById(id);
  }

  public async listActive(): Promise<readonly Lab[]> {
    const labs = await this.labs.all();
    return labs.filter((lab) => lab.active);
  }
}
