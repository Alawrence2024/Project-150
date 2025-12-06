async function getMangaById(mangaId) {
  try {
    const response = await fetch(`https://api.mangadex.org/manga/${mangaId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    const title = data.data.attributes.title;
    
    return {
      id: data.data.id,
      title: title,
      titleEnglish: title.en || Object.values(title)[0],
      altTitles: data.data.attributes.altTitles,
      description: data.data.attributes.description,
      status: data.data.attributes.status,
      year: data.data.attributes.year
    };
  } catch (error) {
    console.error('Error fetching manga:', error);
    throw error;
  }
}

async function searchMangaByTitle(searchTitle) {
  try {
    const params = new URLSearchParams({
      title: searchTitle,
      limit: 10
    });
    
    const response = await fetch(`https://api.mangadex.org/manga?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.data.map(manga => ({
      id: manga.id,
      title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
      allTitles: manga.attributes.title,
      altTitles: manga.attributes.altTitles,
      description: manga.attributes.description
    }));
  } catch (error) {
    console.error('Error searching manga:', error);
    throw error;
  }
}

// getMangaById('a96676e5-8ae2-425e-b549-7f15dd34a6d8')
//   .then(manga => {
//     console.log('Manga Title:', manga.titleEnglish);
//     console.log('Full data:', manga);
//   });

// searchMangaByTitle('One Piece')
//   .then(results => {
//     console.log('Found', results.length, 'manga(s)');
//     results.forEach((manga, index) => {
//       console.log(`${index + 1}. ${manga.title} (ID: ${manga.id})`);
//     });
//   });

//   async function getTrendingManga() {
//   try {
//     const params = new URLSearchParams({
//       limit: 10,
//       'includes[]': 'cover_art', // CRITICAL: This gets the image filename
//       'order[followedCount]': 'desc', // Sort by popularity
//       'contentRating[]': 'safe', // Filter out NSFW content
//     });

//     const response = await fetch(`https://api.mangadex.org/manga?${params}`);

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();

//     return data.data.map((manga) => {
//       // 1. Find the cover art relationship
//       const coverArt = manga.relationships.find((rel) => rel.type === 'cover_art');
//       const fileName = coverArt ? coverArt.attributes.fileName : null;

//       // 2. Construct the image URL
//       // usage: https://uploads.mangadex.org/covers/[mangaId]/[fileName]
//       // We add .256.jpg to request a smaller thumbnail version for performance
//       const coverUrl = fileName
//         ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg`
//         : 'https://via.placeholder.com/200x300?text=No+Cover'; // Fallback

//       return {
//         id: manga.id,
//         title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
//         description: manga.attributes.description.en || '',
//         coverUrl: coverUrl,
//       };
//     });
//   } catch (error) {
//     console.error('Error fetching trending manga:', error);
//     return [];
//   }
// }