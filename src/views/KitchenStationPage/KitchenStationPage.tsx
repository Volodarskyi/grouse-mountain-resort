"use client";

import { message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
    getActiveOrders,
    updateOrderStatus,
    updateOrderItemStatus,
    type OrderDto,
    type OrderItemDto,
} from "@/features/orders/api/ordersApi";
import { isOrderItemDone } from "@/features/orders/lib/orderWorkflow";
import type { OrderItemStatus } from "@/features/orders/model/Order";
import type { ProductionArea } from "@/features/workstations/model/workstationConstants";
import { useStores } from "@/store/hooks/useStores";

import "./KitchenStationPage.Styles.scss";

type KitchenStationItem = {
    id: string;
    imageUrl: string;
    isDone: boolean;
    modifications: Array<{
        id: string;
        label: string;
        quantity?: number;
        type: "added" | "removed";
    }>;
    name: string;
    previousStatus: OrderItemStatus | "";
    productionArea: ProductionArea;
    status: OrderItemStatus;
};

type KitchenStationOrder = {
    createdAt: string;
    id: string;
    isCompletable: boolean;
    items: KitchenStationItem[];
    notes: string;
    orderNumber: string;
    status: string;
};

type KitchenStationPageProps = {
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
    productionArea?: ProductionArea;
    stationLabel?: string;
    viewMode?: "expo" | "production";
};

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

function formatStatus(status: string) {
    return status.replaceAll("_", " ").toUpperCase();
}

function formatProductionArea(productionArea: ProductionArea) {
    const labels: Record<ProductionArea, string> = {
        bar: "Bar",
        expo: "Expo",
        front_desk: "Front Desk",
        kitchen: "Kitchen",
    };

    return labels[productionArea];
}

function isExpoVisibleOrder(order: OrderDto) {
    return order.status !== "completed" && order.status !== "cancelled";
}

function isOrderCompletable(order: OrderDto) {
    const activeItems = order.items.filter(
        (item) => item.productionArea !== "expo" && item.status !== "cancelled",
    );

    return (
        activeItems.length > 0 &&
        activeItems.every((item) => isOrderItemDone(item.status))
    );
}

function getStationOrders(
    orders: OrderDto[],
    productionArea: ProductionArea,
    viewMode: "expo" | "production",
): KitchenStationOrder[] {
    return orders
        .filter((order) => {
            return viewMode === "expo"
                ? isExpoVisibleOrder(order)
                : order.items.some(
                      (item) =>
                          item.productionArea === productionArea &&
                          !isOrderItemDone(item.status) &&
                          item.status !== "cancelled",
                  );
        })
        .map((order) => {
            const stationItems =
                viewMode === "expo"
                    ? order.items.map((item) => mapKitchenItem(item))
                    : order.items
                          .filter((item) => item.productionArea === productionArea)
                          .map((item) => mapKitchenItem(item));

            return {
                createdAt: order.createdAt,
                id: order.id,
                isCompletable: isOrderCompletable(order),
                items: stationItems,
                notes: order.notes,
                orderNumber: formatOrderNumber(order.orderNumber),
                status: order.status,
            };
        })
        .filter((order) => order.items.length > 0);
}

function mapKitchenItem(item: OrderItemDto): KitchenStationItem {
    return {
        id: item.id,
        imageUrl: item.imageUrl,
        isDone: isOrderItemDone(item.status),
        modifications: item.modifications.map((modification) => ({
            id: `${item.id}-${modification.type}-${modification.code}`,
            label: modification.name,
            quantity: modification.quantity,
            type: modification.type,
        })),
        name: item.quantity > 1 ? `${item.name} x${item.quantity}` : item.name,
        previousStatus: item.previousStatus,
        productionArea: item.productionArea,
        status: item.status,
    };
}

export function KitchenStationPage({
    locationHref,
    locationName,
    locationSlug,
    navigationLinks,
    organizationHref,
    organizationName,
    organizationSlug,
    productionArea = "kitchen",
    stationLabel = "Kitchen",
    viewMode = "production",
}: KitchenStationPageProps) {
    const { drawerStore } = useStores();
    const queryClient = useQueryClient();
    const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
    const [now, setNow] = useState(() => Date.now());
    const { data: orders = [] } = useQuery({
        queryFn: () => getActiveOrders(organizationSlug, locationSlug),
        queryKey: ["orders", organizationSlug, locationSlug],
        refetchOnMount: "always",
        refetchInterval: 3000,
    });
    const stationOrders = useMemo(
        () => getStationOrders(orders, productionArea, viewMode),
        [orders, productionArea, viewMode],
    );
    const currentOrder = stationOrders[currentOrderIndex];
    const updateItemMutation = useMutation({
        mutationFn: ({
            itemId,
            orderId,
            status,
        }: {
            itemId: string;
            orderId: string;
            status: OrderItemStatus;
        }) =>
            updateOrderItemStatus(
                organizationSlug,
                locationSlug,
                orderId,
                itemId,
                status,
            ),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: ["orders", organizationSlug, locationSlug],
            });
        },
        onError: () => {
            void message.error("Item was not marked as done. Please try again.");
        },
    });
    const completeOrderMutation = useMutation({
        mutationFn: (orderId: string) =>
            updateOrderStatus(
                organizationSlug,
                locationSlug,
                orderId,
                "completed",
            ),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: ["orders", organizationSlug, locationSlug],
            });
            void message.success("Order completed.");
        },
        onError: () => {
            void message.error("Order was not completed. Please try again.");
        },
    });

    useEffect(() => {
        if (currentOrderIndex > 0 && currentOrderIndex >= stationOrders.length) {
            setCurrentOrderIndex(Math.max(stationOrders.length - 1, 0));
        }
    }, [currentOrderIndex, stationOrders.length]);

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

    function showPreviousOrder() {
        setCurrentOrderIndex((currentIndex) =>
            currentIndex === 0
                ? Math.max(stationOrders.length - 1, 0)
                : currentIndex - 1,
        );
    }

    function showNextOrder() {
        setCurrentOrderIndex((currentIndex) =>
            currentIndex >= stationOrders.length - 1 ? 0 : currentIndex + 1,
        );
    }

    function markItemDone(
        orderId: string,
        itemId: string,
        isDone: boolean,
        previousStatus: OrderItemStatus | "",
    ) {
        updateItemMutation.mutate({
            itemId,
            orderId,
            status: isDone ? previousStatus || "queued" : "ready",
        });
    }

    function completeOrder(orderId: string) {
        completeOrderMutation.mutate(orderId);
    }

    return (
        <main className="kitchen-station-page">
            <header className="kitchen-station-page__header">
                <div>
                    <h1 className="kitchen-station-page__title">
                        Prepare Order
                    </h1>
                    <p className="kitchen-station-page__subtitle">
                        <Link href={organizationHref}>{organizationName}</Link>
                        <span> / </span>
                        <Link href={locationHref}>{locationName}</Link>
                        <span> / {stationLabel}</span>
                    </p>
                </div>

                <button
                    type="button"
                    className="kitchen-station-page__menu-button"
                    aria-label="Open kitchen menu"
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

            <section
                className="kitchen-station-page__orders"
                aria-label={`${stationLabel} station orders`}
            >
                <button
                    type="button"
                    className="kitchen-station-page__order-nav kitchen-station-page__order-nav--left"
                    aria-label="Previous order"
                    onClick={showPreviousOrder}
                />

                {currentOrder ? (
                    <article
                        key={currentOrder.id}
                        className="kitchen-station-page__order-frame"
                    >
                        <div className="kitchen-station-page__order-meta">
                            <span className="kitchen-station-page__order-position">
                                {currentOrderIndex + 1}/{stationOrders.length}
                            </span>
                            <span className="kitchen-station-page__meta-item">
                                <span className="kitchen-station-page__meta-label">
                                    Order
                                </span>
                                <strong>{currentOrder.orderNumber}</strong>
                            </span>
                            <span className="kitchen-station-page__meta-item">
                                <span className="kitchen-station-page__meta-label">
                                    Time
                                </span>
                                <strong>
                                    {formatElapsedWaitTime(
                                        currentOrder.createdAt,
                                        now,
                                    )}
                                </strong>
                            </span>
                            <span className="kitchen-station-page__meta-item">
                                <span className="kitchen-station-page__meta-label">
                                    Status
                                </span>
                                <strong>{formatStatus(currentOrder.status)}</strong>
                            </span>
                        </div>

                        <div className="kitchen-station-page__items">
                            {currentOrder.items.map((item) => (
                                <article
                                    key={item.id}
                                    className={
                                        item.isDone
                                            ? "kitchen-station-page__item kitchen-station-page__item--done"
                                            : "kitchen-station-page__item"
                                    }
                                >
                                    <div className="kitchen-station-page__item-image">
                                        {item.imageUrl ? (
                                            <Image
                                                src={item.imageUrl}
                                                alt=""
                                                fill
                                                sizes="96px"
                                            />
                                        ) : null}
                                    </div>
                                    <h2>{item.name}</h2>
                                    <div className="kitchen-station-page__modifications">
                                        {item.modifications.map(
                                            (modification) => (
                                                <span
                                                    key={modification.id}
                                                    className={[
                                                        "kitchen-station-page__modification",
                                                        `kitchen-station-page__modification--${modification.type}`,
                                                    ].join(" ")}
                                                >
                                                    <span>
                                                        {modification.label}
                                                    </span>
                                                    {modification.quantity &&
                                                    modification.quantity > 1 ? (
                                                        <strong>
                                                            x
                                                            {
                                                                modification.quantity
                                                            }
                                                        </strong>
                                                    ) : null}
                                                </span>
                                            ),
                                        )}
                                    </div>
                                    {viewMode === "expo" ? (
                                        <div className="kitchen-station-page__item-status">
                                            <span>
                                                {formatProductionArea(
                                                    item.productionArea,
                                                )}
                                            </span>
                                            <strong>
                                                {formatStatus(item.status)}
                                            </strong>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            className={
                                                item.isDone
                                                    ? "kitchen-station-page__done-button kitchen-station-page__done-button--complete"
                                                    : "kitchen-station-page__done-button"
                                            }
                                            aria-label={
                                                item.isDone
                                                    ? `${item.name} is done`
                                                    : `Mark ${item.name} as done`
                                            }
                                            onClick={() =>
                                                markItemDone(
                                                    currentOrder.id,
                                                    item.id,
                                                    item.isDone,
                                                    item.previousStatus,
                                                )
                                            }
                                        >
                                            {item.isDone ? (
                                                <Image
                                                    src="/assets/icons/icon-done.svg"
                                                    alt=""
                                                    width={30}
                                                    height={30}
                                                />
                                            ) : (
                                                "Done"
                                            )}
                                        </button>
                                    )}
                                </article>
                            ))}
                        </div>

                        {viewMode === "expo" ? (
                            <button
                                type="button"
                                className="kitchen-station-page__complete-button"
                                disabled={completeOrderMutation.isPending}
                                onClick={() => completeOrder(currentOrder.id)}
                            >
                                Completed
                            </button>
                        ) : null}

                        <footer className="kitchen-station-page__notes">
                            <strong>Notes:</strong>
                            <span>{currentOrder.notes}</span>
                        </footer>
                    </article>
                ) : null}

                <button
                    type="button"
                    className="kitchen-station-page__order-nav kitchen-station-page__order-nav--right"
                    aria-label="Next order"
                    onClick={showNextOrder}
                />
            </section>
        </main>
    );
}
