"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import {
    getActiveOrders,
    type OrderDto,
} from "@/features/orders/api/ordersApi";
import { isOrderItemDone } from "@/features/orders/lib/orderWorkflow";
import { useStores } from "@/store/hooks/useStores";
import type { ProductionArea } from "@/features/workstations/model/workstationConstants";

import "./OrderPreparePage.Styles.scss";

type PrepareColumn = {
    description: string;
    key: ProductionArea;
    title: string;
};

type OrderPreparePageProps = {
    locationHref: string;
    locationName: string;
    locationSlug: string;
    navigationLinks: Array<{
        href: string;
        label: string;
    }>;
    organizationHref: string;
    organizationName: string;
    organizationSlug: string;
    stationHrefs: Partial<Record<ProductionArea, string>>;
};

type ColumnOrder = {
    createdAt: string;
    id: string;
    itemCount: number;
    orderNumber: string;
};

const prepareColumns: PrepareColumn[] = [
    {
        key: "front_desk",
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

function formatElapsedWaitTime(createdAt: string, now: number) {
    const createdAtTime = new Date(createdAt).getTime();

    if (!createdAt || Number.isNaN(createdAtTime)) {
        return "00:00";
    }

    const elapsedSeconds = Math.max(0, Math.floor((now - createdAtTime) / 1000));
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatOrderNumber(orderNumber: string) {
    return orderNumber.padStart(7, "0");
}

function isExpoVisibleOrder(order: OrderDto) {
    return order.status !== "completed" && order.status !== "cancelled";
}

function hasPendingStationItems(order: OrderDto, productionArea: ProductionArea) {
    return order.items.some(
        (item) =>
            item.productionArea === productionArea &&
            item.status !== "cancelled" &&
            !isOrderItemDone(item.status),
    );
}

function getColumnOrders(
    orders: OrderDto[],
    productionArea: ProductionArea,
): ColumnOrder[] {
    return orders
        .map((order) => {
            const isExpoColumn = productionArea === "expo";
            const isExpoVisible = isExpoVisibleOrder(order);
            const itemCount =
                isExpoColumn || hasPendingStationItems(order, productionArea)
                    ? order.items
                          .filter((item) =>
                              isExpoColumn
                                  ? true
                                  : item.productionArea === productionArea,
                          )
                          .reduce((sum, item) => sum + item.quantity, 0)
                    : 0;
            const isColumnVisible = isExpoColumn
                ? isExpoVisible
                : hasPendingStationItems(order, productionArea);

            return {
                createdAt: order.createdAt,
                id: order.id,
                itemCount: isColumnVisible ? itemCount : 0,
                orderNumber: formatOrderNumber(order.orderNumber),
            };
        })
        .filter((order) => order.itemCount > 0);
}

export function OrderPreparePage({
    locationHref,
    locationName,
    locationSlug,
    navigationLinks,
    organizationHref,
    organizationName,
    organizationSlug,
    stationHrefs,
}: OrderPreparePageProps) {
    const { drawerStore } = useStores();
    const [now, setNow] = useState(() => Date.now());
    const { data: orders = [] } = useQuery({
        queryFn: () => getActiveOrders(organizationSlug, locationSlug),
        queryKey: ["orders", organizationSlug, locationSlug],
        refetchOnMount: "always",
        refetchInterval: 3000,
    });

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, []);

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
                    <Link
                        href={locationHref}
                        className="order-prepare-page__back-button"
                        aria-label={`Back to ${locationName}`}
                    >
                        <Image
                            src="/assets/icons/icon-back.svg"
                            alt=""
                            width={28}
                            height={28}
                            aria-hidden="true"
                        />
                    </Link>

                    <div className="order-prepare-page__header-content">
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
                    <h2>Production Board</h2>
                </section>

                <section
                    className="order-prepare-page__board"
                    aria-label="Order preparation areas"
                >
                    {prepareColumns.map((column) => {
                        const columnOrders = getColumnOrders(orders, column.key);
                        const content = (
                            <>
                                <header className="order-prepare-page__column-header">
                                    <div>
                                        <h2>{column.title}</h2>
                                        <p>{column.description}</p>
                                    </div>
                                    <span className="order-prepare-page__count">
                                        {columnOrders.length}
                                    </span>
                                </header>

                                <div className="order-prepare-page__work-area">
                                    {columnOrders.length > 0 ? (
                                        columnOrders.map((order) => (
                                            <OrderPrepareSummary
                                                key={order.id}
                                                now={now}
                                                order={order}
                                            />
                                        ))
                                    ) : (
                                        <div className="order-prepare-page__empty">
                                            <span>No active orders</span>
                                        </div>
                                    )}
                                </div>
                            </>
                        );

                        const stationHref = stationHrefs[column.key];

                        if (stationHref) {
                            return (
                                <Link
                                    key={column.key}
                                    href={stationHref}
                                    className="order-prepare-page__column order-prepare-page__column--link"
                                >
                                    {content}
                                </Link>
                            );
                        }

                        return (
                            <section
                                key={column.key}
                                className="order-prepare-page__column"
                            >
                                {content}
                            </section>
                        );
                    })}
                </section>
            </section>
        </main>
    );
}

function OrderPrepareSummary({
    now,
    order,
}: {
    now: number;
    order: ColumnOrder;
}) {
    return (
        <div className="order-prepare-page__order-row">
            <span>
                ORDER:<strong>{order.orderNumber}</strong>
            </span>
            <span>
                WAIT:
                <strong>{formatElapsedWaitTime(order.createdAt, now)}</strong>
            </span>
            <span>
                ITEMS:<strong>{order.itemCount}</strong>
            </span>
        </div>
    );
}
