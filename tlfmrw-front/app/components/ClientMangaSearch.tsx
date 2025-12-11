'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchResultsGrid } from './SearchResultsGrid';
import { MangaSearch } from './MangaSearch';

interface Manga {
  id: string;
  attributes: {
    title: { [key: string]: string };
    description: { [key: string]: string };
  };
  relationships?: Array<{
    type: string;
    attributes?: { fileName?: string };
  }>;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [mangaResults, setMangaResults] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMangaData = async () => {
      if (!query) {
        setMangaResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(
          `https://api.mangadex.org/manga?title=${encodeURIComponent(query)}&limit=25&includes[]=cover_art`
        );
        
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setMangaResults(data.data || []);
      } catch (err) {
        console.error(err);
        setMangaResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMangaData();
  }, [query]);

  return (
    <div>
      <MangaSearch initialQuery={query} />
      <div className="mt-8">
        {query ? (
          <h2 className="text-[rgba(69,7,7,1)] text-2xl font-semibold mb-4">
            Results for: <span className="font-normal">"{query}"</span> ({mangaResults.length} found)
          </h2>
        ) : (
          <h2 className="text-2xl font-semibold mb-4 text-gray-500">
            Enter a title above
          </h2>
        )}

        {isLoading && (
          <p className="text-xl text-indigo-600 font-medium">Searching MangaDex...</p>
        )}

        {!isLoading && mangaResults.length > 0 && (
          <SearchResultsGrid mangaList={mangaResults} />
        )}

        {!isLoading && query && mangaResults.length === 0 && (
          <p className="text-gray-600">No manga found for this search term.</p>
        )}
      </div>
    </div>
  );
}

export function ClientMangaSearch() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}