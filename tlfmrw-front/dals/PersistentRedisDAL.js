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
    return strings.join(":")
}

function buildUserKey(username) {
    return formatKey(KEY_NAMES.USER, username)
}

function buildUserFavoritesKey(username) {
    return formatKey(buildUserKey(username), KEY_NAMES.FAVORITES)
}

function buildUserReadKey(username, mangaId) {
    return formatKey(buildUserKey(username), mangaId, KEY_NAMES.READ)
}

export const DAL = {
    async CreateUser(username, password) {
        await redis.hmset(buildUserKey(username), {
            password: password,
            created_at: Date.now()
        })
    },

    async GetUser(username) {
        const userData = await redis.hgetall(buildUserKey(username))
        return Object.keys(userData).length === 0 ? null : data
    },

    async SetUserFavorite(username, mangaId) {
        await redis.sadd(buildUserFavoritesKey(username), mangaId)
    },

    async RemoveUserFavorite(username, mangaId) {
        await redis.srem(buildUserFavoritesKey(username), mangaId)
    },

    async GetUserFavorites(username) {
        return await redis.smembers(buildUserFavoritesKey(username))
    },

    async CheckUserFavorite(username, mangaId) {
        return await redis.sismember(buildUserFavoritesKey(username), mangaId)
    },

    async UpdateLastReadChapter(username, mangaId, chapterNum) {
        await redis.hset(buildUserReadKey(username, mangaId), String(chapterNum))
    },

    async GetLastReadChapter(username, mangaId) {
        return await redis.hget(buildUserReadKey(username, mangaId))
    }
}

