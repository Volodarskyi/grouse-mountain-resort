import type { RecipeDetailModalProps } from "@/store/reducers/modalStore";

export default function RecipeDetail({
    recipeId,
    recipeName,
    description,
}: RecipeDetailModalProps) {
    return (
        <div className="app-modal-body">
            <div>
                <div className="app-modal-body__title">{recipeName}</div>
                {description && (
                    <p className="app-modal-body__text">{description}</p>
                )}
            </div>

            <div className="app-modal-body__meta">
                Recipe ID: <strong>{recipeId}</strong>
            </div>
        </div>
    );
}
