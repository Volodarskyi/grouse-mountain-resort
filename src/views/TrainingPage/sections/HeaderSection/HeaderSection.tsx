import "./HeaderSection.Styles.scss";

type HeaderSectionProps = {
    recipeTitle: string;
};

export const HeaderSection = ({ recipeTitle }: HeaderSectionProps) => {
    return (
        <section className="training-header-section">
            <span className="training-header-section__label">Make:</span>
            <span className="training-header-section__recipe-name">{recipeTitle}</span>
        </section>
    );
};
