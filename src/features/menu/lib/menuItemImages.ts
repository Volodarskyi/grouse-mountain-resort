import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxImageSizeBytes = 5 * 1024 * 1024;

export function sanitizeMenuItemImageFileName(fileName: string) {
    const originalExtension = path.extname(fileName);
    const extension = originalExtension.toLowerCase();
    const baseName = path
        .basename(fileName, originalExtension)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return `${baseName || "menu-item"}${extension}`;
}

export function sanitizeMenuItemImagePathSegment(segment: string) {
    return segment
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function createMenuItemImagePublicPath({
    fileName,
    locationSlug,
    organizationSlug,
}: {
    fileName: string;
    locationSlug: string;
    organizationSlug: string;
}) {
    const safeFileName = sanitizeMenuItemImageFileName(fileName);
    const safeOrganizationSlug =
        sanitizeMenuItemImagePathSegment(organizationSlug) || "organization";
    const safeLocationSlug =
        sanitizeMenuItemImagePathSegment(locationSlug) || "location";

    return `/assets/photo/menu/${safeOrganizationSlug}/${safeLocationSlug}/${Date.now()}-${safeFileName}`;
}

export async function saveMenuItemImage({
    file,
    locationSlug,
    organizationSlug,
}: {
    file: File;
    locationSlug: string;
    organizationSlug: string;
}) {
    if (!allowedImageTypes.has(file.type)) {
        throw new Error("Only JPG, PNG, and WEBP images are supported");
    }

    if (file.size > maxImageSizeBytes) {
        throw new Error("Image must be 5MB or less");
    }

    const imageUrl = createMenuItemImagePublicPath({
        fileName: file.name,
        locationSlug,
        organizationSlug,
    });
    const targetPath = path.join(process.cwd(), "public", ...imageUrl.split("/"));
    const targetDirectory = path.dirname(targetPath);
    const buffer = Buffer.from(await file.arrayBuffer());

    await mkdir(targetDirectory, { recursive: true });
    await writeFile(targetPath, buffer);

    return {
        imageUrl,
    };
}
