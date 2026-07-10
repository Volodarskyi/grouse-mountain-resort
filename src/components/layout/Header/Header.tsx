"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import type { Dictionary } from "@/i18n/getDictionary";
import { Locale } from "@/i18n/config";

import './Header.Styles.scss';

type HeaderProps = {
    lang: Locale;
    dictionary: Dictionary;
    homeHref?: string;
};

export function Header({ lang, homeHref = "/org" }: HeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [activeLang, setActiveLang] = useState(lang);

    if (pathname?.includes("/orders/make")) {
        return null;
    }

    function handleLanguageChange(nextLang: "en" | "fr") {
        if (nextLang === lang || !pathname) return;

        setActiveLang(nextLang);

        const nextPath = pathname.replace(`/${lang}`, `/${nextLang}`);

        window.setTimeout(() => {
            router.push(nextPath);
        }, 220);
    }

    return (
        <header className="header">
            <Link
                href={homeHref}
                className="header__logo"
                aria-label="Grouse Mountain Resort"
            >
                <Image
                    src="/assets/logo/GMR_logo_white.png"
                    alt="Grouse Mountain Resort"
                    width={280}
                    height={90}
                    priority
                    className="header__logo-image"
                />
                <div className="header__logo-text">
                    <span>Grouse</span>
                    <span>Mountain</span>
                </div>
            </Link>

            <div className="header__actions">
                <div className="header__language-switcher">
      <span
          className={`header__language-indicator ${
              activeLang === "fr"
                  ? "header__language-indicator--right"
                  : ""
          }`}
      />

                    <button
                        type="button"
                        onClick={() => handleLanguageChange("en")}
                        className={`header__language-button ${
                            activeLang === "en"
                                ? "header__language-button--active"
                                : ""
                        }`}
                    >
                        EN
                    </button>

                    <button
                        type="button"
                        onClick={() => handleLanguageChange("fr")}
                        className={`header__language-button ${
                            activeLang === "fr"
                                ? "header__language-button--active"
                                : ""
                        }`}
                    >
                        FR
                    </button>
                </div>
            </div>
        </header>
    );
}
