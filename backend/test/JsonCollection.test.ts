import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { JsonCollection } from "../src/infrastructure/persistence/json-firestore/JsonCollection";

interface TestDocument {
  readonly id: string;
  readonly nested: { value: string };
}

describe("JsonCollection", () => {
  it("clones documents across reads and writes", async () => {
    const dir = await mkdtemp(join(tmpdir(), "lab-platform-json-"));
    const file = join(dir, "items.json");
    await writeFile(file, JSON.stringify([{ id: "one", nested: { value: "a" } }]));
    const collection = new JsonCollection<TestDocument>(file);

    const firstRead = await collection.findById("one");
    if (firstRead === undefined) {
      throw new Error("Expected seeded document");
    }
    firstRead.nested.value = "mutated";

    const secondRead = await collection.findById("one");
    expect(secondRead?.nested.value).toBe("a");
  });
});
