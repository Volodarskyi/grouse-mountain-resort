"use client";

import { Alert, Form, Input, Typography } from "antd";
import { useState } from "react";

import { UiButton } from "@/components/Ui/UiButton/UiButton";

import "./DevPage.Styles.scss";

type CreateUserFormValues = {
    firstName: string;
    secondName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type SubmitState =
    | {
          type: "success";
          message: string;
      }
    | {
          type: "error";
          message: string;
      }
    | null;

export function DevCreateUserForm() {
    const [form] = Form.useForm<CreateUserFormValues>();
    const [submitState, setSubmitState] = useState<SubmitState>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(values: CreateUserFormValues) {
        setIsSubmitting(true);
        setSubmitState(null);

        try {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName: values.firstName,
                    secondName: values.secondName,
                    email: values.email,
                    password: values.password,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error ?? "User creation failed");
            }

            form.resetFields();
            setSubmitState({
                type: "success",
                message: `User ${result.user.email} created`,
            });
        } catch (error) {
            setSubmitState({
                type: "error",
                message:
                    error instanceof Error
                        ? error.message
                        : "User creation failed",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="dev-section">
            <Typography.Title level={2}>Create user</Typography.Title>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
                className="dev-user-form"
            >
                <Form.Item
                    label="First name"
                    name="firstName"
                    rules={[{ required: true, message: "Enter first name" }]}
                >
                    <Input autoComplete="given-name" />
                </Form.Item>

                <Form.Item
                    label="Second name"
                    name="secondName"
                    rules={[{ required: true, message: "Enter second name" }]}
                >
                    <Input autoComplete="family-name" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Enter email" },
                        { type: "email", message: "Enter valid email" },
                    ]}
                >
                    <Input autoComplete="email" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        { required: true, message: "Enter password" },
                        {
                            min: 8,
                            message: "Password must be at least 8 characters",
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password autoComplete="new-password" />
                </Form.Item>

                <Form.Item
                    label="Confirm password"
                    name="confirmPassword"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                        { required: true, message: "Confirm password" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }

                                return Promise.reject(
                                    new Error("Passwords do not match"),
                                );
                            },
                        }),
                    ]}
                >
                    <Input.Password autoComplete="new-password" />
                </Form.Item>

                {submitState ? (
                    <Alert
                        type={submitState.type}
                        title={submitState.message}
                        showIcon
                    />
                ) : null}

                <UiButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create user"}
                </UiButton>
            </Form>
        </section>
    );
}
