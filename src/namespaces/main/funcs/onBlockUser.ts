import { keyDb } from '@/src/db/keydb';
import { onIO } from '@/src/utils';
import type { Socket } from 'socket.io';
import { z } from 'zod';

export const onBlockUser = (s: Socket) => {
    onIO()
        .input(z.object({
            userID: z.string().cuid2(),
        }))
        .on(s, 'block-user', async ({ userID }) => {
            await keyDb.sadd(`user:${s.data.userID}:blocked`, userID)
        })

}