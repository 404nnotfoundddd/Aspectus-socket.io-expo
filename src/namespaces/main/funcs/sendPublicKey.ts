import { JsonWebKeySchema, PEMSchema, PlatformSchema, PublicKeySchema } from '@/zod/schema'
import { onIO } from '@/src/utils'
import type { Socket } from 'socket.io'
import { z } from 'zod'
import { jwk2pem, pem2jwk, type RSA_JWK } from 'pem-jwk'


const convertPublicKeyToPlatform = (publicKey: z.infer<typeof PublicKeySchema>, toPlatform: z.infer<typeof PlatformSchema>) => {
    if (PEMSchema.safeParse(publicKey).success && toPlatform === 'web') {
        const jwk: JsonWebKey = pem2jwk(publicKey as string)
        return jwk
    }

    if (JsonWebKeySchema.safeParse(publicKey).success && (toPlatform === 'android' || toPlatform === 'ios')) {
        return jwk2pem(publicKey as JsonWebKey)
    }

    return publicKey
}



export const onSendPublicKey = (s: Socket) =>
    onIO()
        .input(z.object({
            toID: z.string().cuid2(),
            toPlatform: PlatformSchema,
            publicKey: PublicKeySchema
        }))
        .on(s, 'send-public-key', ({ toID, toPlatform, publicKey }) => {
            const convertedToPlatform = 
        })