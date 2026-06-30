export type Organization = {
    id: string;
    slug: string;
    name: string;
    defaultLocationSlug: string;
};

export type Location = {
    id: string;
    organizationId: string;
    slug: string;
    name: string;
    address: string;
    timezone: string;
    imageUrl: string;
};

export type TenantContext = {
    organization: Organization;
    location: Location;
};
