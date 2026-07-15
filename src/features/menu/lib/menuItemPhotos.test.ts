import { describe, expect, it } from "vitest";

import { createMenuItemPhotoOption } from "./menuItemPhotos";

describe("createMenuItemPhotoOption", () => {
    it("creates a root-relative public image URL for a location photo", () => {
        expect(
            createMenuItemPhotoOption({
                fileName: "GMR_Lupins_BaconCheeseburger.png",
                locationSlug: "lupins",
            }),
        ).toEqual({
            fileName: "GMR_Lupins_BaconCheeseburger.png",
            imageUrl: "/assets/photo/menu/lupins/GMR_Lupins_BaconCheeseburger.png",
        });
    });
});
