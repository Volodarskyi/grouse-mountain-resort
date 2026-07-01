import "./BottomActionsSection.Styles.scss";

type BottomActionsSectionProps = {
    onNextRecipe: () => void;
    onDone: () => void;
};

export const BottomActionsSection = ({
    onNextRecipe,
    onDone,
}: BottomActionsSectionProps) => {
    return (
        <section className="training-bottom-actions-section">
            <button
                type="button"
                onClick={onNextRecipe}
                className="training-bottom-actions-section__button training-bottom-actions-section__button--secondary"
            >
                Next
            </button>

            <button
                type="button"
                onClick={onDone}
                className="training-bottom-actions-section__button"
            >
                DONE
            </button>
        </section>
    );
};
