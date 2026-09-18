import { describe, expect, it } from "vitest";

import { normalizeOfficePresenceSnapshot } from "@/lib/office/presence";
import {
  getOfficePresenceActivityText,
  getOfficePresenceEventKey,
} from "@/lib/office/presencePresentation";

describe("normalizeOfficePresenceSnapshot", () => {
  it("retains rich correlated activity for remote agents", () => {
    const snapshot = normalizeOfficePresenceSnapshot({
      workspaceId: "mission-control",
      timestamp: "2026-09-18T01:00:00Z",
      agents: [
        {
          agentId: "forge",
          name: "Forge",
          state: "working",
          preferredDeskId: "desk-forge",
          activity: "tool.completed",
          message: "Tool workspace_run completed in 1200 ms.",
          missionId: "mission-test",
          taskId: "task-test",
          operationId: "0123456789abcdef0123456789abcdef",
          spanId: "0123456789abcdef",
          parentSpanId: "fedcba9876543210",
          acceptanceRound: 2,
          durationMs: 1200,
          success: true,
          updatedAt: "2026-09-18T01:00:01Z",
        },
      ],
    });

    expect(snapshot.agents).toEqual([
      {
        agentId: "forge",
        name: "Forge",
        state: "working",
        preferredDeskId: "desk-forge",
        activity: "tool.completed",
        message: "Tool workspace_run completed in 1200 ms.",
        missionId: "mission-test",
        taskId: "task-test",
        operationId: "0123456789abcdef0123456789abcdef",
        spanId: "0123456789abcdef",
        parentSpanId: "fedcba9876543210",
        acceptanceRound: 2,
        durationMs: 1200,
        success: true,
        updatedAt: "2026-09-18T01:00:01Z",
      },
    ]);
  });

  it("drops invalid optional values without rejecting the agent", () => {
    const snapshot = normalizeOfficePresenceSnapshot({
      agents: [
        {
          agentId: "ember",
          name: "Ember",
          state: "working",
          durationMs: "slow",
          acceptanceRound: Number.NaN,
          success: "yes",
        },
      ],
    });

    expect(snapshot.agents).toEqual([
      {
        agentId: "ember",
        name: "Ember",
        state: "working",
      },
    ]);
  });

  it("prefers a rich message for remote speech bubbles", () => {
    const agent = normalizeOfficePresenceSnapshot({
      agents: [
        {
          agentId: "phoenix",
          name: "Phoenix",
          state: "working",
          activity: "acceptance.completed",
          message: "Mission verified in acceptance round 2.",
          operationId: "mission-2",
          updatedAt: "2026-09-18T01:10:00Z",
        },
      ],
    }).agents[0];

    expect(getOfficePresenceActivityText(agent)).toBe(
      "Mission verified in acceptance round 2."
    );
    expect(getOfficePresenceEventKey(agent)).toContain("mission-2");
    expect(getOfficePresenceEventKey(agent)).toContain(
      "Mission verified in acceptance round 2."
    );
  });
});
