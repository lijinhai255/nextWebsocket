import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// 加载环境变量
dotenv.config({
    path: ".env.development.local",
});

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.POSTGRES_URL_NON_POOLING!,
    },
});
