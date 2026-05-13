import { z } from 'zod'

export const apiEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_PRIVATE_KEY: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string().email(),
  REDIS_URL: z.string().url(),
  PORT: z.coerce.number().default(3001),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export type ApiEnv = z.infer<typeof apiEnvSchema>
