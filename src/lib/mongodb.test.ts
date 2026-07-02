import { describe, expect, it } from "vitest";

import { getMongoConnectionErrorMessage, maskMongoDbUri } from "./mongodb";

describe("maskMongoDbUri", () => {
    it("hides the password from MongoDB connection strings", () => {
        const uri =
            "mongodb+srv://horecanai_db_user:secret-password@horecancluster.5ckexda.mongodb.net/grouse-dev?appName=HorecanCluster";

        expect(maskMongoDbUri(uri)).toBe(
            "mongodb+srv://horecanai_db_user:<hidden>@horecancluster.5ckexda.mongodb.net/grouse-dev?appName=HorecanCluster",
        );
    });
});

describe("getMongoConnectionErrorMessage", () => {
    it("adds DNS SRV guidance for querySrv errors", () => {
        const message = getMongoConnectionErrorMessage(
            new Error(
                "querySrv ECONNREFUSED _mongodb._tcp.horecancluster.5ckexda.mongodb.net",
            ),
        );

        expect(message).toContain("MongoDB DNS SRV lookup failed");
        expect(message).toContain("non-SRV mongodb:// connection string");
    });
});
