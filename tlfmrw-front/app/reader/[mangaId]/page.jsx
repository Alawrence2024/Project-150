"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { fetchMangaDetails, getMangaCoverUrl } from '../../lib/mangadex';

export default function ChapterListPage({ params }) {
    const { mangaId } = React.use(params);
    const [manga, setManga] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        async function loadManga() {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchMangaDetails(mangaId);
                setManga(data);
            } catch (err) {
                console.error('Failed to load manga:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        
        loadManga();
    }, [mangaId]);

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <p>Loading manga details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <p style={{ color: 'red' }}>Error: {error}</p>
                <Link href="/" style={{ color: '#450707ff' }}>
                    &larr; Back to Home
                </Link>
            </div>
        );
    }

    if (!manga) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <p>Manga not found</p>
                <Link href="/" style={{ color: '#450707ff' }}>
                    &larr; Back to Home
                </Link>
            </div>
        );
    }

    const coverUrl = getMangaCoverUrl(manga.id, manga.coverFileName, 'medium');
    
    const sortedChapters = manga.chapters.sort((a, b) => 
        (parseFloat(a.chapterNumber) || 0) - (parseFloat(b.chapterNumber) || 0)
    );

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <Link href="/" style={{ textDecoration: 'none', color: '#450707ff', marginBottom: '20px', display: 'block' }}>
                &larr; Back to Home
            </Link>

            <header style={{ display: 'flex', gap: '40px', marginBottom: '60px' }}>
                <img 
                    src={coverUrl || 'https://via.placeholder.com/512x768?text=No+Cover'} 
                    alt={manga.title} 
                    style={{ width: '250px', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
                />
                <div>
                    <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem' }}>{manga.title}</h1>
                    <p style={{ color: '#666', lineHeight: '1.6' }}>
                        {manga.description.length > 500 ? manga.description.substring(0, 500) + '...' : manga.description}
                    </p>
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
                        sortedChapters.map(chapter => {

                            console.log('Chapter ID:', chapter.id, 'Chapter Number:', chapter.chapterNumber)
                            return (
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
                                        <strong>Vol. {chapter.volume || '?'}, Chapter {chapter.chapterNumber}</strong>
                                        {chapter.title && `: ${chapter.title}`}
                                    </span>
                                    <span style={{ color: '#450707ff', fontWeight: 'bold' }}>READ &rarr;</span>
                                </div>
                            </Link>
                        )})
                    )}
                </div>
            </section>
        </div>
    );
}