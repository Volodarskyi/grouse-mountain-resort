import { OrdersPlaceholderPage } from "@/views/OrdersPlaceholderPage/OrdersPlaceholderPage";

type PrepareOrderPageProps = {
    params: Promise<{
        organizationSlug: string;
        locationSlug: string;
    }>;
};

export default async function PrepareOrderPage({
    params,
}: PrepareOrderPageProps) {
    const { organizationSlug, locationSlug } = await params;
    const backHref = `/org/${organizationSlug}/location/${locationSlug}/orders`;

    return (
        <OrdersPlaceholderPage
            backHref={backHref}
            eyebrow="Production"
            title="Prepare Order"
            description="This screen will serve Front Desk, Kitchen, Bar, and Expo teams as the shared production and assembly board."
        />
    );
}
