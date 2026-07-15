import { makeAutoObservable } from "mobx";

export type ModalType =
    | "RECIPE_DETAIL"
    | "AI_CHAT_ASSISTANT"
    | "SHIFT_REPORT_PREVIEW"
    | "CONFIRM_ACTION"
    | "MENU_ITEM_DETAIL"
    | "INGREDIENT_SELECTOR"
    | "TEST_MODAL";

export type RecipeDetailModalProps = {
    recipeId: string;
    recipeName: string;
    description?: string;
};

export type AiChatAssistantModalProps = {
    context?: string;
    initialMessage?: string;
};

export type ShiftReportPreviewModalProps = {
    reportId: string;
    aiErrors: string[];
};

export type TestModalProps = {
    message: string;
    openedFrom: string;
};

export type ConfirmActionModalProps = {
    message: string;
    customerNameLabel?: string;
    details?: string;
    initialNotes?: string;
    notesLabel?: string;
    onCustomerNameChange?: (customerName: string) => void;
    onNotesChange?: (notes: string) => void;
    summaryItems?: Array<{
        label: string;
        value: string;
    }>;
};

export type MenuItemDetailModalProps = {
    addOnIngredients: Array<{
        code: string;
        imgUrl: string;
        name: string;
    }>;
    calories: number;
    description: string;
    imageUrl: string;
    includedIngredients: Array<{
        code: string;
        imgUrl: string;
        name: string;
    }>;
    initialCustomization?: MenuItemCustomization;
    isModifiable: boolean;
    name: string;
    onCustomizationChange?: (customization: MenuItemCustomization) => void;
    price: number;
};

export type MenuItemCustomization = {
    addOnIngredientCounts: Record<string, number>;
    includedIngredientCounts: Record<string, number>;
    quantity: number;
};

export type IngredientSelectorModalProps = {
    ingredients: Array<{
        code: string;
        imgUrl: string;
        name: string;
    }>;
    selectedCodes: string[];
    onSelectionChange: (selectedCodes: string[]) => void;
};

export type ModalPropsMap = {
    RECIPE_DETAIL: RecipeDetailModalProps;
    AI_CHAT_ASSISTANT: AiChatAssistantModalProps;
    SHIFT_REPORT_PREVIEW: ShiftReportPreviewModalProps;
    CONFIRM_ACTION: ConfirmActionModalProps;
    MENU_ITEM_DETAIL: MenuItemDetailModalProps;
    INGREDIENT_SELECTOR: IngredientSelectorModalProps;
    TEST_MODAL: TestModalProps;
};

export type ModalOptions = {
    title?: string;
    width?: number | string;
    centered?: boolean;
    closable?: boolean;
    maskClosable?: boolean;
    keyboard?: boolean;
    className?: string;
    cancelText?: string;
    confirmText?: string;
    onCancel?: () => void;
    onConfirm?: () => void;
};

class ModalStore {
    activeModal: ModalType | null = null;
    modalProps: Partial<ModalPropsMap[ModalType]> = {};
    modalOptions: ModalOptions = {};

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    get isOpen() {
        return this.activeModal !== null;
    }

    openModal<TModal extends ModalType>(
        type: TModal,
        props: ModalPropsMap[TModal],
        options: ModalOptions = {},
    ) {
        this.activeModal = type;
        this.modalProps = props;
        this.modalOptions = options;
    }

    closeModal() {
        this.activeModal = null;
        this.modalProps = {};
        this.modalOptions = {};
    }

    setModalProps<TModal extends ModalType>(props: Partial<ModalPropsMap[TModal]>) {
        this.modalProps = {
            ...this.modalProps,
            ...props,
        };
    }
}

const modalStore = new ModalStore();

export default modalStore;
