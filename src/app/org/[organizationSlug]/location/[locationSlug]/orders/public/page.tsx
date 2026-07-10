import { OrdersPlaceholderPage } from "@/views/OrdersPlaceholderPage/OrdersPlaceholderPage";

type PublicOrdersPageProps = {
    params: Promise<{
        organizationSlug: string;
        locationSlug: string;
    }>;
};

export default async function PublicOrdersPage({
    params,
}: PublicOrdersPageProps) {
    const { organizationSlug, locationSlug } = await params;
    const backHref = `/org/${organizationSlug}/location/${locationSlug}/orders`;

    return (
        <OrdersPlaceholderPage
            backHref={backHref}
            eyebrow="Coming soon"
            title="Public Ordering"
            description="Guest phone ordering is planned for a future release. This internal route is reserved as a module entry point only."
        />
    );
}
