"use client";

import { Alert, Checkbox, Form, Input, InputNumber, Modal, Select } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { UiButton } from "@/components/Ui/UiButton/UiButton";
import { menuGroupIcons } from "@/features/menu/model/menuGroupConstants";
import { menuItemStations } from "@/features/menu/model/menuItemConstants";

type MenuCreateFormValues = {
    groupId: string;
    name: string;
    code: string;
    station: string;
    price: number;
    isActive: boolean;
};

type MenuCreateFormProps = {
    currentLocationId?: string;
    currentOrganizationId?: string;
    initialMenuItem?: {
        id: string;
        organizationId: string;
        locationIds: string[];
        groupId: string;
        name: string;
        code: string;
        station: string;
        price: number;
        isActive: boolean;
    };
    menuHref: string;
    mode?: "create" | "edit";
};

type MenuGroupOption = {
    id: string;
    name: string;
    icon: string;
};

type MenuGroupFormValues = {
    name: string;
    icon: string;
};

const addGroupValue = "__add_group__";

function getMenuGroupIconLabel(icon: string) {
    const fileName = icon.split("/").at(-1) ?? icon;

    return fileName
        .replace(/^icon-/, "")
        .replace(/\.svg$/i, "")
        .replaceAll("-", " ");
}

export function MenuCreateForm({
    currentLocationId,
    currentOrganizationId,
    initialMenuItem,
    menuHref,
    mode = "create",
}: MenuCreateFormProps) {
    const router = useRouter();
    const [form] = Form.useForm<MenuCreateFormValues>();
    const organizationId = currentOrganizationId ?? initialMenuItem?.organizationId;
    const locationId = currentLocationId ?? initialMenuItem?.locationIds[0];
    const [groupForm] = Form.useForm<MenuGroupFormValues>();
    const [groups, setGroups] = useState<MenuGroupOption[]>([]);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isGroupsLoading, setIsGroupsLoading] = useState(false);
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!organizationId || !locationId) {
            setGroups([]);
            return;
        }

        const abortController = new AbortController();
        const resolvedOrganizationId = organizationId;
        const resolvedLocationId = locationId;

        async function loadGroups() {
            setIsGroupsLoading(true);

            try {
                const searchParams = new URLSearchParams({
                    organizationId: resolvedOrganizationId,
                    locationId: resolvedLocationId,
                });
                const response = await fetch(`/api/menu-groups?${searchParams}`, {
                    signal: abortController.signal,
                });
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error ?? "Groups loading failed");
                }

                setGroups(result.groups);
            } catch (requestError) {
                if (!abortController.signal.aborted) {
                    setError(
                        requestError instanceof Error
                            ? requestError.message
                            : "Groups loading failed",
                    );
                }
            } finally {
                if (!abortController.signal.aborted) {
                    setIsGroupsLoading(false);
                }
            }
        }

        void loadGroups();

            return () => {
                abortController.abort();
            };
    }, [locationId, organizationId]);

    async function handleSubmit(values: MenuCreateFormValues) {
        setIsSubmitting(true);
        setError("");

        try {
            if (!organizationId || !locationId) {
                throw new Error("Organization or location is not resolved");
            }

            const response = await fetch(
                mode === "edit" && initialMenuItem
                    ? `/api/menu-items/${initialMenuItem.id}`
                    : "/api/menu-items",
                {
                    method: mode === "edit" ? "PATCH" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        organizationId,
                        locationIds: [locationId],
                        groupId: values.groupId,
                        name: values.name,
                        code: values.code,
                        station: values.station,
                        price: values.price,
                        isActive: values.isActive,
                    }),
                },
            );
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error ?? "Menu item saving failed");
            }

            router.push(menuHref);
            router.refresh();
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Menu item saving failed",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleCreateGroup(values: MenuGroupFormValues) {
        if (!organizationId || !locationId) {
            setError("Organization or location is not resolved");
            return;
        }

        setIsCreatingGroup(true);
        setError("");

        try {
            const response = await fetch("/api/menu-groups", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    organizationId,
                    locationId,
                    name: values.name,
                    icon: values.icon,
                }),
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error ?? "Group creation failed");
            }

            setGroups((currentGroups) =>
                [...currentGroups, result.group].sort((left, right) =>
                    left.name.localeCompare(right.name),
                ),
            );
            form.setFieldValue("groupId", result.group.id);
            groupForm.resetFields();
            setIsGroupModalOpen(false);
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Group creation failed",
            );
        } finally {
            setIsCreatingGroup(false);
        }
    }

    return (
        <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={handleSubmit}
            initialValues={{
                groupId: initialMenuItem?.groupId,
                name: initialMenuItem?.name,
                code: initialMenuItem?.code,
                station: initialMenuItem?.station,
                price: initialMenuItem?.price,
                isActive: initialMenuItem?.isActive ?? true,
            }}
            className="menu-create-page__form"
        >
            <Form.Item
                label="Group"
                name="groupId"
                rules={[{ required: true, message: "Select group" }]}
            >
                <Select
                    loading={isGroupsLoading}
                    optionLabelProp="label"
                    onChange={(groupId) => {
                        if (groupId === addGroupValue) {
                            form.setFieldValue("groupId", undefined);
                            setIsGroupModalOpen(true);
                        }
                    }}
                    options={[
                        ...groups.map((group) => ({
                            label: group.name,
                            value: group.id,
                            icon: group.icon,
                        })),
                        {
                            label: "Add group",
                            value: addGroupValue,
                            icon: "",
                        },
                    ]}
                    labelRender={(option) => {
                        const group = groups.find(
                            (currentGroup) => currentGroup.id === option.value,
                        );

                        return group ? (
                            <span className="menu-create-page__group-option">
                                <Image
                                    src={group.icon}
                                    alt=""
                                    width={24}
                                    height={24}
                                />
                                {group.name}
                            </span>
                        ) : (
                            option.label
                        );
                    }}
                    optionRender={(option) =>
                        option.value === addGroupValue ? (
                            <span className="menu-create-page__group-add">
                                Add group
                            </span>
                        ) : (
                            <span className="menu-create-page__group-option">
                                <Image
                                    src={String(option.data.icon)}
                                    alt=""
                                    width={24}
                                    height={24}
                                />
                                {option.label}
                            </span>
                        )
                    }
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
                    {isSubmitting
                        ? "Saving..."
                        : mode === "edit"
                          ? "Save menu item"
                          : "Create menu item"}
                </UiButton>
                <UiButton href={menuHref} variant="secondary">
                    Cancel
                </UiButton>
            </div>

            <Modal
                title="Add group"
                open={isGroupModalOpen}
                onCancel={() => setIsGroupModalOpen(false)}
                footer={null}
                destroyOnHidden
            >
                <Form
                    form={groupForm}
                    layout="vertical"
                    requiredMark={false}
                    onFinish={handleCreateGroup}
                    initialValues={{
                        icon: menuGroupIcons[0],
                    }}
                >
                    <Form.Item
                        label="Icon"
                        name="icon"
                        rules={[{ required: true, message: "Select icon" }]}
                    >
                        <Select
                            options={menuGroupIcons.map((icon) => ({
                                label: getMenuGroupIconLabel(icon),
                                value: icon,
                            }))}
                            optionLabelProp="label"
                            optionRender={(option) => (
                                <span className="menu-create-page__group-option">
                                    <Image
                                        src={String(option.value)}
                                        alt=""
                                        width={24}
                                        height={24}
                                    />
                                    {option.label}
                                </span>
                            )}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: "Enter group name" }]}
                    >
                        <Input />
                    </Form.Item>

                    <UiButton type="submit" disabled={isCreatingGroup}>
                        {isCreatingGroup ? "Adding..." : "Add group"}
                    </UiButton>
                </Form>
            </Modal>
        </Form>
    );
}
