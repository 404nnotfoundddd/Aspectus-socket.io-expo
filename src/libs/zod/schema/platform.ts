import { z } from 'zod'

export const PlatformSchema = z.enum(['web', 'ios', 'android',])
