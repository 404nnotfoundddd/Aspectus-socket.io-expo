import { keyDb } from '@/src/db/keydb'
import { onIO } from '@/src/utils'
import type { Socket } from 'socket.io'
import { z } from 'zod'

export const onUnblockUser = (s: Socket) => {
    onIO()
        .input(z.object({
            userID: z.string().cuid2(),
        }))
        .on(s, 'unblock-user', async ({ userID }) => {
            await keyDb.srem(`user:${s.data.userID}:blocked`, userID)
        })
}