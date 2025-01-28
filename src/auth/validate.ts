import type { Socket } from 'socket.io'
import { keyDb } from '@/keydb'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

export const validate = async (s: Socket, cb: (s: Socket) => void) => {
    try {
        console.log(s.handshake.auth)
        const secretID = z.string().parse(s.handshake.auth.secretID)
        const userID = z.string().cuid2().parse(s.handshake.auth.userID)

        const hashedSecretID = await keyDb.get(`user:${userID}:secret_ID`)
        console.log('hashedSecretID', hashedSecretID)
        if (!hashedSecretID) throw new Error('INVALID_PASSWORD_dj20h')

        const isValidSecretID = bcrypt.compareSync(secretID, hashedSecretID)
        if (!isValidSecretID) throw new Error('INVALID_PASSWORD_cb2ad')

        s.data.userID = userID
        keyDb.set(`user:${userID}:last_login`, Date.now())

        s.emit('auth_success')
        console.log('auth success')

        s.join(userID)
        cb(s)
    } catch (error) {
        console.error(error)
        if (error instanceof z.ZodError) {
            s.emit('error_from_server', 'BAD_REQUEST')
            s.disconnect()
            return
        }

        if (error instanceof Error) {
            s.emit('error_from_server', error.message)
            s.disconnect()
            return
        }
    }
}