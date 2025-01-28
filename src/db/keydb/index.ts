import { env } from '@/env'
import Redis from 'ioredis'

export const keyDb = new Redis(env.KEYDB_URL)

keyDb.on('error', (err) => {
  throw new Error(`Keydb connection error: `, err)
})
