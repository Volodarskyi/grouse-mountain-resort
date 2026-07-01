import "./HeroSection.Styles.scss";

type HeroSectionProps = {
    onOpenTestModal: () => void;
    title: string;
};

export const HeroSection = ({ onOpenTestModal, title }: HeroSectionProps) => {
    return (
        <section className="home-hero-section">
            <h1 className="home-hero-section__title">{title}</h1>

            {/*<button*/}
            {/*    type="button"*/}
            {/*    className="home-hero-section__test-button"*/}
            {/*    onClick={onOpenTestModal}*/}
            {/*>*/}
            {/*    Test modal*/}
            {/*</button>*/}
        </section>
    );
};
