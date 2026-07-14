"use client";

import dynamic from "next/dynamic";
import type { ComponentType, ReactNode } from "react";

import type {
    AiChatAssistantModalProps,
    ConfirmActionModalProps,
    IngredientSelectorModalProps,
    MenuItemDetailModalProps,
    ModalOptions,
    ModalPropsMap,
    ModalType,
    RecipeDetailModalProps,
    ShiftReportPreviewModalProps,
} from "@/store/reducers/modalStore";

type ModalDefinition<TModal extends ModalType> = {
    Component: ComponentType<ModalPropsMap[TModal]>;
    defaultOptions?: ModalOptions;
};

const RecipeDetail = dynamic<RecipeDetailModalProps>(
    () => import("./bodies/RecipeDetail"),
);
const AiChatAssistant = dynamic<AiChatAssistantModalProps>(
    () => import("./bodies/AiChatAssistant"),
);
const ShiftReportPreview = dynamic<ShiftReportPreviewModalProps>(
    () => import("./bodies/ShiftReportPreview"),
);
const ConfirmAction = dynamic<ConfirmActionModalProps>(
    () => import("./bodies/ConfirmAction"),
);
const MenuItemDetail = dynamic<MenuItemDetailModalProps>(
    () => import("./bodies/MenuItemDetail"),
);
const IngredientSelector = dynamic<IngredientSelectorModalProps>(
    () => import("./bodies/IngredientSelector"),
);
const TestModal = dynamic<ModalPropsMap["TEST_MODAL"]>(
    () => import("./bodies/TestModal"),
);

export const MODAL_REGISTRY = {
    RECIPE_DETAIL: {
        Component: RecipeDetail,
        defaultOptions: {
            title: "Recipe training",
            width: 720,
        },
    },
    AI_CHAT_ASSISTANT: {
        Component: AiChatAssistant,
        defaultOptions: {
            title: "AI assistant",
            width: 640,
        },
    },
    SHIFT_REPORT_PREVIEW: {
        Component: ShiftReportPreview,
        defaultOptions: {
            title: "Shift report preview",
            width: 600,
        },
    },
    CONFIRM_ACTION: {
        Component: ConfirmAction,
        defaultOptions: {
            title: "Confirm action",
            width: 480,
            confirmText: "Confirm",
            cancelText: "Cancel",
        },
    },
    MENU_ITEM_DETAIL: {
        Component: MenuItemDetail,
        defaultOptions: {
            title: "Menu item",
            width: 480,
            cancelText: "Cancel",
            confirmText: "Add to Order",
        },
    },
    INGREDIENT_SELECTOR: {
        Component: IngredientSelector,
        defaultOptions: {
            title: "Select ingredients",
            width: 680,
            cancelText: "Cancel",
            confirmText: "Select",
        },
    },
    TEST_MODAL: {
        Component: TestModal,
        defaultOptions: {
            title: "Test modal",
            width: 480,
        },
    },
} satisfies { [TModal in ModalType]: ModalDefinition<TModal> };

export function renderModalBody<TModal extends ModalType>(
    type: TModal,
    props: Partial<ModalPropsMap[ModalType]>,
): ReactNode {
    const Component = MODAL_REGISTRY[type].Component as ComponentType<
        ModalPropsMap[TModal]
    >;

    return <Component {...(props as ModalPropsMap[TModal])} />;
}
