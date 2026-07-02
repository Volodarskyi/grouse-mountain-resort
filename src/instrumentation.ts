export async function register() {
    if (process.env.NEXT_RUNTIME !== "nodejs") {
        return;
    }

    const [
        {
            connectToMongoDB,
            getMongoDbEnv,
            getMongoDbUri,
            maskMongoDbUri,
        },
        packageJson,
    ] = await Promise.all([import("./lib/mongodb"), import("../package.json")]);

    const mongoUri = getMongoDbUri();

    console.info("[startup] App version:", packageJson.default.version);
    console.info(
        "[startup] Base URL:",
        process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
    );
    console.info("[startup] MongoDB environment:", getMongoDbEnv());
    console.info(
        "[startup] MongoDB URL:",
        mongoUri ? maskMongoDbUri(mongoUri) : "not configured",
    );

    await connectToMongoDB();
}
