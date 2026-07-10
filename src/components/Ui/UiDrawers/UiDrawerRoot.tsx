"use client";

import { Drawer } from "antd";
import { observer } from "mobx-react-lite";

import { useStores } from "@/store/hooks/useStores";

import { DRAWER_REGISTRY, renderDrawerBody } from "./DrawerRegistry";
import "./UiDrawerRoot.Styles.scss";

const UiDrawerRoot = observer(() => {
    const {
        drawerStore: {
            activeDrawer,
            closeDrawer,
            drawerOptions,
            drawerProps,
            isOpen,
        },
    } = useStores();

    if (!activeDrawer) {
        return null;
    }

    const drawerDefinition = DRAWER_REGISTRY[activeDrawer];
    const options = {
        ...drawerDefinition.defaultOptions,
        ...drawerOptions,
    };

    function handleClose() {
        options.onClose?.();
        closeDrawer();
    }

    return (
        <Drawer
            open={isOpen}
            onClose={handleClose}
            placement={options.placement ?? "right"}
            title={options.title}
            size={options.size}
            closable={options.closable ?? true}
            maskClosable={options.maskClosable ?? true}
            destroyOnHidden
            className={`app-drawer ${options.className ?? ""}`.trim()}
        >
            {renderDrawerBody(activeDrawer, drawerProps)}
        </Drawer>
    );
});

export default UiDrawerRoot;
