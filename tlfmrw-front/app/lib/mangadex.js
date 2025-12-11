"use client"

async function fetchFromProxy(endpoint) {
  const response = await fetch(`/api/mangadex?endpoint=${encodeURIComponent(endpoint)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }
  return response.json();
}

export async function fetchMangaDetails(mangaId) {
  try {
    const mangaEndpoint = `/manga/${mangaId}?includes[]=cover_art&includes[]=author`;
    const mangaData = await fetchFromProxy(mangaEndpoint);

    const chapterParams = new URLSearchParams({
      limit: 500,
      "translatedLanguage[]": "en",
      "order[chapter]": "asc",
      "includes[]": "scanlation_group",
    });
    const chapterEndpoint = `/manga/${mangaId}/feed?${chapterParams}`;
    const chapterFeed = await fetchFromProxy(chapterEndpoint);

    const titleMap = mangaData.data.attributes.title;
    const englishTitle = titleMap.en || Object.values(titleMap)[0];
    const coverRel = mangaData.data.relationships.find(rel => rel.type === "cover_art");
    const coverFileName = coverRel?.attributes?.fileName || null;

    const processedChapters = chapterFeed.data
      .map(ch => ({
        id: ch.id,
        title: ch.attributes.title,
        chapterNumber: ch.attributes.chapter,
        volume: ch.attributes.volume,
      }))
      .filter(ch => ch.chapterNumber != null);

    return {
      id: mangaId,
      title: englishTitle,
      description: mangaData.data.attributes.description.en || "No description available.",
      coverFileName,
      chapters: processedChapters,
    };
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
}

export function getMangaCoverUrl(mangaId, coverFileName, size = "medium") {
  if (!coverFileName) return null;
  const sizeMap = {
    small: 256,
    medium: 512,
  };
  const sizeStr = sizeMap[size] ? `.${sizeMap[size]}` : "";
  return `https://uploads.mangadex.org/covers/${mangaId}/${coverFileName}${sizeStr}.jpg`;
}

export async function fetchChapterPages(chapterId) {
  try {
    const chapterEndpoint = `/at-home/server/${chapterId}`;
    const data = await fetchFromProxy(chapterEndpoint);

    return {
      baseUrl: data.baseUrl,
      hash: data.chapter.hash,
      data: data.chapter.data,
      dataSaver: data.chapter.dataSaver,
    };
  } catch (error) {
    console.error("Error fetching chapter pages:", error);
    throw error;
  }
}

export function getChapterImageUrl(baseUrl, hash, filename, quality = "data") {
  return `${baseUrl}/${quality}/${hash}/${filename}`;
}