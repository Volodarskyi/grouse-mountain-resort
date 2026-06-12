import { useContext } from "react";

import { StoreContext } from "@/store/provider";

export function useStores() {
    return useContext(StoreContext);
}
