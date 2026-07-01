import Image from "next/image";

import { UiButton } from "@/components/Ui/UiButton/UiButton";
import type { Location, Organization } from "@/features/tenancy/model/tenancy";

import "./OrganizationLocationsPage.Styles.scss";

type OrganizationLocationsPageProps = {
    organization: Organization;
    locations: Location[];
};

export function OrganizationLocationsPage({
    organization,
    locations,
}: OrganizationLocationsPageProps) {
    return (
        <main className="organization-locations-page">
            <section className="organization-locations-page__hero">
                <p className="organization-locations-page__eyebrow">
                    Organization
                </p>
                <h1 className="organization-locations-page__title">
                    {organization.name}
                </h1>
            </section>

            <section
                className="organization-locations-page__grid"
                aria-label="Restaurant locations"
            >
                {locations.map((location) => (
                    <article
                        key={location.id}
                        className="organization-locations-page__card"
                    >
                        <div className="organization-locations-page__image-wrapper">
                            <Image
                                src={location.imageUrl}
                                alt={location.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 360px"
                                className="organization-locations-page__image"
                            />
                        </div>
                        <div className="organization-locations-page__card-content">
                            <h2 className="organization-locations-page__card-title">
                                {location.name}
                            </h2>
                            <p className="organization-locations-page__card-text">
                                {location.address}
                            </p>
                            <UiButton
                                href={`/org/${organization.slug}/location/${location.slug}`}
                                size="m"
                                variant="primary"
                                className="organization-locations-page__card-button"
                            >
                                Open Workspace
                            </UiButton>
                        </div>
                    </article>
                ))}
            </section>
        </main>
    );
}
