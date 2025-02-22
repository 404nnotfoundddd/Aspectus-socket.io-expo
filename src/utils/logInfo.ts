import chalk from 'chalk'
import { env } from '../env'

export const logInfo = (...message: any[]) => {
    if (env.DEBUG === '0') return

    console.info(
        chalk.blueBright(
            JSON.stringify(
                [
                    ...message,
                ],
                null,
                2,
            ),
        ),
    )
}