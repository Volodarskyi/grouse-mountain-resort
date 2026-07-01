"use client";

import dynamic from "next/dynamic";
import type { ComponentType, ReactNode } from "react";

import type {
    AiChatAssistantModalProps,
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
