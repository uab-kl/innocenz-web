import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {},

  clientPrefix: 'VITE_',

  client: {
    VITE_API_URL: z.url(),
    VITE_GRAPHQL_ENDPOINT: z.url().optional(),
  },

  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})
