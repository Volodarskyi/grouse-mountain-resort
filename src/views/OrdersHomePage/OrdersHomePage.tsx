import Image from "next/image";

import { UiButton } from "@/components/Ui/UiButton/UiButton";

import "./OrdersHomePage.Styles.scss";

type OrdersHomePageProps = {
    baseHref: string;
};

const orderModules = [
    {
        title: "Make Order",
        description: "Create orders from the restaurant menu.",
        icon: "/assets/icons/horecan/icon-horecan-pos.png",
        status: "",
        href: "make",
        disabled: false,
    },
    {
        title: "Prepare Order",
        description: "Front Desk, Kitchen, Bar, and Expo production board.",
        icon: "/assets/icons/horecan/icon-horecan-meal.png",
        status: "",
        href: "prepare",
        disabled: false,
    },
    {
        title: "Public",
        description: "Guest phone ordering will be added later.",
        icon: "/assets/icons/horecan/icon-horecan-app.png",
        status: "Coming soon",
        href: "",
        disabled: true,
    },
] as const;

export function OrdersHomePage({ baseHref }: OrdersHomePageProps) {
    return (
        <main className="orders-home-page">
            <section className="orders-home-page__header">
                <p className="orders-home-page__eyebrow">Orders</p>
                <h1 className="orders-home-page__title">Order Workflow</h1>
            </section>

            <section className="orders-home-page__grid" aria-label="Order tools">
                {orderModules.map((module) => (
                    <article
                        key={module.title}
                        className={[
                            "orders-home-page__card",
                            module.disabled
                                ? "orders-home-page__card--disabled"
                                : "",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                    >
                        <div className="orders-home-page__card-head">
                            <div className="orders-home-page__image-wrapper">
                                <Image
                                    src={module.icon}
                                    alt={module.title}
                                    fill
                                    sizes="(max-width: 860px) 100vw, 360px"
                                    className="orders-home-page__image"
                                />
                            </div>
                            {module.status ? (
                                <span className="orders-home-page__status">
                                    {module.status}
                                </span>
                            ) : null}
                        </div>

                        <div className="orders-home-page__card-body">
                            <h2 className="orders-home-page__card-title">
                                {module.title}
                            </h2>
                            <p className="orders-home-page__card-text">
                                {module.description}
                            </p>
                        </div>

                        {module.disabled ? (
                            <UiButton type="button" disabled variant="secondary">
                                Disabled
                            </UiButton>
                        ) : (
                            <UiButton href={`${baseHref}/${module.href}`}>
                                Open
                            </UiButton>
                        )}
                    </article>
                ))}
            </section>
        </main>
    );
}
