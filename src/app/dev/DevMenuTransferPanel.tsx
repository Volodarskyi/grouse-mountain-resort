"use client";

import { Alert, Form, Input, Select, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";

import { UiButton } from "@/components/Ui/UiButton/UiButton";

type MenuTransferOrganization = {
    id: string;
    name: string;
    slug: string;
};

type MenuTransferLocation = {
    id: string;
    organizationId: string;
    name: string;
    slug: string;
};

type MenuTransferOptions = {
    organizations: MenuTransferOrganization[];
    locations: MenuTransferLocation[];
};

type TransferState =
    | {
          type: "success";
          title: string;
      }
    | {
          type: "error";
          title: string;
      }
    | null;

function buildExportFileName(
    organization?: MenuTransferOrganization,
    location?: MenuTransferLocation,
) {
    const organizationSlug = organization?.slug ?? "organization";
    const locationSlug = location?.slug ?? "location";

    return `${organizationSlug}-${locationSlug}-menu-transfer.json`;
}

function downloadJson(fileName: string, data: unknown) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
}

export function DevMenuTransferPanel() {
    const [options, setOptions] = useState<MenuTransferOptions>({
        organizations: [],
        locations: [],
    });
    const [organizationId, setOrganizationId] = useState("");
    const [locationId, setLocationId] = useState("");
    const [importJson, setImportJson] = useState("");
    const [state, setState] = useState<TransferState>(null);
    const [isLoadingOptions, setIsLoadingOptions] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    const filteredLocations = useMemo(
        () =>
            options.locations.filter(
                (location) => location.organizationId === organizationId,
            ),
        [options.locations, organizationId],
    );
    const selectedOrganization = options.organizations.find(
        (organization) => organization.id === organizationId,
    );
    const selectedLocation = options.locations.find(
        (location) => location.id === locationId,
    );

    useEffect(() => {
        const abortController = new AbortController();

        async function loadOptions() {
            setIsLoadingOptions(true);

            try {
                const response = await fetch("/api/dev/menu-transfer", {
                    signal: abortController.signal,
                });
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error ?? "Menu transfer options failed");
                }

                const loadedOptions = result.options as MenuTransferOptions;
                const firstOrganization = loadedOptions.organizations[0];
                const firstLocation = firstOrganization
                    ? loadedOptions.locations.find(
                          (location) =>
                              location.organizationId === firstOrganization.id,
                      )
                    : undefined;

                setOptions(loadedOptions);
                setOrganizationId(firstOrganization?.id ?? "");
                setLocationId(firstLocation?.id ?? "");
            } catch (error) {
                if (!abortController.signal.aborted) {
                    setState({
                        type: "error",
                        title:
                            error instanceof Error
                                ? error.message
                                : "Menu transfer options failed",
                    });
                }
            } finally {
                if (!abortController.signal.aborted) {
                    setIsLoadingOptions(false);
                }
            }
        }

        void loadOptions();

        return () => {
            abortController.abort();
        };
    }, []);

    function handleOrganizationChange(nextOrganizationId: string) {
        const nextLocation = options.locations.find(
            (location) => location.organizationId === nextOrganizationId,
        );

        setOrganizationId(nextOrganizationId);
        setLocationId(nextLocation?.id ?? "");
    }

    async function handleExport() {
        if (!organizationId || !locationId) {
            setState({
                type: "error",
                title: "Select organization and restaurant",
            });
            return;
        }

        setIsExporting(true);
        setState(null);

        try {
            const searchParams = new URLSearchParams({
                action: "export",
                organizationId,
                locationId,
            });
            const response = await fetch(`/api/dev/menu-transfer?${searchParams}`);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error ?? "Menu export failed");
            }

            const json = JSON.stringify(result.menuTransfer, null, 2);

            setImportJson(json);
            downloadJson(
                buildExportFileName(selectedOrganization, selectedLocation),
                result.menuTransfer,
            );
            setState({
                type: "success",
                title: "Menu JSON exported",
            });
        } catch (error) {
            setState({
                type: "error",
                title: error instanceof Error ? error.message : "Menu export failed",
            });
        } finally {
            setIsExporting(false);
        }
    }

    async function handleImport() {
        if (!organizationId || !locationId) {
            setState({
                type: "error",
                title: "Select organization and restaurant",
            });
            return;
        }

        setIsImporting(true);
        setState(null);

        try {
            const parsedJson = JSON.parse(importJson) as {
                menuTransfer?: unknown;
            };
            const data = parsedJson.menuTransfer ?? parsedJson;
            const response = await fetch("/api/dev/menu-transfer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    organizationId,
                    locationId,
                    data,
                }),
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error ?? "Menu import failed");
            }

            setState({
                type: "success",
                title: `Import complete: ${result.result.groupsCreated} groups created, ${result.result.groupsUpdated} groups updated, ${result.result.menuItemsCreated} items created, ${result.result.menuItemsUpdated} items updated`,
            });
        } catch (error) {
            setState({
                type: "error",
                title: error instanceof Error ? error.message : "Menu import failed",
            });
        } finally {
            setIsImporting(false);
        }
    }

    async function handleFileChange(file?: File) {
        if (!file) {
            return;
        }

        setImportJson(await file.text());
    }

    return (
        <section className="dev-section">
            <div className="dev-section__header">
                <Typography.Title level={2}>Menu transfer</Typography.Title>
            </div>

            <Form layout="vertical" requiredMark={false} className="dev-transfer">
                <Form.Item label="Organization">
                    <Select
                        value={organizationId || undefined}
                        loading={isLoadingOptions}
                        onChange={handleOrganizationChange}
                        options={options.organizations.map((organization) => ({
                            label: organization.name,
                            value: organization.id,
                        }))}
                    />
                </Form.Item>

                <Form.Item label="Restaurant">
                    <Select
                        value={locationId || undefined}
                        disabled={!organizationId}
                        onChange={setLocationId}
                        options={filteredLocations.map((location) => ({
                            label: location.name,
                            value: location.id,
                        }))}
                    />
                </Form.Item>

                <div className="dev-transfer__actions">
                    <UiButton
                        type="button"
                        onClick={handleExport}
                        disabled={isExporting || !organizationId || !locationId}
                    >
                        {isExporting ? "Exporting..." : "Export menu JSON"}
                    </UiButton>
                </div>

                <Form.Item label="Import JSON">
                    <Input.TextArea
                        value={importJson}
                        onChange={(event) => setImportJson(event.target.value)}
                        rows={10}
                        placeholder="Paste menu transfer JSON here"
                    />
                </Form.Item>

                <input
                    type="file"
                    accept="application/json,.json"
                    onChange={(event) => {
                        void handleFileChange(event.target.files?.[0]);
                    }}
                />

                <div className="dev-transfer__actions">
                    <UiButton
                        type="button"
                        onClick={handleImport}
                        disabled={
                            isImporting ||
                            !organizationId ||
                            !locationId ||
                            !importJson.trim()
                        }
                    >
                        {isImporting ? "Importing..." : "Import menu JSON"}
                    </UiButton>
                </div>

                {state ? (
                    <Alert type={state.type} title={state.title} showIcon />
                ) : null}
            </Form>
        </section>
    );
}
