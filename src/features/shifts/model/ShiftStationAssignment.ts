import { model, models, Schema, type InferSchemaType } from "mongoose";

import { shiftAssignmentRoles } from "./shiftConstants";

const shiftStationAssignmentSchema = new Schema(
    {
        organizationId: {
            type: Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },
        locationId: {
            type: Schema.Types.ObjectId,
            ref: "Location",
            required: true,
        },
        shiftId: {
            type: Schema.Types.ObjectId,
            ref: "Shift",
            required: true,
        },
        workstationId: {
            type: Schema.Types.ObjectId,
            ref: "Workstation",
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            enum: shiftAssignmentRoles,
            default: "owner",
        },
        startedAt: {
            type: Date,
        },
        endedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    },
);

shiftStationAssignmentSchema.index({
    organizationId: 1,
    locationId: 1,
    shiftId: 1,
    workstationId: 1,
});
shiftStationAssignmentSchema.index({ shiftId: 1, userId: 1 });

export type ShiftStationAssignmentDocument = InferSchemaType<
    typeof shiftStationAssignmentSchema
>;

const ShiftStationAssignmentModel =
    models.ShiftStationAssignment ||
    model("ShiftStationAssignment", shiftStationAssignmentSchema);

export default ShiftStationAssignmentModel;
