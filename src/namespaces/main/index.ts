import { validate } from '@/src/auth'
import { onConnection } from '@/src/helpers'
import { io } from '@/src/io'
import { onAcceptChatReq, onBlockUser, onRejectChatReq, onSendChatReq, onSendSignalData, onUnblockUser } from './funcs'

export const mainIO = io.of('/main')

export const main = () => onConnection(mainIO, (socket) => {
    validate(socket, (s) => {
        onSendChatReq(s)
        onAcceptChatReq(s)
        onSendSignalData(s)
        onRejectChatReq(s)
        onBlockUser(s)
        onUnblockUser(s)
    })
})