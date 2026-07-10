"use client";

import dynamic from "next/dynamic";
import type { ComponentType, ReactNode } from "react";

import type {
    DrawerOptions,
    DrawerPropsMap,
    DrawerType,
    OrderCartDrawerProps,
    OrderNavDrawerProps,
} from "@/store/reducers/drawerStore";

type DrawerDefinition<TDrawer extends DrawerType> = {
    Component: ComponentType<DrawerPropsMap[TDrawer]>;
    defaultOptions?: DrawerOptions;
};

const OrderNavDrawer = dynamic<OrderNavDrawerProps>(
    () => import("./bodies/OrderNavDrawer"),
);
const OrderCartDrawer = dynamic<OrderCartDrawerProps>(
    () => import("./bodies/OrderCartDrawer"),
);

export const DRAWER_REGISTRY = {
    ORDER_NAV: {
        Component: OrderNavDrawer,
        defaultOptions: {
            title: "Menu",
            placement: "right",
            size: 340,
        },
    },
    ORDER_CART: {
        Component: OrderCartDrawer,
        defaultOptions: {
            title: "Order",
            placement: "bottom",
            size: "90vh",
        },
    },
} satisfies { [TDrawer in DrawerType]: DrawerDefinition<TDrawer> };

export function renderDrawerBody<TDrawer extends DrawerType>(
    type: TDrawer,
    props: Partial<DrawerPropsMap[DrawerType]>,
): ReactNode {
    const Component = DRAWER_REGISTRY[type].Component as ComponentType<
        DrawerPropsMap[TDrawer]
    >;

    return <Component {...(props as DrawerPropsMap[TDrawer])} />;
}
