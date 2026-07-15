import { readdir } from "node:fs/promises";
import path from "node:path";

import { sanitizeMenuItemImagePathSegment } from "./menuItemImages";

const menuItemPhotoExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export type MenuItemPhotoOption = {
    fileName: string;
    imageUrl: string;
};

export function createMenuItemPhotoOption({
    fileName,
    locationSlug,
}: {
    fileName: string;
    locationSlug: string;
}): MenuItemPhotoOption {
    const safeLocationSlug =
        sanitizeMenuItemImagePathSegment(locationSlug) || "location";

    return {
        fileName,
        imageUrl: `/assets/photo/menu/${safeLocationSlug}/${fileName}`,
    };
}

export async function getMenuItemPhotoOptions(locationSlug: string) {
    const safeLocationSlug =
        sanitizeMenuItemImagePathSegment(locationSlug) || "location";
    const photoDirectory = path.join(
        process.cwd(),
        "public",
        "assets",
        "photo",
        "menu",
        safeLocationSlug,
    );

    try {
        const files = await readdir(photoDirectory, { withFileTypes: true });

        return files
            .filter((file) => file.isFile())
            .map((file) => file.name)
            .filter((fileName) =>
                menuItemPhotoExtensions.has(path.extname(fileName).toLowerCase()),
            )
            .sort((left, right) => left.localeCompare(right))
            .map((fileName) =>
                createMenuItemPhotoOption({
                    fileName,
                    locationSlug: safeLocationSlug,
                }),
            );
    } catch {
        return [];
    }
}
