"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useStores } from "@/store/hooks/useStores";

import "./KitchenStationPage.Styles.scss";

type KitchenStationItem = {
    id: string;
    imageUrl: string;
    modifications: Array<{
        id: string;
        label: string;
        quantity?: number;
        type: "added" | "removed";
    }>;
    name: string;
};

type KitchenStationOrder = {
    id: string;
    items: KitchenStationItem[];
    notes: string;
    orderNumber: string;
    time: string;
};

type KitchenStationPageProps = {
    locationHref: string;
    locationName: string;
    navigationLinks: Array<{
        href: string;
        label: string;
    }>;
    organizationHref: string;
    organizationName: string;
};

const burgerImageUrl = "/assets/photo/menu/lupins/GMR_Lupins_LupinsCheeseburger.png";
const chickenImageUrl =
    "/assets/photo/menu/lupins/GMR_Lupins_HotHoneyChickenSandwich.png";

const largeOrderItems: KitchenStationItem[] = Array.from(
    { length: 12 },
    (_, index) => ({
        id: `order-1-item-${index + 1}`,
        imageUrl: index % 3 === 2 ? chickenImageUrl : burgerImageUrl,
        modifications:
            index % 3 === 0
                ? [
                      {
                          id: `order-1-item-${index + 1}-add-cheese`,
                          label: "Cheese",
                          quantity: 2,
                          type: "added" as const,
                      },
                      {
                          id: `order-1-item-${index + 1}-no-onion`,
                          label: "Onion",
                          type: "removed" as const,
                      },
                  ]
                : index % 3 === 1
                  ? [
                        {
                            id: `order-1-item-${index + 1}-extra-sauce`,
                            label: "Sauce",
                            quantity: 2,
                            type: "added" as const,
                        },
                    ]
                  : [],
        name: index % 3 === 2 ? "Hot Honey Chicken" : "Ballpark Beef Dog",
    }),
);

const stationOrders: KitchenStationOrder[] = [
    {
        id: "order-1",
        orderNumber: "1234567",
        time: "15:34",
        notes: "Rush order. Guest is waiting near Front Desk.",
        items: largeOrderItems,
    },
    {
        id: "order-2",
        orderNumber: "2234568",
        time: "15:37",
        notes: "No tray. Bag only.",
        items: [
            {
                id: "order-2-item-1",
                imageUrl: burgerImageUrl,
                modifications: [
                    {
                        id: "no-pickle",
                        label: "Pickles",
                        type: "removed",
                    },
                ],
                name: "Ballpark Beef Dog",
            },
            {
                id: "order-2-item-2",
                imageUrl: burgerImageUrl,
                modifications: [
                    {
                        id: "add-cheese",
                        label: "Cheese",
                        quantity: 3,
                        type: "added",
                    },
                ],
                name: "Ballpark Beef Dog",
            },
        ],
    },
    {
        id: "order-3",
        orderNumber: "3234569",
        time: "15:41",
        notes: "Guest asked for everything well done.",
        items: [
            {
                id: "order-3-item-1",
                imageUrl: chickenImageUrl,
                modifications: [],
                name: "Hot Honey Chicken",
            },
            {
                id: "order-3-item-2",
                imageUrl: burgerImageUrl,
                modifications: [
                    {
                        id: "no-onion",
                        label: "Onion",
                        type: "removed",
                    },
                    {
                        id: "add-mushrooms",
                        label: "Mushrooms",
                        quantity: 2,
                        type: "added",
                    },
                ],
                name: "Ballpark Beef Dog",
            },
        ],
    },
    {
        id: "order-4",
        orderNumber: "4234570",
        time: "15:45",
        notes: "Hold until Front Desk calls.",
        items: [
            {
                id: "order-4-item-1",
                imageUrl: burgerImageUrl,
                modifications: [],
                name: "Ballpark Beef Dog",
            },
            {
                id: "order-4-item-2",
                imageUrl: burgerImageUrl,
                modifications: [],
                name: "Ballpark Beef Dog",
            },
            {
                id: "order-4-item-3",
                imageUrl: burgerImageUrl,
                modifications: [
                    {
                        id: "add-cheese",
                        label: "Cheese",
                        quantity: 2,
                        type: "added",
                    },
                ],
                name: "Ballpark Beef Dog",
            },
        ],
    },
    {
        id: "order-5",
        orderNumber: "5234571",
        time: "15:49",
        notes: "Allergy note: no onions on modified item.",
        items: [
            {
                id: "order-5-item-1",
                imageUrl: chickenImageUrl,
                modifications: [
                    {
                        id: "no-onion",
                        label: "Onion",
                        type: "removed",
                    },
                ],
                name: "Hot Honey Chicken",
            },
        ],
    },
    {
        id: "order-6",
        orderNumber: "6234572",
        time: "15:53",
        notes: "Large group. Keep order together.",
        items: [
            {
                id: "order-6-item-1",
                imageUrl: burgerImageUrl,
                modifications: [
                    {
                        id: "add-cheese",
                        label: "Cheese",
                        quantity: 2,
                        type: "added",
                    },
                    {
                        id: "no-onion",
                        label: "Onion",
                        type: "removed",
                    },
                ],
                name: "Ballpark Beef Dog",
            },
            {
                id: "order-6-item-2",
                imageUrl: chickenImageUrl,
                modifications: [],
                name: "Hot Honey Chicken",
            },
        ],
    },
];

export function KitchenStationPage({
    locationHref,
    locationName,
    navigationLinks,
    organizationHref,
    organizationName,
}: KitchenStationPageProps) {
    const { drawerStore } = useStores();
    const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
    const [doneItemIds, setDoneItemIds] = useState<Set<string>>(() => new Set());
    const currentOrder = stationOrders[currentOrderIndex];

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
            currentIndex === 0 ? stationOrders.length - 1 : currentIndex - 1,
        );
    }

    function showNextOrder() {
        setCurrentOrderIndex((currentIndex) =>
            currentIndex === stationOrders.length - 1 ? 0 : currentIndex + 1,
        );
    }

    function markItemDone(itemId: string) {
        setDoneItemIds((currentDoneItemIds) => {
            const nextDoneItemIds = new Set(currentDoneItemIds);
            nextDoneItemIds.add(itemId);
            return nextDoneItemIds;
        });
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
                        <span> / Kitchen</span>
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
                aria-label="Kitchen station orders"
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
                            <span>
                                {currentOrderIndex + 1}/{stationOrders.length}
                            </span>
                            <span>ORDER:{currentOrder.orderNumber}</span>
                            <span>TIME: {currentOrder.time}</span>
                        </div>

                        <div className="kitchen-station-page__items">
                            {currentOrder.items.map((item) => (
                                <article
                                    key={item.id}
                                    className="kitchen-station-page__item"
                                >
                                    <div className="kitchen-station-page__item-image">
                                        <Image
                                            src={item.imageUrl}
                                            alt=""
                                            fill
                                            sizes="96px"
                                        />
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
                                    <button
                                        type="button"
                                        className={
                                            doneItemIds.has(item.id)
                                                ? "kitchen-station-page__done-button kitchen-station-page__done-button--complete"
                                                : "kitchen-station-page__done-button"
                                        }
                                        aria-label={
                                            doneItemIds.has(item.id)
                                                ? `${item.name} is done`
                                                : `Mark ${item.name} as done`
                                        }
                                        onClick={() => markItemDone(item.id)}
                                    >
                                        {doneItemIds.has(item.id) ? (
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
                                </article>
                            ))}
                        </div>

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
