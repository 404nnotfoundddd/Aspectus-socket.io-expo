import { keyDb } from '../db/keydb'

export const flushStartsWith = async (startsWith: string[]): Promise<void> => {
    try {
        let totalDeleted = 0
        let cursor = '0'
        do {
            // Scan keys in batches
            const [newCursor, keys] = await keyDb.scan(cursor, 'MATCH', '*', 'COUNT', '100')
            cursor = newCursor

            // Filter and delete keys that start with any of the prefixes
            const keysToDelete = keys.filter(key =>
                startsWith.some(prefix => key.startsWith(prefix))
            )
            if (keysToDelete.length > 0) {
                await keyDb.del(...keysToDelete)
                totalDeleted += keysToDelete.length
            }
        } while (cursor !== '0')

        console.log(`Flushed ${totalDeleted} keys starting with "${startsWith}"`)
    } catch (error) {
        console.error(`Error flushing Redis keys starting with ${startsWith}:`, error)
        throw error
    }
}