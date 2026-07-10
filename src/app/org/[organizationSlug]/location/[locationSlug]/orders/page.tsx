import { OrdersHomePage } from "@/views/OrdersHomePage/OrdersHomePage";

type OrdersModulePageProps = {
    params: Promise<{
        organizationSlug: string;
        locationSlug: string;
    }>;
};

export default async function OrdersModulePage({
    params,
}: OrdersModulePageProps) {
    const { organizationSlug, locationSlug } = await params;
    const baseHref = `/org/${organizationSlug}/location/${locationSlug}/orders`;

    return <OrdersHomePage baseHref={baseHref} />;
}
