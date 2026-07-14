import { saveMenuItemImage } from "@/features/menu/lib/menuItemImages";

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");
        const organizationSlug = formData.get("organizationSlug");
        const locationSlug = formData.get("locationSlug");

        if (!(file instanceof File)) {
            return Response.json({ error: "Image file is required" }, { status: 400 });
        }

        if (typeof organizationSlug !== "string" || !organizationSlug) {
            return Response.json(
                { error: "Organization slug is required" },
                { status: 400 },
            );
        }

        if (typeof locationSlug !== "string" || !locationSlug) {
            return Response.json(
                { error: "Location slug is required" },
                { status: 400 },
            );
        }

        const result = await saveMenuItemImage({
            file,
            organizationSlug,
            locationSlug,
        });

        return Response.json(result, { status: 201 });
    } catch (error) {
        return Response.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Menu item image upload failed",
            },
            { status: 400 },
        );
    }
}
