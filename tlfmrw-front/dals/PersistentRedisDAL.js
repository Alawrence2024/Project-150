import Redis from "ioredis"

const KEY_NAMES = {
    USER: "user",
    FAVORITES: "favorites",
    READ: "read"
}

const redis = new Redis({
    host: "redis",
    port: 6379
})

function formatKey(...strings) {
    let formated_string = ""
    for (string in strings) {
        formated_string += string + ":"
    }
    formated_string = formated_string.slice(0, formated_string.length - 1)
}

export const DAL = {
    async CreateUser(username, password) {
        await redis.hmset(`user:${username}`, {
            password: password,
            created_at: Date.now()
        })
    },

    async GetUser(username) {
        const userData = await redis.hgetall(`${KEY_NAMES.USER}:${username}`)
        return Object.keys(userData).length === 0 ? null : data
    },

    async SetUserFavorite(username, mangaId) {
        await redis.sadd(formatKey(KEY_NAMES.USER, username, KEY_NAMES.FAVORITES), mangaId)
    },

    async RemoveUserFavorite(username, mangaId) {
        await redis.srem(formatKey(KEY_NAMES.USER, username, KEY_NAMES.FAVORITES), mangaId)
    },

    async GetUserFavorites(username) {
        return await redis.smembers(formatKey(KEY_NAMES.USER, username, KEY_NAMES.FAVORITES))
    },

    async CheckUserFavorite(username, mangaId) {
        return await redis.sismember(formatKey(KEY_NAMES.USER, username, KEY_NAMES.FAVORITES), mangaId)
    },

    async UpdateLastReadChapter(username, mangaId, chapterNum) {
        await redis.hset(formatKey(KEY_NAMES.USER, username, mangaId, KEY_NAMES.READ), String(chapterNum))
    },

    async GetLastReadChapter(username, mangaId) {
        return await redis.hget(formatKey(KEY_NAMES.USER, username, mangaId, KEY_NAMES.READ))
    }
}

