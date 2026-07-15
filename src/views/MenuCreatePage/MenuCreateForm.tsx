"use client";

import { Alert, Checkbox, Form, Input, InputNumber, Modal, Select } from "antd";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { UiButton } from "@/components/Ui/UiButton/UiButton";
import { menuGroupIcons } from "@/features/menu/model/menuGroupConstants";
import { menuItemStations } from "@/features/menu/model/menuItemConstants";
import { ingredients } from "@/features/training/model/trainingData";
import { useStores } from "@/store/hooks/useStores";

type MenuCreateFormValues = {
    groupId: string;
    name: string;
    code: string;
    imageUrl: string;
    station: string;
    price: number;
    isModifiable: boolean;
    includedIngredientCodes: string[];
    addOnIngredientCodes: string[];
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
        imageUrl: string;
        station: string;
        price: number;
        isModifiable: boolean;
        includedIngredientCodes: string[];
        addOnIngredientCodes: string[];
        isActive: boolean;
    };
    menuHref: string;
    mode?: "create" | "edit";
    photoOptions: Array<{
        fileName: string;
        imageUrl: string;
    }>;
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
    photoOptions,
}: MenuCreateFormProps) {
    const router = useRouter();
    const { modalStore } = useStores();
    const [form] = Form.useForm<MenuCreateFormValues>();
    const selectedIngredientCodesRef = useRef<string[]>([]);
    const organizationId = currentOrganizationId ?? initialMenuItem?.organizationId;
    const locationId = currentLocationId ?? initialMenuItem?.locationIds[0];
    const [groupForm] = Form.useForm<MenuGroupFormValues>();
    const [groups, setGroups] = useState<MenuGroupOption[]>([]);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isGroupsLoading, setIsGroupsLoading] = useState(false);
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [includedIngredientCodes, setIncludedIngredientCodes] = useState(
        initialMenuItem?.includedIngredientCodes ?? [],
    );
    const [addOnIngredientCodes, setAddOnIngredientCodes] = useState(
        initialMenuItem?.addOnIngredientCodes ?? [],
    );
    const imageUrl = Form.useWatch("imageUrl", form) ?? "";
    const isModifiable = Form.useWatch("isModifiable", form) ?? false;

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
                        imageUrl: values.imageUrl,
                        station: values.station,
                        price: values.price,
                        isModifiable: values.isModifiable,
                        includedIngredientCodes: values.isModifiable
                            ? includedIngredientCodes
                            : [],
                        addOnIngredientCodes: values.isModifiable
                            ? addOnIngredientCodes
                            : [],
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

    function openIngredientSelector({
        fieldName,
        title,
    }: {
        fieldName: "includedIngredientCodes" | "addOnIngredientCodes";
        title: string;
    }) {
        const currentSelectedCodes =
            fieldName === "includedIngredientCodes"
                ? includedIngredientCodes
                : addOnIngredientCodes;

        selectedIngredientCodesRef.current = currentSelectedCodes;
        modalStore.openModal(
            "INGREDIENT_SELECTOR",
            {
                ingredients,
                selectedCodes: currentSelectedCodes,
                onSelectionChange: (selectedCodes) => {
                    selectedIngredientCodesRef.current = selectedCodes;
                },
            },
            {
                title,
                cancelText: "Cancel",
                confirmText: "Select",
                onConfirm: () => {
                    if (fieldName === "includedIngredientCodes") {
                        setIncludedIngredientCodes(
                            selectedIngredientCodesRef.current,
                        );
                    } else {
                        setAddOnIngredientCodes(selectedIngredientCodesRef.current);
                    }
                },
            },
        );
    }

    function removeIngredientCode(
        fieldName: "includedIngredientCodes" | "addOnIngredientCodes",
        ingredientCode: string,
    ) {
        const currentCodes =
            fieldName === "includedIngredientCodes"
                ? includedIngredientCodes
                : addOnIngredientCodes;
        const nextCodes = currentCodes.filter(
            (code: string) => code !== ingredientCode,
        );

        if (fieldName === "includedIngredientCodes") {
            setIncludedIngredientCodes(nextCodes);
        } else {
            setAddOnIngredientCodes(nextCodes);
        }
    }

    function renderIngredientList(
        fieldName: "includedIngredientCodes" | "addOnIngredientCodes",
        ingredientCodes: string[],
    ) {
        const selectedIngredients = ingredients.filter((ingredient) =>
            ingredientCodes.includes(ingredient.code),
        );

        if (selectedIngredients.length === 0) {
            return (
                <p className="menu-create-page__ingredients-empty">
                    No ingredients selected
                </p>
            );
        }

        return (
            <div className="menu-create-page__ingredients-list">
                {selectedIngredients.map((ingredient) => (
                    <span
                        key={ingredient.code}
                        className="menu-create-page__ingredient-chip"
                    >
                        <span className="menu-create-page__ingredient-image">
                            <Image
                                src={ingredient.imgUrl}
                                alt=""
                                fill
                                sizes="28px"
                            />
                        </span>
                        <span>{ingredient.name}</span>
                        <button
                            type="button"
                            aria-label={`Remove ${ingredient.name}`}
                            onClick={() =>
                                removeIngredientCode(fieldName, ingredient.code)
                            }
                        >
                            x
                        </button>
                    </span>
                ))}
            </div>
        );
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
                imageUrl: initialMenuItem?.imageUrl ?? "",
                station: initialMenuItem?.station,
                price: initialMenuItem?.price,
                isModifiable: initialMenuItem?.isModifiable ?? false,
                includedIngredientCodes:
                    initialMenuItem?.includedIngredientCodes ?? [],
                addOnIngredientCodes: initialMenuItem?.addOnIngredientCodes ?? [],
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

            <div className="menu-create-page__image-field">
                <span className="menu-create-page__image-label">Photo</span>
                <div className="menu-create-page__image-row">
                    <span className="menu-create-page__image-preview">
                        {imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt="Menu item photo"
                                fill
                                sizes="96px"
                            />
                        ) : (
                            <span>No image</span>
                        )}
                    </span>
                    <Form.Item name="imageUrl" className="menu-create-page__photo-select">
                        <Select
                            allowClear
                            placeholder="Select photo"
                            optionLabelProp="label"
                            options={photoOptions.map((photoOption) => ({
                                label: photoOption.fileName,
                                value: photoOption.imageUrl,
                                imageUrl: photoOption.imageUrl,
                            }))}
                            labelRender={(option) => {
                                const photoOption = photoOptions.find(
                                    (currentPhotoOption) =>
                                        currentPhotoOption.imageUrl ===
                                        option.value,
                                );

                                return photoOption ? (
                                    <span className="menu-create-page__photo-option">
                                        <span className="menu-create-page__photo-option-image">
                                            <Image
                                                src={photoOption.imageUrl}
                                                alt=""
                                                fill
                                                sizes="32px"
                                            />
                                        </span>
                                        {photoOption.fileName}
                                    </span>
                                ) : (
                                    option.label
                                );
                            }}
                            optionRender={(option) => (
                                <span className="menu-create-page__photo-option">
                                    <span className="menu-create-page__photo-option-image">
                                        <Image
                                            src={String(option.data.imageUrl)}
                                            alt=""
                                            fill
                                            sizes="32px"
                                        />
                                    </span>
                                    {option.label}
                                </span>
                            )}
                        />
                    </Form.Item>
                </div>
            </div>

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

            <Form.Item name="isModifiable" valuePropName="checked">
                <Checkbox>Modifications</Checkbox>
            </Form.Item>

            {isModifiable ? (
                <section className="menu-create-page__modifications">
                    <div className="menu-create-page__ingredients-section">
                        <div className="menu-create-page__ingredients-header">
                            <h2>Include</h2>
                            <UiButton
                                type="button"
                                variant="secondary"
                                onClick={() =>
                                    openIngredientSelector({
                                        fieldName: "includedIngredientCodes",
                                        title: "Select include ingredients",
                                    })
                                }
                            >
                                Add
                            </UiButton>
                        </div>
                        {renderIngredientList(
                            "includedIngredientCodes",
                            includedIngredientCodes,
                        )}
                    </div>

                    <div className="menu-create-page__ingredients-section">
                        <div className="menu-create-page__ingredients-header">
                            <h2>Add-on</h2>
                            <UiButton
                                type="button"
                                variant="secondary"
                                onClick={() =>
                                    openIngredientSelector({
                                        fieldName: "addOnIngredientCodes",
                                        title: "Select add-on ingredients",
                                    })
                                }
                            >
                                Add
                            </UiButton>
                        </div>
                        {renderIngredientList(
                            "addOnIngredientCodes",
                            addOnIngredientCodes,
                        )}
                    </div>
                </section>
            ) : null}

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
