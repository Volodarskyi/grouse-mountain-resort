import { UiButton } from "@/components/Ui/UiButton/UiButton";

import "./OrdersPlaceholderPage.Styles.scss";

type OrdersPlaceholderPageProps = {
    backHref: string;
    description: string;
    eyebrow: string;
    title: string;
};

export function OrdersPlaceholderPage({
    backHref,
    description,
    eyebrow,
    title,
}: OrdersPlaceholderPageProps) {
    return (
        <main className="orders-placeholder-page">
            <section className="orders-placeholder-page__header">
                <p className="orders-placeholder-page__eyebrow">{eyebrow}</p>
                <h1 className="orders-placeholder-page__title">{title}</h1>
                <p className="orders-placeholder-page__description">
                    {description}
                </p>
            </section>

            <UiButton href={backHref} variant="secondary">
                Back to Orders
            </UiButton>
        </main>
    );
}
