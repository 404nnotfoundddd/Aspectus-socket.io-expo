import { emitIO } from '@/src/utils/emitIO'

import { onIO } from '@/src/utils'
import { z } from 'zod'
import type { Socket } from 'socket.io'

export const onRejectChatReq = (s: Socket) => {
    onIO()
        .input(z.object({
            userID: z.string().cuid2(),
        }))
        .on(s, 'reject-chat-req', ({ userID }) => {
            emitIO().emit(s.to(userID), 'receive-rejected-chat-req')
        })
}