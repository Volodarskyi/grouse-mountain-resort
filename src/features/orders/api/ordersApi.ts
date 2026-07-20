import { apiClient } from "@/api/apiClient";
import type { OrderItemStatus, OrderStatus } from "@/features/orders/model/Order";
import type { ProductionArea } from "@/features/workstations/model/workstationConstants";

export type OrderModificationDto = {
    code: string;
    name: string;
    quantity?: number;
    type: "added" | "removed";
};

export type OrderItemDto = {
    handedOffAt: string;
    id: string;
    imageUrl: string;
    menuItemId: string;
    modifications: OrderModificationDto[];
    name: string;
    packedAt: string;
    preparedByUserId: string;
    price: number;
    previousStatus: OrderItemStatus | "";
    productionArea: ProductionArea;
    quantity: number;
    readyAt: string;
    station: string;
    status: OrderItemStatus;
    workstationId: string;
    workstationName: string;
};

export type OrderDto = {
    businessDate: string;
    clientRequestId: string;
    createdAt: string;
    customerName: string;
    id: string;
    items: OrderItemDto[];
    notes: string;
    orderNumber: string;
    status: OrderStatus;
    total: number;
    updatedAt: string;
};

export type CreateOrderPayload = {
    clientRequestId: string;
    customerName: string;
    items: Array<{
        menuItemId: string;
        modifications: OrderModificationDto[];
        quantity: number;
    }>;
    notes: string;
};

function getOrdersPath(organizationSlug: string, locationSlug: string) {
    return `/api/org/${organizationSlug}/location/${locationSlug}/orders`;
}

export async function createOrder(
    organizationSlug: string,
    locationSlug: string,
    payload: CreateOrderPayload,
) {
    const response = await apiClient.post<{ order: OrderDto }>(
        getOrdersPath(organizationSlug, locationSlug),
        payload,
    );

    return response.data.order;
}

export async function getActiveOrders(
    organizationSlug: string,
    locationSlug: string,
) {
    const response = await apiClient.get<{ orders: OrderDto[] }>(
        getOrdersPath(organizationSlug, locationSlug),
    );

    return response.data.orders;
}

export async function updateOrderStatus(
    organizationSlug: string,
    locationSlug: string,
    orderId: string,
    status: OrderStatus,
) {
    const response = await apiClient.patch<{ order: OrderDto }>(
        `${getOrdersPath(organizationSlug, locationSlug)}/${orderId}`,
        {
            status,
        },
    );

    return response.data.order;
}

export async function updateOrderItemStatus(
    organizationSlug: string,
    locationSlug: string,
    orderId: string,
    itemId: string,
    status: OrderItemStatus,
) {
    const response = await apiClient.patch<{ order: OrderDto }>(
        `${getOrdersPath(organizationSlug, locationSlug)}/${orderId}/items/${itemId}`,
        {
            status,
        },
    );

    return response.data.order;
}
