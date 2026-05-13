"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiEnvSchema = void 0;
const zod_1 = require("zod");
exports.apiEnvSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string().url(),
    FIREBASE_PROJECT_ID: zod_1.z.string(),
    FIREBASE_PRIVATE_KEY: zod_1.z.string(),
    FIREBASE_CLIENT_EMAIL: zod_1.z.string().email(),
    REDIS_URL: zod_1.z.string().url(),
    PORT: zod_1.z.coerce.number().default(3001),
    CORS_ORIGIN: zod_1.z.string().default('http://localhost:3000'),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
});
//# sourceMappingURL=env.js.map