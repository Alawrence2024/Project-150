import Redis from "ioredis"

const redis = new Redis({
    host: "redis_cache",
    port: 6379
}
)

export const C_DAL = {
    async CacheChapters(mangaId, chapterId, pageNum) {
        
    }
}