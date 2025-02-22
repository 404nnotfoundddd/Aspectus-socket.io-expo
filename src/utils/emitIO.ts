import type { BroadcastOperator, Namespace, Server, Socket } from 'socket.io'
import { z, ZodSchema } from 'zod'
import { logErr, logInfo } from '@/utils'

/**
 * emitIO is a utility to emit data to a socket.io client.
 *
 *  @example
 *  emitIO().output(z.string())
 *  .emit(io, 'event', 'hello world')
 *
 * Note: `Don't forget to initialize outputSchema`
 */
export const emitIO: EmitIO = () => ({
  data: {
    outputSchema: null,
    onInvalidOutput: () => { },
  },

  output: function <T extends ZodSchema>(schema: T) {
    this.data.outputSchema = schema
    return this as unknown as EmitIOWithSchema<T>
  },

  onInvalidOutput: function <T extends ZodSchema>(
    cb: (input: z.infer<T>) => void,
  ) {
    this.data.onInvalidOutput = () => cb(this.data.outputSchema)
    return this as unknown as EmitIOWithSchema<T>
  },

  emit: function <T extends ZodSchema>(io: IO, ev: string, input: z.infer<T>) {
    try {
      logInfo(`sent emitIO output at ${ev}`, input)

      const validatedOutput = (() => {
        if (!this.data.outputSchema) throw new Error('outputSchema is not set')
        return this.data.outputSchema.parse(input)
      })()
      // @ts-ignore
      io.emit(ev, validatedOutput)
    } catch (e) {
      if (e instanceof Error) {
        this.data.onInvalidOutput()
        logErr(`invalid output recevied at ${ev} ${e.stack}`, e)
      } else console.error(e)
    }
  }
})

type IO = Server | Namespace | Socket | BroadcastOperator<any, any>

type EmitIO = () => {
  data: {
    outputSchema: ZodSchema | null
    onInvalidOutput: () => void
  }
  output: <T extends ZodSchema>(schema: T) => EmitIOWithSchema<T>
  onInvalidOutput: <T extends ZodSchema>(
    cb: (input: T) => void,
  ) => Omit<EmitIOWithSchema<T>, 'onInvalidOutput'>
  emit: <T extends ZodSchema>(io: IO, ev: string, input?: z.infer<T>) => void
}

type EmitIOWithSchema<T extends ZodSchema> = {
  data: {
    outputSchema: T
    onInvalidOutput: () => void
  }
  onInvalidOutput: (cb: (input: z.infer<T>) => void) => void
  emit: (io: IO, ev: string, input: z.infer<T>) => void
}
