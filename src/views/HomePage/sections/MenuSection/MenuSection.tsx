import Image from "next/image";
import Link from "next/link";

import "./MenuSection.Styles.scss";

type MenuSectionProps = {
    lang: string;
    basePath?: string;
};

const modules = [
    {
        slug: "training",
        title: "Training",
        description: "Practice recipes and menu knowledge.",
        icon: "/assets/icons/icon-training.svg",
    },
    {
        slug: "orders",
        title: "Orders",
        description: "Track order flow and service status.",
        icon: "/assets/icons/icon-order.svg",
    },
    {
        slug: "kitchen",
        title: "Kitchen",
        description: "Manage prep, stations, and live operations.",
        icon: "/assets/icons/icon-kitchen.svg",
    },
    {
        slug: "menu",
        title: "Menu",
        description: "Manage QR menu sections and items.",
        icon: "/assets/icons/icon-restaurant-menu.svg",
    },
    {
        slug: "recipes",
        title: "Recipes",
        description: "Build recipes with steps, photos, and video.",
        icon: "/assets/icons/icon-cookbook.svg",
    },
    {
        slug: "inventory",
        title: "Inventory",
        description: "Monitor ingredients and stock movement.",
        icon: "/assets/icons/icon-inventory.svg",
    },
    {
        slug: "employees",
        title: "Employees",
        description: "Manage team members, roles, and training.",
        icon: "/assets/icons/icon-chef.svg",
    },
    {
        slug: "reports",
        title: "Reports",
        description: "Review location performance and activity.",
        icon: "/assets/icons/icon-report.svg",
    },
    {
        slug: "settings",
        title: "Settings",
        description: "Configure location preferences and access.",
        icon: "/assets/icons/icon-settings.svg",
    },
];

export const MenuSection = ({ lang, basePath }: MenuSectionProps) => {
    const moduleBasePath = basePath ?? `/${lang}`;

    return (
        <section className="home-menu-section">
            {modules.map((module) => (
                <Link
                    key={module.slug}
                    href={`${moduleBasePath}/${module.slug}`}
                    className="home-menu-section__link-card"
                >
                    <div className="home-menu-section__icon-wrapper">
                        <Image
                            src={module.icon}
                            alt=""
                            width={48}
                            height={48}
                            className="home-menu-section__icon"
                        />
                    </div>

                    <div className="home-menu-section__content">
                        <h2 className="home-menu-section__card-title">
                            {module.title}
                        </h2>
                        <p className="home-menu-section__card-text">
                            {module.description}
                        </p>
                    </div>
                </Link>
            ))}
        </section>
    );
};
