import Redis from "ioredis"

const redis = process.env.REDIS_URL 
  ? new Redis(process.env.REDIS_URL)
  : new Redis({
      host: "redis",
      port: 6379,
      lazyConnect: true
    })

// #region Helper Functions
const KEY_NAMES = {
    USER: "user",
    FAVORITES: "favorites",
    READ: "read"
}

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
// #endregion

export const DAL = {
    async CreateUser(username, password) {
        const key = buildUserKey(username)

        const exists = await redis.exists(key)
        if (exists) return false
        
        await redis.hmset(key, {
            password: password,
            created_at: Date.now()
        })
        return true
    },

    async GetUser(username) {
        console.log("DAL.GetUser:", username)
        const userData = await redis.hgetall(buildUserKey(username))
        return Object.keys(userData).length === 0 ? null : userData
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

