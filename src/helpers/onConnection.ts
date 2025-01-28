import chalk from 'chalk'
import type { Namespace, Server, Socket } from 'socket.io'

const log = console.log
const positiveLog = (...a: any) => log(chalk.greenBright(a))
const negativeLog = (...a: any) => log(chalk.redBright(a))
const xNegativeLog = (...a: any) => log(chalk.bgRed(a))

export const onConnection = async (
    io: Server | Namespace,
    cb: (socket: Socket) => void,
) => {
    io.on('connection', async (socket) => {
        console.log('on connection for socket ', socket.id)

        const namespaceName = socket.nsp.name
        positiveLog(
            JSON.stringify(
                {
                    message: `Socket connected`,
                    socketID: socket.id,
                    namespace: namespaceName,
                },
                null,
                2,
            ),
        )

        socket.once('disconnect', async () => {
            negativeLog(
                JSON.stringify(
                    {
                        message: `Socket disconnected`,
                        socketID: socket.id,
                        namespace: namespaceName,
                    },
                    null,
                    2,
                ),
            )
        })

        socket.on('error', (err) => {
            xNegativeLog(`Socket error: ${socket.id} from ${namespaceName}`, err)
            console.error(err)
        })

        cb(socket)
    })
}
