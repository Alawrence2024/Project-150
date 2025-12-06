// app/reader/[mangaId]/page.js

import Link from 'next/link';
import { notFound } from 'next/navigation';

// Base URL for the MangaDex image server
const MANGADEX_COVER_URL = 'https://uploads.mangadex.org/covers';

/**
 * Fetches the manga details and chapters list from your internal API route.
 * @param {string} mangaId - The ID of the manga to fetch.
 */
async function getMangaData(mangaId) {
    // Call your internal API route
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/manga/${mangaId}`);
    
    if (!response.ok) {
        // If your API route returns an error (e.g., 404), throw a notFound error
        return null;
    }
    
    return response.json();
}

// Next.js passes the route parameters (e.g., /reader/MANGA_ID) into the params object
export default async function ChapterListPage({ params }) {
    const mangaId = await params.mangaId;
    
    // Fetch data using the server component's async capability
    const manga = await getMangaData(mangaId);

    if (!manga) {
        notFound();
    }

    // Construct the full cover image URL
    const coverUrl = manga.coverFileName 
        ? `${MANGADEX_COVER_URL}/${manga.id}/${manga.coverFileName}.512.jpg`
        : 'https://via.placeholder.com/512x768?text=No+Cover';
    
    // Optional: Sort chapters to ensure numeric order
    const sortedChapters = manga.chapters.sort((a, b) => 
        (parseFloat(a.chapterNumber) || 0) - (parseFloat(b.chapterNumber) || 0)
    );

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <Link href="/" style={{ textDecoration: 'none', color: '#450707ff', marginBottom: '20px', display: 'block' }}>
                &larr; **Back to Home**
            </Link>

            <header style={{ display: 'flex', gap: '40px', marginBottom: '60px' }}>
                <img 
                    src={coverUrl} 
                    alt={manga.title} 
                    style={{ width: '250px', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
                />
                <div>
                    <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem' }}>{manga.title}</h1>
                    <p style={{ color: '#666', lineHeight: '1.6' }}>
                        {manga.description.length > 500 ? manga.description.substring(0, 500) + '...' : manga.description}
                    </p>
                    {/* Add Author/Status/etc. here if you modify your API route to fetch it */}
                </div>
            </header>

            <section>
                <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                    Chapter List ({manga.chapters.length})
                </h2>
                
                <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
                    {sortedChapters.length === 0 ? (
                        <p style={{ padding: '20px' }}>No English chapters found for this title.</p>
                    ) : (
                        sortedChapters.map(chapter => (
                            // CRUCIAL: Link to the final Page Reader
                            <Link 
                                key={chapter.id} 
                                href={`/reader/${mangaId}/chapter/${chapter.id}`}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <div 
                                    style={{ 
                                        padding: '15px 20px', 
                                        borderBottom: '1px solid #eee', 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        backgroundColor: '#f9f9f9',
                                        transition: 'background-color 0.2s',
                                        cursor: 'pointer'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                                >
                                    <span>
                                        **Vol. {chapter.volume || '?'}, Chapter {chapter.chapterNumber}** {chapter.title && `: ${chapter.title}`}
                                    </span>
                                    <span style={{ color: '#450707ff', fontWeight: 'bold' }}>READ &rarr;</span>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}