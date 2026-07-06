import { describe, expect, it } from "vitest";
import { QuestHl7Mapper } from "../src/infrastructure/integrations/quest-hl7/QuestHl7Mapper";

describe("QuestHl7Mapper", () => {
  it("parses an ORU result message into normalized lab results", () => {
    const mapper = new QuestHl7Mapper();
    const message = [
      "MSH|^~\\&|QUEST|lab_quest|LABPLATFORM|LABPLATFORM|20250405163100||ORU^R01|msg-1|P|2.5.1",
      "PID|||patient_001||Morgan^Avery||1988-04-12|F",
      "ORC|RE|order_lipid_apr|quest-order-lipid-apr",
      "OBR|1|order_lipid_apr|Q-APR-200|Q-LIPID-100^Lipid Panel|||2025-04-05T09:00:00.000Z|||||||||||||||2025-04-05T16:30:00.000Z|||F",
      "OBX|1|NM|18262-6^LDL Cholesterol||118|mg/dL|0-100|H|||F|||2025-04-05T09:00:00.000Z"
    ].join("\r");

    const result = mapper.fromResultMessage({
      messageType: "ORU",
      content: message
    });

    expect(result.labId).toBe("lab_quest");
    expect(result.labOrderId).toBe("order_lipid_apr");
    expect(result.biomarkers[0]?.displayName).toBe("LDL Cholesterol");
    expect(result.biomarkers[0]?.flag).toBe("high");
  });

  it("rejects non-numeric OBX values", () => {
    const mapper = new QuestHl7Mapper();
    const message = [
      "MSH|^~\\&|QUEST|lab_quest|LABPLATFORM|LABPLATFORM|20250405163100||ORU^R01|msg-2|P|2.5.1",
      "PID|||patient_001||Morgan^Avery||1988-04-12|F",
      "ORC|RE|order_lipid_apr|quest-order-lipid-apr",
      "OBR|1|order_lipid_apr|Q-APR-200|Q-LIPID-100^Lipid Panel|||2025-04-05T09:00:00.000Z|||||||||||||||2025-04-05T16:30:00.000Z|||F",
      "OBX|1|NM|18262-6^LDL Cholesterol||not-a-number|mg/dL|0-100|H|||F|||2025-04-05T09:00:00.000Z"
    ].join("\r");

    expect(() =>
      mapper.fromResultMessage({ messageType: "ORU", content: message })
    ).toThrow("must be numeric");
  });
});
