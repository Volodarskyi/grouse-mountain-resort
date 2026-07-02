"use client";

import { Alert, Checkbox, Form, Input, InputNumber, Select } from "antd";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { UiButton } from "@/components/Ui/UiButton/UiButton";
import { menuItemStations } from "@/features/menu/model/menuItemConstants";

type MenuCreateOrganization = {
    id: string;
    name: string;
    slug: string;
};

type MenuCreateLocation = {
    id: string;
    organizationId: string;
    name: string;
    slug: string;
};

type MenuCreateFormValues = {
    organizationId: string;
    locationId: string;
    name: string;
    code: string;
    station: string;
    price: number;
    isActive: boolean;
};

type MenuCreateFormProps = {
    currentLocationId?: string;
    currentOrganizationId?: string;
    menuHref: string;
    organizations: MenuCreateOrganization[];
    locations: MenuCreateLocation[];
};

export function MenuCreateForm({
    currentLocationId,
    currentOrganizationId,
    locations,
    menuHref,
    organizations,
}: MenuCreateFormProps) {
    const router = useRouter();
    const [form] = Form.useForm<MenuCreateFormValues>();
    const [selectedOrganizationId, setSelectedOrganizationId] = useState(
        currentOrganizationId ?? organizations[0]?.id,
    );
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const locationOptions = useMemo(
        () =>
            locations.filter(
                (location) => location.organizationId === selectedOrganizationId,
            ),
        [locations, selectedOrganizationId],
    );

    async function handleSubmit(values: MenuCreateFormValues) {
        setIsSubmitting(true);
        setError("");

        try {
            const response = await fetch("/api/menu-items", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    organizationId: values.organizationId,
                    locationIds: [values.locationId],
                    name: values.name,
                    code: values.code,
                    station: values.station,
                    price: values.price,
                    isActive: values.isActive,
                }),
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error ?? "Menu item creation failed");
            }

            router.push(menuHref);
            router.refresh();
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Menu item creation failed",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={handleSubmit}
            initialValues={{
                organizationId: currentOrganizationId ?? organizations[0]?.id,
                locationId: currentLocationId ?? locationOptions[0]?.id,
                isActive: true,
            }}
            className="menu-create-page__form"
        >
            <Form.Item
                label="Organization"
                name="organizationId"
                rules={[{ required: true, message: "Select organization" }]}
            >
                <Select
                    options={organizations.map((organization) => ({
                        label: organization.name,
                        value: organization.id,
                    }))}
                    onChange={(organizationId) => {
                        setSelectedOrganizationId(organizationId);
                        const firstLocation = locations.find(
                            (location) =>
                                location.organizationId === organizationId,
                        );
                        form.setFieldValue("locationId", firstLocation?.id);
                    }}
                />
            </Form.Item>

            <Form.Item
                label="Location"
                name="locationId"
                rules={[{ required: true, message: "Select location" }]}
            >
                <Select
                    options={locationOptions.map((location) => ({
                        label: location.name,
                        value: location.id,
                    }))}
                />
            </Form.Item>

            <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Enter item name" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Code"
                name="code"
                rules={[{ required: true, message: "Enter item code" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Station"
                name="station"
                rules={[{ required: true, message: "Select station" }]}
            >
                <Select
                    options={menuItemStations.map((station) => ({
                        label: station,
                        value: station,
                    }))}
                />
            </Form.Item>

            <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: "Enter price" }]}
            >
                <InputNumber min={0} precision={2} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="isActive" valuePropName="checked">
                <Checkbox>Active</Checkbox>
            </Form.Item>

            {error ? <Alert type="error" title={error} showIcon /> : null}

            <div className="menu-create-page__actions">
                <UiButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create menu item"}
                </UiButton>
                <UiButton href={menuHref} variant="secondary">
                    Cancel
                </UiButton>
            </div>
        </Form>
    );
}
