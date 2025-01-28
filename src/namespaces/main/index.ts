import { validate } from '@/src/auth'
import { keyDb } from '@/src/db/keydb'
import { onConnection } from '@/src/helpers'
import { io } from '@/src/io'
import { emitIO, onIO } from '@/src/utils'
import { z } from 'zod'


export const mainIO = io.of('/main')

export const main = () => onConnection(mainIO, (s) => {
    validate(s, (s) => {
        onIO()
            .input(z.object({
                userID: z.string().cuid2(),
                publicKey: z.string().min(1).max(500),
                note: z.string().min(1).max(500).optional(),
            }))
            .on(s, 'chat-req', async ({ userID, publicKey, note }) => {
                const isBlocked = await keyDb.sismember(`user:${userID}:blocked`, s.data.userID)
                if (isBlocked === 1) return

                emitIO()
                    .output(z.object({
                        userID: z.string().cuid2(),
                        publicKey: z.string().min(1).max(500),
                        note: z.string().min(1).max(500).optional(),
                    }))
                    .emit(s.to(userID), 'chat-req', { userID: s.data.userID, publicKey, note })
            })

        onIO()
            .input(z.object({
                userID: z.string().cuid2(),
                publicKey: z.string(),
            }))
            .on(s, 'accept-chat-req', ({ publicKey, userID }) => {

                emitIO()
                    .output(z.object({
                        from: z.string().cuid2(),
                        publicKey: z.string(),
                    }))
                    .emit(s.to(userID), 'accepted-chat-req', { publicKey, from: s.data.userID })
            })


        onIO()
            .input(z.object({
                userID: z.string().cuid2(),
                publicKey: z.string(),
            }))
            .on(s, 'public-key-req', ({ publicKey, userID }) => {
                emitIO()
                    .output(z.object({
                        publicKey: z.string(),
                        from: z.string().cuid2(),
                    }))
                    .emit(s.to(userID), 'public-key-req', { publicKey, from: s.data.userID })
            })

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
                    .emit(s.to(to), 'get-signal-data', { signalData, from: s.data.userID })
            })


        onIO()
            .input(z.object({
                userID: z.string().cuid2(),
            }))
            .on(s, 'reject-chat-req', ({ userID }) => {
                emitIO().emit(s.to(userID), 'rejected-chat-req')
            })


        onIO()
            .input(z.object({
                userID: z.string().cuid2(),
            }))
            .on(s, 'block-user', async ({ userID }) => {
                await keyDb.sadd(`user:${s.data.userID}:blocked`, userID)
            })

        onIO()
            .input(z.object({
                userID: z.string().cuid2(),
            }))
            .on(s, 'unblock-user', async ({ userID }) => {
                await keyDb.srem(`user:${s.data.userID}:blocked`, userID)
            })
    })
})