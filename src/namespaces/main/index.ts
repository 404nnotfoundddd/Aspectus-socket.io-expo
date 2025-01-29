import { validate } from '@/src/auth'
import { keyDb } from '@/src/db/keydb'
import { onConnection } from '@/src/helpers'
import { io } from '@/src/io'
import { emitIO, onIO } from '@/src/utils'
import { z } from 'zod'

export const mainIO = io.of('/main')

export const main = () => onConnection(mainIO, (socket) => {
    validate(socket, (validatedSocket) => {
        // Handle chat request
        onIO()
            .input(z.object({
                userID: z.string().cuid2(),
                publicKey: z.string().min(1).max(500),
                note: z.string().min(1).max(500).optional(),
            }))
            .on(validatedSocket, 'send-chat-req', async ({ userID, publicKey, note }) => {
                const isBlocked = await keyDb.sismember(`user:${userID}:blocked`, validatedSocket.data.userID)
                if (isBlocked === 1) return

                emitIO()
                    .output(z.object({
                        userID: z.string().cuid2(),
                        publicKey: z.string().min(1).max(500),
                        note: z.string().min(1).max(500).optional(),
                    }))
                    .emit(validatedSocket.to(userID), 'receive-chat-req', {
                        userID: validatedSocket.data.userID,
                        publicKey,
                        note
                    })
            })

        // Handle chat request acceptance
        onIO()
            .input(z.object({
                userID: z.string().cuid2(),
                publicKey: z.string(),
            }))
            .on(validatedSocket, 'accept-chat-req', ({ publicKey, userID }) => {
                emitIO()
                    .output(z.object({
                        from: z.string().cuid2(),
                        publicKey: z.string(),
                    }))
                    .emit(validatedSocket.to(userID), 'accepted-chat-req', {
                        publicKey,
                        from: validatedSocket.data.userID
                    })
            })

        // Handle signal data
        onIO()
            .input(z.object({
                signalData: z.any(),
                to: z.string().cuid2(),
            }))
            .on(validatedSocket, 'send-signal-data', ({ signalData, to }) => {
                emitIO()
                    .output(z.object({
                        signalData: z.any(),
                        from: z.string().cuid2(),
                    }))
                    .emit(validatedSocket.to(to), 'get-signal-data', {
                        signalData,
                        from: validatedSocket.data.userID
                    })
            })

        // Handle chat request rejection
        onIO()
            .input(z.object({
                userID: z.string().cuid2(),
            }))
            .on(validatedSocket, 'reject-chat-req', ({ userID }) => {
                emitIO().emit(validatedSocket.to(userID), 'rejected-chat-req')
            })

        // Handle user blocking
        onIO()
            .input(z.object({
                userID: z.string().cuid2(),
            }))
            .on(validatedSocket, 'block-user', async ({ userID }) => {
                await keyDb.sadd(`user:${validatedSocket.data.userID}:blocked`, userID)
            })

        // Handle user unblocking
        onIO()
            .input(z.object({
                userID: z.string().cuid2(),
            }))
            .on(validatedSocket, 'unblock-user', async ({ userID }) => {
                await keyDb.srem(`user:${validatedSocket.data.userID}:blocked`, userID)
            })
    })
})