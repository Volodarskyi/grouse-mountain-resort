"use client";

import { useStores } from "@/store/hooks/useStores";

import { HeroSection } from "./sections/HeroSection/HeroSection";
import { MenuSection } from "./sections/MenuSection/MenuSection";

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
            <HeroSection onOpenTestModal={handleOpenTestModal} />
            <MenuSection lang={lang} />
        </main>
    );
};
