import chalk from 'chalk'
import { env } from '../env'

export const logErr = (message: any, e: globalThis.Error) => {
  if (env.DEBUG === '0') return

  console.error(
    chalk.red(
      JSON.stringify(
        {
          message,
          e,
        },
        null,
        2,
      ),
    ),
  )
}