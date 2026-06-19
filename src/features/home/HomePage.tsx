"use client";

import Image from "next/image";
import Link from "next/link";

import { useStores } from "@/store/hooks/useStores";

import "./HomePage.Styles.scss";

type HomePageProps = {
    lang: string;
};

export const HomePage = ({ lang }: HomePageProps) => {
    const { modalStore } = useStores();

    const handleOpenTestModal = () => {
        modalStore.openModal(
            "TEST_MODAL",
            {
                message: "Global modal is connected and receives typed props.",
                openedFrom: "Home page",
            },
            {
                title: "Global modal test",
                width: 520,
            },
        );
    };

    return (
        <main className="home-page">
            <section className="home-page__section">
                <h1 className="home-page__title">Home Page</h1>

                <div className="home-page__links">
                    <Link href={`/${lang}/training`} className="home-page__link-card">
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
                            <h2 className="home-page__card-title">Training</h2>
                            <p className="home-page__card-text">
                                Practice recipes and menu knowledge.
                            </p>
                        </div>
                    </Link>

                    <button
                        type="button"
                        className="home-page__test-button"
                        onClick={handleOpenTestModal}
                    >
                        Test modal
                    </button>
                </div>
            </section>
        </main>
    );
};
