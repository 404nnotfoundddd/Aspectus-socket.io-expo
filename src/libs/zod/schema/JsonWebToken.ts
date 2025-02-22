import { z } from 'zod';

export const JsonWebKeySchema = z.object({
    alg: z.string().optional(),
    crv: z.string().optional(),
    d: z.string().optional(),
    dp: z.string().optional(),
    dq: z.string().optional(),
    e: z.string().optional(),
    ext: z.boolean().optional(),
    k: z.string().optional(),
    key_ops: z.array(z.string()).optional(),
    kty: z.string().optional(),
    n: z.string().optional(),
    oth: z.array(z.object({
        // Note: RsaOtherPrimesInfo type definition not provided, using basic structure
        r: z.string(),
        d: z.string(),
        t: z.string()
    })).optional(),
    p: z.string().optional(),
    q: z.string().optional(),
    qi: z.string().optional(),
    use: z.string().optional(),
    x: z.string().optional(),
    y: z.string().optional()
});
