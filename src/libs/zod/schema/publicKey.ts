import { JsonWebKeySchema } from './JsonWebToken';
import { PEMSchema } from './pem';

export const PublicKeySchema = JsonWebKeySchema.or(PEMSchema)