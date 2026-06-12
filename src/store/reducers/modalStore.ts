import { makeAutoObservable } from "mobx";

class ModalStore {
    isOpen = false;
    name: string | null = null;
    payload: unknown = null;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    openModal(name: string, payload?: unknown) {
        this.isOpen = true;
        this.name = name;
        this.payload = payload ?? null;
    }

    closeModal() {
        this.isOpen = false;
        this.name = null;
        this.payload = null;
    }

    setPayload(payload: unknown) {
        this.payload = payload;
    }
}

const modalStore = new ModalStore();

export default modalStore;
