"use client";

import Link from "next/link";
import Image from "next/image";
import { message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState, type CSSProperties } from "react";

import { UiButton } from "@/components/Ui/UiButton/UiButton";
import { createOrder } from "@/features/orders/api/ordersApi";
import {
    ingredients,
    type Ingredient,
} from "@/features/training/model/trainingData";
import type { MenuItemCustomization } from "@/store/reducers/modalStore";
import { useStores } from "@/store/hooks/useStores";

import "./OrderMakePage.Styles.scss";

type OrderMakeMenuGroup = {
    id: string;
    icon: string;
    name: string;
};

type OrderMakeMenuItem = {
    addOnIngredientCodes: string[];
    calories: number;
    description: string;
    groupId: string;
    id: string;
    imageUrl: string;
    includedIngredientCodes: string[];
    isModifiable: boolean;
    name: string;
    price: number;
};

type OrderMakePageProps = {
    locationHref: string;
    locationName: string;
    locationSlug: string;
    menuGroups: OrderMakeMenuGroup[];
    menuItems: OrderMakeMenuItem[];
    navigationLinks: Array<{
        href: string;
        label: string;
    }>;
    organizationHref: string;
    organizationName: string;
    organizationSlug: string;
};

type CartItemModification = {
    code: string;
    name: string;
    quantity?: number;
    type: "added" | "removed";
};

type CartItem = {
    addOnIngredientCounts: Record<string, number>;
    cartKey: string;
    id: string;
    includedIngredientCounts: Record<string, number>;
    modifications: CartItemModification[];
    name: string;
    price: number;
    quantity: number;
    removedIngredientCodes: string[];
};

function isCartItemModification(
    modification: CartItemModification | null,
): modification is CartItemModification {
    return Boolean(modification);
}

function createClientRequestId() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatOrderTimestamp(timestamp: number) {
    return new Intl.DateTimeFormat("en-CA", {
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        month: "short",
    }).format(new Date(timestamp));
}

export function OrderMakePage({
    locationHref,
    locationName,
    locationSlug,
    menuGroups,
    menuItems,
    navigationLinks,
    organizationHref,
    organizationName,
    organizationSlug,
}: OrderMakePageProps) {
    const { drawerStore, modalStore } = useStores();
    const queryClient = useQueryClient();
    const groupsBarRef = useRef<HTMLElement>(null);
    const workAreaRef = useRef<HTMLDivElement>(null);
    const groupRefs = useRef<Record<string, HTMLElement | null>>({});
    const groupButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const ingredientByCode = useMemo(
        () =>
            new Map(
                ingredients.map((ingredient) => [ingredient.code, ingredient]),
            ),
        [],
    );
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
    const createOrderMutation = useMutation({
        mutationFn: ({
            locationSlug: nextLocationSlug,
            organizationSlug: nextOrganizationSlug,
            payload,
        }: {
            locationSlug: string;
            organizationSlug: string;
            payload: Parameters<typeof createOrder>[2];
        }) => createOrder(nextOrganizationSlug, nextLocationSlug, payload),
        onSuccess: (order) => {
            setCartItems([]);
            drawerStore.closeDrawer();
            void queryClient.invalidateQueries({
                queryKey: ["orders", organizationSlug, locationSlug],
            });
            void message.success(`Order ${order.orderNumber} sent`);
        },
        onError: () => {
            void message.error("Order was not sent. Please try again.");
        },
    });

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

    function getIngredientsByCodes(ingredientCodes: string[]): Ingredient[] {
        return ingredientCodes
            .map((ingredientCode) => ingredientByCode.get(ingredientCode))
            .filter((ingredient): ingredient is Ingredient => Boolean(ingredient));
    }

    function createCartKey(
        menuItem: OrderMakeMenuItem,
        customization: MenuItemCustomization,
    ) {
        return JSON.stringify({
            id: menuItem.id,
            addOnIngredientCounts: customization.addOnIngredientCounts,
            includedIngredientCounts: customization.includedIngredientCounts,
        });
    }

    function getCartTotal(items: CartItem[]) {
        return items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
        );
    }

    function getCartItemModifications(
        menuItem: OrderMakeMenuItem,
        customization: MenuItemCustomization,
    ): CartItemModification[] {
        const includedIngredients = getIngredientsByCodes(
            menuItem.includedIngredientCodes,
        );
        const addOnIngredients = getIngredientsByCodes(
            menuItem.addOnIngredientCodes,
        );
        const modifications: CartItemModification[] = [
            ...includedIngredients
                .map<CartItemModification | null>((ingredient) => {
                    const count =
                        customization.includedIngredientCounts[ingredient.code] ??
                        1;

                    if (count === 0) {
                        return {
                            code: ingredient.code,
                            name: ingredient.name,
                            type: "removed" as const,
                        };
                    }

                    if (count > 1) {
                        return {
                            code: ingredient.code,
                            name: ingredient.name,
                            quantity: count,
                            type: "added" as const,
                        };
                    }

                    return null;
                })
                .filter(isCartItemModification),
            ...addOnIngredients
                .map<CartItemModification | null>((ingredient) => {
                    const count =
                        customization.addOnIngredientCounts[ingredient.code] ?? 0;

                    if (count < 1) {
                        return null;
                    }

                    return {
                        code: ingredient.code,
                        name: ingredient.name,
                        quantity: count,
                        type: "added" as const,
                    };
                })
                .filter(isCartItemModification),
        ];

        return modifications;
    }

    function buildCartItem(
        menuItem: OrderMakeMenuItem,
        customization: MenuItemCustomization,
    ): CartItem {
        const cartKey = createCartKey(menuItem, customization);
        const removedIngredientCodes = Object.entries(
            customization.includedIngredientCounts,
        )
            .filter(([, count]) => count === 0)
            .map(([ingredientCode]) => ingredientCode);

        return {
            addOnIngredientCounts: customization.addOnIngredientCounts,
            cartKey,
            id: menuItem.id,
            includedIngredientCounts: customization.includedIngredientCounts,
            modifications: getCartItemModifications(menuItem, customization),
            name: menuItem.name,
            price: menuItem.price,
            quantity: customization.quantity,
            removedIngredientCodes,
        };
    }

    function addItemToCart(
        menuItem: OrderMakeMenuItem,
        customization: MenuItemCustomization,
    ) {
        const nextCartItem = buildCartItem(menuItem, customization);

        setCartItems((currentItems) => {
            const existingItem = currentItems.find(
                (item) => item.cartKey === nextCartItem.cartKey,
            );

            if (existingItem) {
                return currentItems.map((item) =>
                    item.cartKey === nextCartItem.cartKey
                        ? {
                              ...item,
                              quantity: item.quantity + customization.quantity,
                          }
                        : item,
                );
            }

            return [...currentItems, nextCartItem];
        });
    }

    function replaceCartItem(
        currentItems: CartItem[],
        cartKeyToReplace: string,
        nextCartItem: CartItem,
    ) {
        const itemIndex = currentItems.findIndex(
            (item) => item.cartKey === cartKeyToReplace,
        );
        const itemsWithoutCurrent = currentItems.filter(
            (item) => item.cartKey !== cartKeyToReplace,
        );
        const duplicateIndex = itemsWithoutCurrent.findIndex(
            (item) => item.cartKey === nextCartItem.cartKey,
        );

        if (duplicateIndex >= 0) {
            return itemsWithoutCurrent.map((item, index) =>
                index === duplicateIndex
                    ? {
                          ...item,
                          quantity: item.quantity + nextCartItem.quantity,
                      }
                    : item,
            );
        }

        const safeIndex = itemIndex < 0 ? itemsWithoutCurrent.length : itemIndex;

        return [
            ...itemsWithoutCurrent.slice(0, safeIndex),
            nextCartItem,
            ...itemsWithoutCurrent.slice(safeIndex),
        ];
    }

    function openItemModal(
        menuItem: OrderMakeMenuItem,
        options: {
            confirmText?: string;
            initialCustomization?: MenuItemCustomization;
            onConfirm?: (customization: MenuItemCustomization) => void;
        } = {},
    ) {
        const includedIngredients = getIngredientsByCodes(
            menuItem.includedIngredientCodes,
        );
        const addOnIngredients = getIngredientsByCodes(
            menuItem.addOnIngredientCodes,
        );
        const customizationRef: { current: MenuItemCustomization } = {
            current:
                options.initialCustomization ?? {
                    addOnIngredientCounts: Object.fromEntries(
                        addOnIngredients.map((ingredient) => [
                            ingredient.code,
                            0,
                        ]),
                    ),
                    includedIngredientCounts: Object.fromEntries(
                        includedIngredients.map((ingredient) => [
                            ingredient.code,
                            1,
                        ]),
                    ),
                    quantity: 1,
                },
        };

        modalStore.openModal(
            "MENU_ITEM_DETAIL",
            {
                addOnIngredients,
                calories: menuItem.calories,
                description: menuItem.description,
                imageUrl: menuItem.imageUrl,
                includedIngredients,
                initialCustomization: options.initialCustomization,
                isModifiable: menuItem.isModifiable,
                name: menuItem.name,
                onCustomizationChange: (customization) => {
                    customizationRef.current = customization;
                },
                price: menuItem.price,
            },
            {
                title: menuItem.name,
                confirmText: options.confirmText ?? "Add to Order",
                cancelText: "Cancel",
                onConfirm: () => {
                    if (options.onConfirm) {
                        options.onConfirm(customizationRef.current);
                        return;
                    }

                    addItemToCart(menuItem, customizationRef.current);
                },
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

    function openCartItemModal(cartKey: string, currentItems: CartItem[]) {
        const cartItem = currentItems.find((item) => item.cartKey === cartKey);
        const menuItem = cartItem
            ? menuItems.find((item) => item.id === cartItem.id)
            : null;

        if (!cartItem || !menuItem) {
            return;
        }

        openItemModal(menuItem, {
            confirmText: "Update Item",
            initialCustomization: {
                addOnIngredientCounts: cartItem.addOnIngredientCounts,
                includedIngredientCounts: cartItem.includedIngredientCounts,
                quantity: cartItem.quantity,
            },
            onConfirm: (customization) => {
                const nextCartItem = buildCartItem(menuItem, customization);
                const nextItems = replaceCartItem(
                    currentItems,
                    cartItem.cartKey,
                    nextCartItem,
                );

                setCartItems(nextItems);
                openCartDrawer(nextItems);
            },
        });
    }

    function openCartDrawer(itemsForDrawer = cartItems) {
        drawerStore.openDrawer(
            "ORDER_CART",
            {
                items: itemsForDrawer,
                onCancelOrder: () => {
                    modalStore.openModal(
                        "CONFIRM_ACTION",
                        {
                            message: "Cancel this order?",
                            details:
                                "This will remove all items from the current order.",
                        },
                        {
                            title: "Cancel Order",
                            confirmText: "Cancel Order",
                            cancelText: "Keep Order",
                            onConfirm: () => {
                                setCartItems([]);
                                drawerStore.closeDrawer();
                            },
                        },
                    );
                },
                onEditItem: (cartKey) =>
                    openCartItemModal(cartKey, itemsForDrawer),
                onSubmitOrder: () => {
                    const customerNameRef = { current: "" };
                    const notesRef = { current: "" };
                    const createdAtTimestamp = Date.now();

                    modalStore.openModal(
                        "CONFIRM_ACTION",
                        {
                            customerNameLabel: "Customer name (optional)",
                            message: "Send this order?",
                            details:
                                "The order will be sent to the preparation workflow.",
                            notesLabel: "Notes",
                            onCustomerNameChange: (customerName) => {
                                customerNameRef.current = customerName;
                            },
                            onNotesChange: (notes) => {
                                notesRef.current = notes;
                            },
                            summaryItems: [
                                {
                                    label: "Order number",
                                    value: "Assigned on send",
                                },
                                {
                                    label: "Created",
                                    value: formatOrderTimestamp(
                                        createdAtTimestamp,
                                    ),
                                },
                                {
                                    label: "Items",
                                    value: String(
                                        itemsForDrawer.reduce(
                                            (sum, item) => sum + item.quantity,
                                            0,
                                        ),
                                    ),
                                },
                                {
                                    label: "Total",
                                    value: `$${getCartTotal(itemsForDrawer).toFixed(2)}`,
                                },
                            ],
                        },
                        {
                            title: "Send Order",
                            confirmText: "Send Order",
                            cancelText: "Back",
                            onConfirm: () => {
                                createOrderMutation.mutate({
                                    locationSlug,
                                    organizationSlug,
                                    payload: {
                                        clientRequestId: createClientRequestId(),
                                        customerName: customerNameRef.current,
                                        items: itemsForDrawer.map((item) => ({
                                            menuItemId: item.id,
                                            modifications: item.modifications,
                                            quantity: item.quantity,
                                        })),
                                        notes: notesRef.current,
                                    },
                                });
                            },
                        },
                    );
                },
                total: getCartTotal(itemsForDrawer),
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
                    <Link
                        href={locationHref}
                        className="order-make-page__back-button"
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

                    <div className="order-make-page__header-content">
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
                                    <span className="order-make-page__menu-item-image">
                                        {menuItem.imageUrl ? (
                                            <Image
                                                src={menuItem.imageUrl}
                                                alt={menuItem.name}
                                                fill
                                                sizes="72px"
                                            />
                                        ) : (
                                            <span>no image</span>
                                        )}
                                    </span>
                                    <span className="order-make-page__menu-item-content">
                                        <span className="order-make-page__menu-item-name">
                                            {menuItem.name}
                                        </span>
                                        <span className="order-make-page__menu-item-meta">
                                            price: ${menuItem.price.toFixed(2)}
                                            <span>cal: {menuItem.calories}</span>
                                        </span>
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
                        onClick={() => openCartDrawer()}
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
