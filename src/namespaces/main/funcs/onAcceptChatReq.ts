import { PlatformSchema } from '@/src/libs/zod/schema';
import { emitIO, onIO } from '@/src/utils';
import type { Socket } from 'socket.io';
import { z } from 'zod';

export const onAcceptChatReq = (s: Socket) => {
    onIO().input(z.object({
        userID: z.string().cuid2(),
        platform: PlatformSchema,
    }))
        .on(s, 'accept-chat-req', ({ userID, platform }) => {
            emitIO()
                .output(z.object({
                    from: z.string().cuid2(),
                }))
                .emit(s.to(userID), 'receive-accepted-chat-req', {
                    from: s.data.userID
                })
        })
}