import { readFile } from "node:fs/promises";

export interface IdentifiableDocument {
  readonly id: string;
}

/** JSON seed collection with runtime-only writes; no disk persistence. */
export class JsonCollection<TDocument extends IdentifiableDocument> {
  private documents: TDocument[] | undefined;

  public constructor(private readonly filePath: string) {}

  public async all(): Promise<readonly TDocument[]> {
    if (this.documents === undefined) {
      this.documents = await this.loadSeedData();
    }

    return this.documents.map(cloneDocument);
  }

  public async findById(id: string): Promise<TDocument | undefined> {
    const documents = await this.all();
    return documents.find((document) => document.id === id);
  }

  public async upsert(document: TDocument): Promise<void> {
    const documents = [...(await this.all())];
    const index = documents.findIndex((item) => item.id === document.id);

    if (index === -1) {
      documents.push(cloneDocument(document));
    } else {
      documents[index] = cloneDocument(document);
    }

    this.documents = documents;
  }

  private async loadSeedData(): Promise<TDocument[]> {
    const raw = await readFile(this.filePath, "utf8");
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      throw new Error(`JSON collection '${this.filePath}' must be an array`);
    }

    return (parsed as TDocument[]).map(cloneDocument);
  }
}

function cloneDocument<TDocument>(document: TDocument): TDocument {
  return structuredClone(document);
}
