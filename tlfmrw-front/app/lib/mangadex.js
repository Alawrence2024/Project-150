const API_BASE_URL = "https://api.mangadex.org"

export async function fetchMangaDetails(mangaId) {
    try {
        const mangaUrl = `${API_BASE_URL}/manga/${mangaId}?includes[]=cover_art&includes[]=author`
        const mangaResponse = await fetch(mangaUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                'Access-Control-Allow-Origin' : "*"
            },
        })

        if (!mangaResponse.ok) {
            throw new Error(`Failed to fetch manga: ${mangaResponse.status}`)
        }

        const mangaData = await mangaResponse.json()

        const chapterParams = new URLSearchParams({
            limit: 500,
            "translatedLanguage[]": "en",
            "order[chapter]": "asc",
            "includes[]": "scanlation_group",
        })

        const chapterUrl = `${API_BASE_URL}/manga/${mangaId}/feed?${chapterParams}`
        const chapterResponse = await fetch(chapterUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                'Access-Control-Allow-Origin' : "*"
            },
        })

        if (!chapterResponse.ok) {
            throw new Error(`Failed to fetch chapters: ${chapterResponse.status}`)
        }

        const chapterFeed = await chapterResponse.json()

        const titleMap = mangaData.data.attributes.title
        const englishTitle = titleMap.en || Object.values(titleMap)[0]

        const coverRel = mangaData.data.relationships.find(rel => rel.type === "cover_art")
        const coverFileName = coverRel?.attributes?.fileName || null

        const processedChapters = chapterFeed.data
            .map(ch => ({
                id: ch.id,
                title: ch.attributes.title,
                chapterNumber: ch.attributes.chapter,
                volume: ch.attributes.volume,
            }))
            .filter(ch => ch.chapterNumber != null)

        return {
            id: mangaId,
            title: englishTitle,
            description: mangaData.data.attributes.description.en || "No description available.",
            coverFileName,
            chapters: processedChapters,
        }
    } catch (error) {
        console.error("Error fetching manga:", error)
        throw error
    }
}

export function getMangaCoverUrl(mangaId, coverFileName, size = "medium") {
    if (!coverFileName) return null
    const sizeMap = {
        small: 256,
        medium: 512,
    }
    const sizeStr = sizeMap[size] ? `.${sizeMap[size]}` : ""
    return `https://uploads.mangadex.org/covers/${mangaId}/${coverFileName}${sizeStr}.jpg`
}

export async function fetchChapterPages(chapterId) {
    try {
        const chapterUrl = `${API_BASE_URL}/at-home/server/${chapterId}`
        const response = await fetch(chapterUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                'Access-Control-Allow-Origin' : "*"
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch chapter pages: ${response.status}`)
        }

        const data = await response.json()

        return {
            baseUrl: data.baseUrl,
            hash: data.chapter.hash,
            data: data.chapter.data,
            dataSaver: data.chapter.dataSaver,
        }
    } catch (error) {
        console.error("Error fetching chapter pages:", error)
        throw error
    }
}

export function getChapterImageUrl(baseUrl, hash, filename, quality = "data") {
    return `${baseUrl}/${quality}/${hash}/${filename}`
}