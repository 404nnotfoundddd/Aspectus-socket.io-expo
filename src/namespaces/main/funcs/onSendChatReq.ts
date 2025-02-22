import { keyDb } from '@/src/db/keydb'
import { PlatformSchema } from '@/src/libs/zod/schema'
import { emitIO, onIO } from '@/src/utils'
import type { Socket } from 'socket.io'
import { z } from 'zod'

export const onSendChatReq = (s: Socket) => {
    onIO()
        .input(z.object({
            userID: z.string().cuid2(),
            note: z.string().max(500).optional(),
            platform: PlatformSchema,
        }))
        .on(s, 'send-chat-req', async ({ userID, platform, note }) => {
            const isBlocked = await keyDb.sismember(`user:${userID}:blocked`, s.data.userID)
            if (isBlocked === 1) return

            emitIO()
                .output(z.object({
                    userID: z.string().cuid2(),
                    platform: PlatformSchema,
                    note: z.string().max(500).optional(),
                }))
                .emit(s.to(userID), 'receive-chat-req', {
                    userID: s.data.userID,
                    platform,
                    note
                })
        })
}