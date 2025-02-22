import { emitIO, onIO } from '@/src/utils';
import type { Socket } from 'socket.io';
import { z } from 'zod';

export const onSendSignalData = (s: Socket) => {
    onIO()
        .input(z.object({
            signalData: z.any(),
            to: z.string().cuid2(),
        }))
        .on(s, 'send-signal-data', ({ signalData, to }) => {
            emitIO()
                .output(z.object({
                    signalData: z.any(),
                    from: z.string().cuid2(),
                }))
                .emit(s.to(to), 'receive-signal-data', {
                    signalData,
                    from: s.data.userID
                })
        })
}