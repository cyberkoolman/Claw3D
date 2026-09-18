import type { OfficeAgentPresence } from "@/lib/office/presence";

export const getOfficePresenceActivityText = (
  agent: OfficeAgentPresence
): string => agent.message?.trim() || agent.activity?.trim() || "";

export const getOfficePresenceEventKey = (
  agent: OfficeAgentPresence
): string =>
  [
    agent.updatedAt,
    agent.operationId,
    agent.spanId,
    agent.taskId,
    agent.state,
    agent.message,
    agent.activity,
  ]
    .map((value) => String(value ?? "").trim())
    .join("|");
