"use client";

import { Alert, Empty, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";

import { UiButton } from "@/components/Ui/UiButton/UiButton";

import "./DevPage.Styles.scss";

type DevUser = {
    id: string;
    firstName: string;
    secondName: string;
    email: string;
    role?: string;
    status: string;
    createdAt?: string;
};

const columns: ColumnsType<DevUser> = [
    {
        title: "Name",
        key: "name",
        render: (_, user) => `${user.firstName} ${user.secondName}`,
    },
    {
        title: "Email",
        dataIndex: "email",
        key: "email",
    },
    {
        title: "Role",
        dataIndex: "role",
        key: "role",
        render: (role) => role || "-",
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
    },
    {
        title: "Created",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (createdAt) =>
            createdAt ? new Date(createdAt).toLocaleString() : "-",
    },
];

export function DevUsersList() {
    const [users, setUsers] = useState<DevUser[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    async function handleGetAllUsers() {
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/users");
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error ?? "Users loading failed");
            }

            setUsers(result.users);
            setHasLoaded(true);
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Users loading failed",
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section className="dev-section">
            <div className="dev-section__header">
                <Typography.Title level={2}>Users</Typography.Title>
                <UiButton
                    type="button"
                    onClick={handleGetAllUsers}
                    disabled={isLoading}
                >
                    {isLoading ? "Loading..." : "Get All Users"}
                </UiButton>
            </div>

            {error ? <Alert type="error" title={error} showIcon /> : null}

            {hasLoaded && users.length === 0 ? (
                <Empty description="No users found" />
            ) : null}

            {users.length > 0 ? (
                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="id"
                    pagination={false}
                    scroll={{ x: true }}
                    size="middle"
                />
            ) : null}
        </section>
    );
}
