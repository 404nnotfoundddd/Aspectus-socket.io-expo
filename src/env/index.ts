import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'production']),
    PORT: z.string(),
    SOCKETIO_ORIGINS: z.string(),
    KEYDB_URL: z.string(),
  },
  runtimeEnv: process.env,
})
