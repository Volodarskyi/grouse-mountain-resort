"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type CSSProperties } from "react";

import { UiButton } from "@/components/Ui/UiButton/UiButton";
import { useStores } from "@/store/hooks/useStores";

import "./OrderMakePage.Styles.scss";

type OrderMakeMenuGroup = {
    id: string;
    icon: string;
    name: string;
};

type OrderMakeMenuItem = {
    calories: number;
    description: string;
    groupId: string;
    id: string;
    name: string;
    price: number;
};

type OrderMakePageProps = {
    locationHref: string;
    locationName: string;
    menuGroups: OrderMakeMenuGroup[];
    menuItems: OrderMakeMenuItem[];
    navigationLinks: Array<{
        href: string;
        label: string;
    }>;
    organizationHref: string;
    organizationName: string;
};

type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
};

export function OrderMakePage({
    locationHref,
    locationName,
    menuGroups,
    menuItems,
    navigationLinks,
    organizationHref,
    organizationName,
}: OrderMakePageProps) {
    const { drawerStore, modalStore } = useStores();
    const groupsBarRef = useRef<HTMLElement>(null);
    const workAreaRef = useRef<HTMLDivElement>(null);
    const groupRefs = useRef<Record<string, HTMLElement | null>>({});
    const groupButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const groupedMenu = useMemo(
        () =>
            menuGroups
                .map((group) => ({
                    ...group,
                    items: menuItems.filter((item) => item.groupId === group.id),
                }))
                .filter((group) => group.items.length > 0),
        [menuGroups, menuItems],
    );
    const [activeGroupId, setActiveGroupId] = useState(groupedMenu[0]?.id ?? "");
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    function scrollToGroup(groupId: string) {
        setActiveGroupId(groupId);
        scrollActiveGroupButtonIntoView(groupId);

        const workArea = workAreaRef.current;
        const groupElement = groupRefs.current[groupId];

        if (!workArea || !groupElement) {
            return;
        }

        workArea.scrollTo({
            top: groupElement.offsetTop - workArea.offsetTop,
            behavior: "smooth",
        });
    }

    function scrollActiveGroupButtonIntoView(groupId: string) {
        const groupsBar = groupsBarRef.current;
        const groupButton = groupButtonRefs.current[groupId];

        if (!groupsBar || !groupButton) {
            return;
        }

        groupButton.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    }

    function handleWorkAreaScroll() {
        const workArea = workAreaRef.current;

        if (!workArea) {
            return;
        }

        const scrollPosition = workArea.scrollTop + 24;
        const currentGroup = groupedMenu.reduce<string>(
            (currentGroupId, group) => {
                const groupElement = groupRefs.current[group.id];

                if (!groupElement) {
                    return currentGroupId;
                }

                const groupTop = groupElement.offsetTop - workArea.offsetTop;

                return groupTop <= scrollPosition ? group.id : currentGroupId;
            },
            groupedMenu[0]?.id ?? "",
        );

        if (currentGroup && currentGroup !== activeGroupId) {
            setActiveGroupId(currentGroup);
            scrollActiveGroupButtonIntoView(currentGroup);
        }
    }

    const getGroupIconStyle = (icon: string) =>
        ({
            "--order-group-icon": `url("${icon}")`,
        }) as CSSProperties;
    const formatGroupName = (name: string) =>
        name
            .replaceAll("-", " ")
            .replace(/\bchiken\b/gi, "Chicken")
            .replace(/\s+/g, " ")
            .trim();

    function addItemToCart(menuItem: OrderMakeMenuItem) {
        setCartItems((currentItems) => {
            const existingItem = currentItems.find(
                (item) => item.id === menuItem.id,
            );

            if (existingItem) {
                return currentItems.map((item) =>
                    item.id === menuItem.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                );
            }

            return [
                ...currentItems,
                {
                    id: menuItem.id,
                    name: menuItem.name,
                    price: menuItem.price,
                    quantity: 1,
                },
            ];
        });
    }

    function openItemModal(menuItem: OrderMakeMenuItem) {
        modalStore.openModal(
            "MENU_ITEM_DETAIL",
            {
                calories: menuItem.calories,
                description: menuItem.description,
                name: menuItem.name,
                price: menuItem.price,
            },
            {
                title: menuItem.name,
                confirmText: "Add to Order",
                cancelText: "Cancel",
                onConfirm: () => addItemToCart(menuItem),
            },
        );
    }

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

    function openCartDrawer() {
        drawerStore.openDrawer(
            "ORDER_CART",
            {
                items: cartItems,
                total: cartTotal,
            },
            {
                title: "Order",
                placement: "bottom",
                size: "90vh",
                className: "app-drawer--bottom",
            },
        );
    }

    return (
        <main className="order-make-page">
            <section className="order-make-page__shell">
                <header className="order-make-page__header">
                    <div>
                        <h1 className="order-make-page__title">Make Order</h1>
                        <p className="order-make-page__subtitle">
                            <Link href={organizationHref}>
                                {organizationName}
                            </Link>
                            <span> / </span>
                            <Link href={locationHref}>{locationName}</Link>
                        </p>
                    </div>
                    <button
                        type="button"
                        className="order-make-page__menu-button"
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

                <div className="order-make-page__groups-shell">
                    <nav
                        ref={groupsBarRef}
                        className="order-make-page__groups-bar"
                        aria-label="Menu groups"
                    >
                        {groupedMenu.map((group) => (
                            <button
                                key={group.id}
                                type="button"
                                ref={(element) => {
                                    groupButtonRefs.current[group.id] = element;
                                }}
                                className={[
                                    "order-make-page__group-button",
                                    activeGroupId === group.id
                                        ? "order-make-page__group-button--active"
                                        : "",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                                onClick={() => scrollToGroup(group.id)}
                            >
                                {group.icon ? (
                                    <span
                                        className="order-make-page__group-icon"
                                        style={getGroupIconStyle(group.icon)}
                                    />
                                ) : null}
                                <span>{formatGroupName(group.name)}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <section
                    ref={workAreaRef}
                    className="order-make-page__work-area"
                    aria-label="Menu items"
                    onScroll={handleWorkAreaScroll}
                >
                    {groupedMenu.map((group) => (
                        <section
                            key={group.id}
                            id={`group-${group.id}`}
                            ref={(element) => {
                                groupRefs.current[group.id] = element;
                            }}
                            className="order-make-page__menu-group"
                        >
                            <div className="order-make-page__menu-group-title">
                                {group.icon ? (
                                    <span
                                        className="order-make-page__menu-group-icon"
                                        style={getGroupIconStyle(group.icon)}
                                    />
                                ) : null}
                                <h2>{formatGroupName(group.name)}</h2>
                            </div>

                            {group.items.map((menuItem) => (
                                <button
                                    key={menuItem.id}
                                    type="button"
                                    className="order-make-page__menu-item"
                                    onClick={() => openItemModal(menuItem)}
                                >
                                    <span className="order-make-page__menu-item-name">
                                        {menuItem.name}
                                    </span>
                                    <span className="order-make-page__menu-item-meta">
                                        price: ${menuItem.price.toFixed(2)}
                                        <span>cal: {menuItem.calories}</span>
                                    </span>
                                </button>
                            ))}
                        </section>
                    ))}
                </section>

                <footer className="order-make-page__footer">
                    <UiButton
                        type="button"
                        className="order-make-page__order-button"
                        disabled={cartCount === 0}
                        onClick={openCartDrawer}
                    >
                        <span>Order</span>
                        <span className="order-make-page__order-count">
                            {cartCount}
                        </span>
                    </UiButton>
                </footer>
            </section>
        </main>
    );
}
