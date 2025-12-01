// Fetch manga by ID (no authentication required)
async function getMangaById(mangaId) {
  try {
    const response = await fetch(`https://api.mangadex.org/manga/${mangaId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the title (titles can be in multiple languages)
    const title = data.data.attributes.title;
    
    return {
      id: data.data.id,
      title: title,
      // Get English title if available, otherwise get first available
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

// Example: Search manga by title (no authentication required)
async function searchMangaByTitle(searchTitle) {
  try {
    const params = new URLSearchParams({
      title: searchTitle,
      limit: 10 // Limit results to 10
    });
    
    const response = await fetch(`https://api.mangadex.org/manga?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Map results to simplified format
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

// Usage examples:

// Get specific manga by ID
getMangaById('a96676e5-8ae2-425e-b549-7f15dd34a6d8')
  .then(manga => {
    console.log('Manga Title:', manga.titleEnglish);
    console.log('Full data:', manga);
  });

// Search for manga by title
searchMangaByTitle('One Piece')
  .then(results => {
    console.log('Found', results.length, 'manga(s)');
    results.forEach((manga, index) => {
      console.log(`${index + 1}. ${manga.title} (ID: ${manga.id})`);
    });
  });