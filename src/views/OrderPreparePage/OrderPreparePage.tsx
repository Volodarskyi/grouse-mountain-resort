"use client";

import Link from "next/link";

import { useStores } from "@/store/hooks/useStores";

import "./OrderPreparePage.Styles.scss";

type PrepareColumn = {
    description: string;
    key: string;
    title: string;
};

type OrderPreparePageProps = {
    locationHref: string;
    locationName: string;
    navigationLinks: Array<{
        href: string;
        label: string;
    }>;
    organizationHref: string;
    organizationName: string;
};

const prepareColumns: PrepareColumn[] = [
    {
        key: "front-desk",
        title: "Front Desk",
        description: "Accept, assemble, pack, and hand orders to guests.",
    },
    {
        key: "kitchen",
        title: "Kitchen",
        description: "Prepare grill, hot line, sides, and station items.",
    },
    {
        key: "bar",
        title: "Bar",
        description: "Prepare drinks and bar-routed order items.",
    },
    {
        key: "expo",
        title: "Expo / Ready",
        description: "Track ready items, handoff, and pickup status.",
    },
];

export function OrderPreparePage({
    locationHref,
    locationName,
    navigationLinks,
    organizationHref,
    organizationName,
}: OrderPreparePageProps) {
    const { drawerStore } = useStores();

    function openMenuDrawer() {
        drawerStore.openDrawer(
            "ORDER_NAV",
            {
                links: navigationLinks,
            },
            {
                title: "Menu",
                placement: "right",
                size: 340,
            },
        );
    }

    return (
        <main className="order-prepare-page">
            <section className="order-prepare-page__shell">
                <header className="order-prepare-page__header">
                    <div>
                        <h1 className="order-prepare-page__title">
                            Prepare Order
                        </h1>
                        <p className="order-prepare-page__subtitle">
                            <Link href={organizationHref}>
                                {organizationName}
                            </Link>
                            <span> / </span>
                            <Link href={locationHref}>{locationName}</Link>
                        </p>
                    </div>

                    <button
                        type="button"
                        className="order-prepare-page__menu-button"
                        aria-label="Open order menu"
                        onClick={openMenuDrawer}
                    >
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                    </button>
                </header>

                <section className="order-prepare-page__board-header">
                    <p className="order-prepare-page__eyebrow">Production</p>
                    <h2>Production Board</h2>
                </section>

                <section
                    className="order-prepare-page__board"
                    aria-label="Order preparation areas"
                >
                    {prepareColumns.map((column) => (
                        <section
                            key={column.key}
                            className="order-prepare-page__column"
                        >
                            <header className="order-prepare-page__column-header">
                                <div>
                                    <h2>{column.title}</h2>
                                    <p>{column.description}</p>
                                </div>
                                <span className="order-prepare-page__count">
                                    0
                                </span>
                            </header>

                            <div className="order-prepare-page__work-area">
                                <div className="order-prepare-page__empty">
                                    <span>No active orders</span>
                                </div>
                            </div>
                        </section>
                    ))}
                </section>
            </section>
        </main>
    );
}
