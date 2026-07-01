"use client";

import { createContext, type ReactNode } from "react";

import { RootStore } from "./combineReducers";

export const StoreContext = createContext(RootStore);

export function StoreWrapper({ children }: { children: ReactNode }) {
    return (
        <StoreContext.Provider value={RootStore}>
            {children}
        </StoreContext.Provider>
    );
}
