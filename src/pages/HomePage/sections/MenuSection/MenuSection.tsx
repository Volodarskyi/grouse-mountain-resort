import Image from "next/image";
import Link from "next/link";

import "./MenuSection.Styles.scss";

type MenuSectionProps = {
    lang: string;
};

export const MenuSection = ({ lang }: MenuSectionProps) => {
    return (
        <section className="home-menu-section">
            <Link href={`/${lang}/training`} className="home-menu-section__link-card">
                <div className="home-menu-section__icon-wrapper">
                    <Image
                        src="/assets/icons/icon-chef.png"
                        alt="Training"
                        width={48}
                        height={48}
                        className="home-menu-section__icon"
                    />
                </div>

                <div className="home-menu-section__content">
                    <h2 className="home-menu-section__card-title">Training</h2>
                    <p className="home-menu-section__card-text">
                        Practice recipes and menu knowledge.
                    </p>
                </div>
            </Link>
        </section>
    );
};
