import { model, models, Schema, type InferSchemaType } from "mongoose";

const recipeStepSchema = new Schema(
    {
        stepNumber: {
            type: Number,
            required: true,
            min: 1,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        durationSeconds: {
            type: Number,
            default: 0,
            min: 0,
        },
        imageUrl: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        _id: false,
    },
);

const recipeIngredientSchema = new Schema(
    {
        ingredientCode: {
            type: String,
            required: true,
            trim: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
        },
        unit: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        _id: false,
    },
);

const recipeSchema = new Schema(
    {
        organizationId: {
            type: Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },
        locationIds: [
            {
                type: Schema.Types.ObjectId,
                ref: "Location",
            },
        ],
        code: {
            type: String,
            required: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        videoUrl: {
            type: String,
            trim: true,
            default: "",
        },
        steps: {
            type: [recipeStepSchema],
            default: [],
        },
        ingredients: {
            type: [recipeIngredientSchema],
            default: [],
        },
        createdByUserId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    },
);

recipeSchema.index({ organizationId: 1, code: 1 }, { unique: true });
recipeSchema.index({ organizationId: 1, locationIds: 1 });

export type RecipeDocument = InferSchemaType<typeof recipeSchema>;

const RecipeModel = models.Recipe || model("Recipe", recipeSchema);

export default RecipeModel;
