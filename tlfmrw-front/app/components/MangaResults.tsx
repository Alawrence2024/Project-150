// components/MangaSearch.tsx
'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export function MangaSearch({ initialQuery }: { initialQuery: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Debounce the input to limit how often the URL update runs
  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    // Updates the URL query parameter
    replace(`${pathname}?${params.toString()}`);
  }, 500); // Wait 500ms after the user stops typing

  return (
    <div className="relative mb-4">
      <input
        type="text"
        placeholder="Search for a manga title..."
        // Use Tailwind utility classes for styling the input
        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={initialQuery}
      />
      <svg 
        className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
        fill="none" stroke="currentColor" viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
    </div>
  );
}