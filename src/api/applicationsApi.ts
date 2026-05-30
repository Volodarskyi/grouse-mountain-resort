import { apiClient } from "./apiClient";

import type {
    Application,
    CreateApplication,
} from "@/types/applications";

export async function createApplication(
    data: CreateApplication,
): Promise<Application> {
    const response = await apiClient.post<Application>(
        "/applications",
        data,
    );

    return response.data;
}

export async function getApplications(): Promise<Application[]> {
    const response = await apiClient.get<Application[]>(
        "/applications",
    );

    return response.data;
}

export async function getApplicationById(
    id: string,
): Promise<Application> {
    const response = await apiClient.get<Application>(
        `/applications/${id}`,
    );

    return response.data;
}

export async function updateApplication(
    id: string,
    data: Partial<Application>,
): Promise<Application> {
    const response = await apiClient.put<Application>(
        `/applications/${id}`,
        data,
    );

    return response.data;
}