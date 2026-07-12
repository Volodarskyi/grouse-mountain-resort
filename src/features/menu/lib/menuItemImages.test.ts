import { afterEach, describe, expect, it, vi } from "vitest";

import {
    createMenuItemImagePublicPath,
    sanitizeMenuItemImageFileName,
    sanitizeMenuItemImagePathSegment,
} from "./menuItemImages";

afterEach(() => {
    vi.restoreAllMocks();
});

describe("sanitizeMenuItemImageFileName", () => {
    it("keeps the extension and removes unsafe characters", () => {
        expect(sanitizeMenuItemImageFileName("Hot Honey Chicken!!!.PNG")).toBe(
            "hot-honey-chicken.png",
        );
    });

    it("falls back to a stable base name", () => {
        expect(sanitizeMenuItemImageFileName("!!!.webp")).toBe("menu-item.webp");
    });
});

describe("createMenuItemImagePublicPath", () => {
    it("creates a public asset path scoped by organization and location", () => {
        vi.spyOn(Date, "now").mockReturnValue(123456789);

        expect(
            createMenuItemImagePublicPath({
                fileName: "Lupins Cheeseburger.png",
                locationSlug: "lupins",
                organizationSlug: "grouse-mountain",
            }),
        ).toBe(
            "/assets/photo/menu/grouse-mountain/lupins/123456789-lupins-cheeseburger.png",
        );
    });
});

describe("sanitizeMenuItemImagePathSegment", () => {
    it("keeps path segments lowercase and URL-safe", () => {
        expect(sanitizeMenuItemImagePathSegment("Grouse Mountain!!!")).toBe(
            "grouse-mountain",
        );
    });
});
