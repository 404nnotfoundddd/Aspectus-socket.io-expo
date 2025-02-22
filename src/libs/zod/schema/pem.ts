import { z } from "zod"

export const PEMSchema = z.string()
    .regex(/^-----BEGIN [A-Z ]+-----\n[\s\S]*\n-----END [A-Z ]+-----$/m,
        "Invalid PEM format. Must start with '-----BEGIN' and end with '-----END'")