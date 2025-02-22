import { z, ZodSchema } from 'zod'
import { logErr } from './logErr'
import type { Socket } from 'socket.io'
import { logInfo } from './logInfo'

/**
 * onIO is a utility to handle on input from socket.io
 *
 *  @example
 *  onIO().input(z.string()).on(io, 'connection', (input) => {
 *    console.log(input) // input is inferred as string
 *  })
 *
 */
export const onIO: onIO = () => ({
  data: {
    schema: z.any(),
  },

  input: function <T extends ZodSchema>(schema: T) {
    this.data.schema = schema
    return this as unknown as onIOWithSchema<T>
  },

  on: function <T extends ZodSchema>(
    io: IO,
    ev: string,
    cb: (input: z.infer<T>) => void,
  ) {
    io.on(ev, (input: unknown) => {
      try {
        logInfo(`received onIO input at ${ev}`, input)
        const validatedInput = this.data.schema.parse(input)
        cb(validatedInput)
      } catch (e) {
        logErr(`invalid input recevied at ${ev}`, e as Error)

        return
      }
    })
  },
})

type IO = Socket

type onIO = () => {
  data: {
    schema: ZodSchema
  }
  input: <T extends ZodSchema>(schema: T) => onIOWithSchema<T>
  on: <T extends ZodSchema>(
    io: IO,
    ev: string,
    cb: (input: z.infer<T>) => void,
  ) => void
}

type onIOWithSchema<T extends ZodSchema> = {
  data: {
    schema: T
  }
  on: (io: IO, ev: string, cb: (input: z.infer<T>) => void) => void
}
