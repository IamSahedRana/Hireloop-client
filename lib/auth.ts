import { betterAuth } from "better-auth"
import { admin } from "better-auth/plugins"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"

const client = new MongoClient(process.env.BETTER_AUTH_DB_URI as string)
const db = client.db("hireloopdb")

export const auth = betterAuth({
    //...

    // admin plugin: /admin/list-users, /admin/set-role, /admin/ban-user…
    // guards every route so only session.user.role === "admin" may call them.
    plugins: [
        admin({
            // our role field is a single string — one admin role only
            adminRoles: ["admin"],
        }),
    ],
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                type: ["seeker", "recruiter", "admin"],
                input: true,
                defaultValue: "seeker",
            },
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    database: mongodbAdapter(db, {
        client,
    }),
})