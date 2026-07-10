import drawerStore from "./reducers/drawerStore";
import modalStore from "./reducers/modalStore";

export const RootStore = {
    drawerStore,
    modalStore,
};

export type RootStoreType = typeof RootStore;
