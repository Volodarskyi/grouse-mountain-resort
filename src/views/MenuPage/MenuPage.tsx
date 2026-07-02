"use client";

import { Empty, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

import { UiButton } from "@/components/Ui/UiButton/UiButton";

import "./MenuPage.Styles.scss";

type MenuPageItem = {
    id: string;
    name: string;
    price: number;
};

type MenuPageProps = {
    addHref: string;
    locationName: string;
    menuItems: MenuPageItem[];
    organizationName: string;
};

const columns: ColumnsType<MenuPageItem> = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Price",
        dataIndex: "price",
        key: "price",
        render: (price: number) => `$${price.toFixed(2)}`,
    },
];

export function MenuPage({
    addHref,
    locationName,
    menuItems,
    organizationName,
}: MenuPageProps) {
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

            {menuItems.length > 0 ? (
                <Table
                    columns={columns}
                    dataSource={menuItems}
                    rowKey="id"
                    pagination={false}
                    scroll={{ x: true }}
                />
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
