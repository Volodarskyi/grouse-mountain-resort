"use client";

import { Alert, Typography } from "antd";
import { useState } from "react";

import { UiButton } from "@/components/Ui/UiButton/UiButton";

import "./DevPage.Styles.scss";

type SeedState =
    | {
          type: "success";
          title: string;
      }
    | {
          type: "error";
          title: string;
      }
    | null;

export function DevSeedPanel() {
    const [seedState, setSeedState] = useState<SeedState>(null);
    const [isSeeding, setIsSeeding] = useState(false);

    async function handleSeed() {
        setIsSeeding(true);
        setSeedState(null);

        try {
            const response = await fetch("/api/dev/seed", {
                method: "POST",
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error ?? "Seed failed");
            }

            setSeedState({
                type: "success",
                title: `Seed complete: ${result.seed.organization.name}, ${result.seed.locations.length} locations`,
            });
        } catch (error) {
            setSeedState({
                type: "error",
                title: error instanceof Error ? error.message : "Seed failed",
            });
        } finally {
            setIsSeeding(false);
        }
    }

    return (
        <section className="dev-section">
            <div className="dev-section__header">
                <Typography.Title level={2}>Seed data</Typography.Title>
                <UiButton type="button" onClick={handleSeed} disabled={isSeeding}>
                    {isSeeding ? "Seeding..." : "Seed Organization & Locations"}
                </UiButton>
            </div>

            {seedState ? (
                <Alert
                    type={seedState.type}
                    title={seedState.title}
                    showIcon
                />
            ) : null}
        </section>
    );
}
