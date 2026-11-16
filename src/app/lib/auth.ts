import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { nextCookies } from "better-auth/next-js";

// const uri = process.env.MONGODB_URI;
const uri = "mongodb://bazer-dor-1:179wfFFI7IGJKhs4@ac-twz7lir-shard-00-00.hrksx44.mongodb.net:27017,ac-twz7lir-shard-00-01.hrksx44.mongodb.net:27017,ac-twz7lir-shard-00-02.hrksx44.mongodb.net:27017/?ssl=true&replicaSet=atlas-k3a8om-shard-0&authSource=admin"
if (!uri) {
    throw new Error("MONGODB_URI is not defined");
}

const globalForMongo = globalThis as typeof globalThis & {
    mongoClient?: MongoClient;
};

const client =
    globalForMongo.mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
    globalForMongo.mongoClient = client;
}

const db = client.db("bazar-dor");

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),

    emailAndPassword: {
        enabled: true,
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },

    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google"],
        },
    },

    plugins: [nextCookies()],
});