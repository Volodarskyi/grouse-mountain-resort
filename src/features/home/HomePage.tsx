import Image from "next/image";
import Link from "next/link";

import "./HomePage.Styles.scss";

type HomePageProps = {
    lang: string;
};

export const HomePage = ({ lang }: HomePageProps) => {
    return (
        <main className="home-page">
            <section className="home-page__section">
                <h1 className="home-page__title">Home Page</h1>

                <div className="home-page__links">
                    <Link
                        href={`/${lang}/training`}
                        className="home-page__link-card"
                    >
                        <div className="home-page__icon-wrapper">
                            <Image
                                src="/assets/icons/icon-chef.png"
                                alt="Training"
                                width={48}
                                height={48}
                                className="home-page__icon"
                            />
                        </div>

                        <div className="home-page__content">
                            <h2 className="home-page__card-title">
                                Training
                            </h2>

                            <p className="home-page__card-text">
                                Practice recipes and menu knowledge.
                            </p>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
};