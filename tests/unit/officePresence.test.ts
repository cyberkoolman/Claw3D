import { describe, expect, it } from "vitest";

import { normalizeOfficePresenceSnapshot } from "@/lib/office/presence";

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
});
