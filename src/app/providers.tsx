"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import UiModalRoot from "@/components/Ui/UiModals/UiModalRoot";
import { StoreWrapper } from "@/store/provider";

type ProvidersProps = {
    children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: 1,
                        refetchOnWindowFocus: false,
                        staleTime: 1000 * 60 * 5,
                    },
                },
            }),
    );

    return (
        <StoreWrapper>
            <QueryClientProvider client={queryClient}>
                {children}
                <UiModalRoot />
            </QueryClientProvider>
        </StoreWrapper>
    );
}
