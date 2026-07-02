import { model, models, Schema, type InferSchemaType } from "mongoose";

export const userStatuses = [
    "new",
    "pending",
    "active",
    "updated",
    "fired",
] as const;

const userSkillSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        rank: {
            type: Number,
            required: true,
            min: 0,
            max: 10,
        },
    },
    {
        _id: false,
    },
);

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        secondName: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
            default: "",
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            trim: true,
        },
        organizationId: {
            type: Schema.Types.ObjectId,
            ref: "Organization",
        },
        locations: [
            {
                type: Schema.Types.ObjectId,
                ref: "Location",
            },
        ],
        departmentId: {
            type: Schema.Types.ObjectId,
            ref: "Department",
        },
        skills: {
            type: [userSkillSchema],
            default: [],
        },
        status: {
            type: String,
            enum: userStatuses,
            default: "new",
        },
    },
    {
        timestamps: true,
    },
);

export type UserStatus = (typeof userStatuses)[number];
export type UserDocument = InferSchemaType<typeof userSchema>;

export const User = models.User || model("User", userSchema);
