"use client";

import { Alert, Empty, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import Image from "next/image";
import { useState } from "react";

import { UiButton } from "@/components/Ui/UiButton/UiButton";
import { useStores } from "@/store/hooks/useStores";

import "./MenuPage.Styles.scss";

type MenuPageItem = {
    id: string;
    groupId: string;
    name: string;
    price: number;
};

type MenuPageGroup = {
    id: string;
    icon: string;
    name: string;
};

type MenuPageProps = {
    addHref: string;
    baseHref: string;
    locationName: string;
    menuGroups: MenuPageGroup[];
    menuItems: MenuPageItem[];
    organizationName: string;
};

export function MenuPage({
    addHref,
    baseHref,
    locationName,
    menuGroups = [],
    menuItems = [],
    organizationName,
}: MenuPageProps) {
    const { modalStore } = useStores();
    const [visibleMenuItems, setVisibleMenuItems] = useState(menuItems);
    const [deleteError, setDeleteError] = useState("");
    const [deletingMenuItemId, setDeletingMenuItemId] = useState("");

    async function handleDeleteMenuItem(menuItem: MenuPageItem) {
        setDeleteError("");
        setDeletingMenuItemId(menuItem.id);

        try {
            const response = await fetch(`/api/menu-items/${menuItem.id}`, {
                method: "DELETE",
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error ?? "Menu item deletion failed");
            }

            setVisibleMenuItems((currentItems) =>
                currentItems.filter((currentItem) => currentItem.id !== menuItem.id),
            );
        } catch (error) {
            setDeleteError(
                error instanceof Error
                    ? error.message
                    : "Menu item deletion failed",
            );
        } finally {
            setDeletingMenuItemId("");
        }
    }

    function openDeleteMenuItemModal(menuItem: MenuPageItem) {
        modalStore.openModal(
            "CONFIRM_ACTION",
            {
                message: `Delete ${menuItem.name}?`,
                details: "This menu item will be removed from the current location menu.",
            },
            {
                title: "Delete menu item",
                cancelText: "Cancel",
                confirmText: "Delete",
                onConfirm: () => {
                    void handleDeleteMenuItem(menuItem);
                },
            },
        );
    }

    const columns: ColumnsType<MenuPageItem> = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            className: "menu-page__table-name-column",
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            width: 160,
            className: "menu-page__table-price-column",
            render: (price: number) => `$${price.toFixed(2)}`,
        },
        {
            title: "",
            key: "actions",
            align: "right",
            width: 120,
            className: "menu-page__table-action-column",
            render: (_, menuItem) => (
                <div className="menu-page__table-actions">
                    <UiButton
                        href={`${baseHref}/${menuItem.id}/edit`}
                        size="s"
                        variant="secondary"
                        className="menu-page__icon-button"
                        title="Edit menu item"
                    >
                        <Image
                            src="/assets/icons/icon-edit.svg"
                            alt=""
                            width={18}
                            height={18}
                            className="menu-page__action-icon"
                        />
                        <span className="menu-page__sr-only">Edit</span>
                    </UiButton>
                    <UiButton
                        type="button"
                        size="s"
                        variant="secondary"
                        className="menu-page__icon-button"
                        disabled={deletingMenuItemId === menuItem.id}
                        title="Delete menu item"
                        onClick={() => {
                            openDeleteMenuItemModal(menuItem);
                        }}
                    >
                        <Image
                            src="/assets/icons/icon-delete.svg"
                            alt=""
                            width={18}
                            height={18}
                            className="menu-page__action-icon"
                        />
                        <span className="menu-page__sr-only">
                            {deletingMenuItemId === menuItem.id
                                ? "Deleting"
                                : "Delete"}
                        </span>
                    </UiButton>
                </div>
            ),
        },
    ];
    const groupedMenu = [
        ...menuGroups.map((group) => ({
            ...group,
            items: visibleMenuItems.filter(
                (menuItem) => menuItem.groupId === group.id,
            ),
        })),
        {
            id: "ungrouped",
            icon: "",
            name: "Ungrouped",
            items: visibleMenuItems.filter((menuItem) => !menuItem.groupId),
        },
    ].filter((group) => group.items.length > 0);

    return (
        <main className="menu-page">
            <div className="menu-page__header">
                <div>
                    <h1 className="menu-page__title">Menu</h1>
                    <p className="menu-page__subtitle">
                        {organizationName} / {locationName}
                    </p>
                </div>
            </div>

            {groupedMenu.length > 0 ? (
                <div className="menu-page__groups">
                    {deleteError ? (
                        <Alert type="error" title={deleteError} showIcon />
                    ) : null}

                    {groupedMenu.map((group) => (
                        <section key={group.id} className="menu-page__group">
                            <div className="menu-page__group-header">
                                {group.icon ? (
                                    <Image
                                        src={group.icon}
                                        alt=""
                                        width={32}
                                        height={32}
                                        className="menu-page__group-icon"
                                    />
                                ) : null}
                                <h2 className="menu-page__group-title">
                                    {group.name}
                                </h2>
                            </div>

                            <Table
                                columns={columns}
                                dataSource={group.items}
                                rowKey="id"
                                pagination={false}
                                className="menu-page__table"
                            />
                        </section>
                    ))}
                </div>
            ) : (
                <div className="menu-page__empty">
                    <Empty description="No menu items for this location" />
                </div>
            )}

            <UiButton href={addHref} className="menu-page__add-button">
                Add
            </UiButton>
        </main>
    );
}
