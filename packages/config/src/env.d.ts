import { z } from 'zod';
export declare const apiEnvSchema: z.ZodObject<{
    DATABASE_URL: z.ZodString;
    FIREBASE_PROJECT_ID: z.ZodString;
    FIREBASE_PRIVATE_KEY: z.ZodString;
    FIREBASE_CLIENT_EMAIL: z.ZodString;
    REDIS_URL: z.ZodString;
    PORT: z.ZodDefault<z.ZodNumber>;
    CORS_ORIGIN: z.ZodDefault<z.ZodString>;
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
}, "strip", z.ZodTypeAny, {
    FIREBASE_PROJECT_ID: string;
    FIREBASE_PRIVATE_KEY: string;
    FIREBASE_CLIENT_EMAIL: string;
    DATABASE_URL: string;
    REDIS_URL: string;
    PORT: number;
    CORS_ORIGIN: string;
    NODE_ENV: "development" | "production" | "test";
}, {
    FIREBASE_PROJECT_ID: string;
    FIREBASE_PRIVATE_KEY: string;
    FIREBASE_CLIENT_EMAIL: string;
    DATABASE_URL: string;
    REDIS_URL: string;
    PORT?: number | undefined;
    CORS_ORIGIN?: string | undefined;
    NODE_ENV?: "development" | "production" | "test" | undefined;
}>;
export type ApiEnv = z.infer<typeof apiEnvSchema>;
//# sourceMappingURL=env.d.ts.map