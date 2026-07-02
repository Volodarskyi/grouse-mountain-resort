import mongoose from "mongoose";

type MongooseCache = {
    connection: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

declare global {
    var mongooseCache: MongooseCache | undefined;
}

const cache = globalThis.mongooseCache ?? {
    connection: null,
    promise: null,
};

globalThis.mongooseCache = cache;

export async function connectToMongoDB() {
    if (cache.connection) {
        return cache.connection;
    }

    const uri = getMongoDbUri();
    const mongodbEnv = getMongoDbEnv();

    if (!uri) {
        throw new Error("MongoDB connection string is not defined");
    }

    console.info(
        `[mongodb] Connecting to ${mongodbEnv} database: ${maskMongoDbUri(uri)}`,
    );

    cache.promise ??= mongoose
        .connect(uri, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 10000,
        })
        .catch((error: unknown) => {
            cache.promise = null;
            throw new Error(getMongoConnectionErrorMessage(error));
        });

    cache.connection = await cache.promise;

    console.info(`[mongodb] Connected to ${mongodbEnv} database`);

    return cache.connection;
}

export function getMongoDbEnv() {
    return process.env.MONGODB_ENV ?? "dev";
}

export function getMongoDbUri() {
    const mongodbEnv = getMongoDbEnv();

    if (mongodbEnv === "prod") {
        return process.env.MONGODB_URI_PROD;
    }

    if (mongodbEnv === "demo") {
        return process.env.MONGODB_URI_DEMO;
    }

    return process.env.MONGODB_URI_DEV ?? process.env.MONGODB_URI;
}

export function maskMongoDbUri(uri: string) {
    return uri.replace(/\/\/([^:]+):([^@]+)@/, "//$1:<hidden>@");
}

export function getMongoConnectionErrorMessage(error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes("querySrv")) {
        return [
            "MongoDB DNS SRV lookup failed.",
            "Local DNS or firewall refused the _mongodb._tcp SRV request.",
            "Use a non-SRV mongodb:// connection string locally or change DNS/network settings.",
            `Original error: ${message}`,
        ].join(" ");
    }

    return `MongoDB connection failed. Original error: ${message}`;
}
