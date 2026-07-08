export const shiftStatuses = ["planned", "active", "closed"] as const;

export type ShiftStatus = (typeof shiftStatuses)[number];

export const shiftAssignmentRoles = ["owner", "helper"] as const;

export type ShiftAssignmentRole = (typeof shiftAssignmentRoles)[number];
