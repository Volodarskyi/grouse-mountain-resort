import "./HeroSection.Styles.scss";

type HeroSectionProps = {
    onOpenTestModal: () => void;
};

export const HeroSection = ({ onOpenTestModal }: HeroSectionProps) => {
    return (
        <section className="home-hero-section">
            <h1 className="home-hero-section__title">Home Page</h1>

            <button
                type="button"
                className="home-hero-section__test-button"
                onClick={onOpenTestModal}
            >
                Test modal
            </button>
        </section>
    );
};
