import { makeAutoObservable } from "mobx";
import type { ReactNode } from "react";

export type DrawerType = "ORDER_NAV" | "ORDER_CART";

export type OrderNavDrawerProps = {
    links: Array<{
        href: string;
        label: string;
    }>;
};

export type OrderCartDrawerProps = {
    items: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
    }>;
    total: number;
};

export type DrawerPropsMap = {
    ORDER_NAV: OrderNavDrawerProps;
    ORDER_CART: OrderCartDrawerProps;
};

export type DrawerOptions = {
    title?: ReactNode;
    placement?: "right" | "bottom";
    size?: number | string;
    className?: string;
    closable?: boolean;
    maskClosable?: boolean;
    onClose?: () => void;
};

class DrawerStore {
    activeDrawer: DrawerType | null = null;
    drawerProps: Partial<DrawerPropsMap[DrawerType]> = {};
    drawerOptions: DrawerOptions = {};

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    get isOpen() {
        return this.activeDrawer !== null;
    }

    openDrawer<TDrawer extends DrawerType>(
        type: TDrawer,
        props: DrawerPropsMap[TDrawer],
        options: DrawerOptions = {},
    ) {
        this.activeDrawer = type;
        this.drawerProps = props;
        this.drawerOptions = options;
    }

    closeDrawer() {
        this.activeDrawer = null;
        this.drawerProps = {};
        this.drawerOptions = {};
    }
}

const drawerStore = new DrawerStore();

export default drawerStore;
