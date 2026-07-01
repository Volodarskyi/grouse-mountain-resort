"use client";

import { Modal } from "antd";
import { observer } from "mobx-react-lite";

import { useStores } from "@/store/hooks/useStores";

import { MODAL_REGISTRY, renderModalBody } from "./ModalRegistry";
import "./UiModalRoot.Styles.scss";

const UiModalRoot = observer(() => {
    const {
        modalStore: {
            activeModal,
            modalProps,
            modalOptions,
            closeModal,
            isOpen,
        },
    } = useStores();

    if (!activeModal) {
        return null;
    }

    const modalDefinition = MODAL_REGISTRY[activeModal];
    const options = {
        ...modalDefinition.defaultOptions,
        ...modalOptions,
    };

    const handleCancel = () => {
        options.onCancel?.();
        closeModal();
    };

    const handleConfirm = () => {
        options.onConfirm?.();
        closeModal();
    };

    return (
        <Modal
            open={isOpen}
            onCancel={handleCancel}
            footer={null}
            destroyOnHidden
            centered={options.centered ?? true}
            closable={false}
            mask={{ closable: options.maskClosable ?? true }}
            keyboard={options.keyboard ?? true}
            title={null}
            width={options.width ?? 520}
            className={`app-modal ${options.className ?? ""}`.trim()}
        >
            <div className="app-modal__shell">
                <div className="app-modal__header">
                    <h2 className="app-modal__title">{options.title}</h2>
                </div>
                <div className="app-modal__body">
                    {renderModalBody(activeModal, modalProps)}
                </div>
                <footer className="app-modal__footer">
                    <button
                        type="button"
                        className="app-modal__button app-modal__button--secondary"
                        onClick={handleCancel}
                    >
                        {options.cancelText ?? "Cancel"}
                    </button>
                    <button
                        type="button"
                        className="app-modal__button"
                        onClick={handleConfirm}
                    >
                        {options.confirmText ?? "Confirm"}
                    </button>
                </footer>
            </div>
        </Modal>
    );
});

export default UiModalRoot;
