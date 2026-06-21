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

    return (
        <Modal
            open={isOpen}
            onCancel={closeModal}
            footer={null}
            destroyOnHidden
            centered={options.centered ?? true}
            closable={options.closable ?? true}
            mask={{ closable: options.maskClosable ?? true }}
            keyboard={options.keyboard ?? true}
            title={options.title}
            width={options.width ?? 520}
            className={`app-modal ${options.className ?? ""}`.trim()}
        >
            {renderModalBody(activeModal, modalProps)}
        </Modal>
    );
});

export default UiModalRoot;
