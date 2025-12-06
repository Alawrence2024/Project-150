"use client";

import "@/styles/reader.css";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { fetchChapterPages, getChapterImageUrl } from '@/app/lib/mangadex';

export default function ChapterReaderPage() {
    const params = useParams();
    const mangaId = params.mangaId;
    const chapterId = params.chapterId;
    
    const [chapterData, setChapterData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    
    useEffect(() => {
        if (!chapterId) return;
        
        async function loadChapterPages() {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchChapterPages(chapterId);
                setChapterData(data);
            } catch (err) {
                console.error("Failed to load chapter pages:", err);
                setError(err.message || "Could not load chapter pages.");
            } finally {
                setLoading(false);
            }
        }
        
        loadChapterPages();
    }, [chapterId]);

    const getCurrentImageUrl = () => {
        if (!chapterData || !chapterData.data || chapterData.data.length === 0) {
            return '';
        }
        
        const filename = chapterData.data[currentPageIndex];
        return getChapterImageUrl(chapterData.baseUrl, chapterData.hash, filename);
    };

    const goToNextPage = () => {
        if (chapterData && currentPageIndex < chapterData.data.length - 1) {
            setCurrentPageIndex(prev => prev + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPageIndex > 0) {
            setCurrentPageIndex(prev => prev - 1);
        }
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowLeft') {
                goToPrevPage();
            } else if (e.key === 'ArrowRight') {
                goToNextPage();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentPageIndex, chapterData]);

    if (loading) {
        return (
            <main style={{ padding: '50px', textAlign: 'center' }}>
                <p>Loading Chapter...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main style={{ padding: '50px', textAlign: 'center' }}>
                <p style={{ color: 'red' }}>Error: {error}</p>
                <Link href={`/reader/${mangaId}`} style={{ color: '#450707ff' }}>
                    &larr; Back to Chapter List
                </Link>
            </main>
        );
    }

    if (!chapterData || !chapterData.data || chapterData.data.length === 0) {
        return (
            <main style={{ padding: '50px', textAlign: 'center' }}>
                <p>No pages found for this chapter.</p>
                <Link href={`/reader/${mangaId}`} style={{ color: '#450707ff' }}>
                    &larr; Back to Chapter List
                </Link>
            </main>
        );
    }

    const totalPages = chapterData.data.length;

    return (
        <main>
            <div className="master_container">
                <div className="sidebar">
                    <button onClick={goToPrevPage} disabled={currentPageIndex === 0}>
                        &larr; Previous Page
                    </button>
                    <p>Page {currentPageIndex + 1} of {totalPages}</p>
                    <button onClick={goToNextPage} disabled={currentPageIndex >= totalPages - 1}>
                        Next Page &rarr;
                    </button>
                    <Link href={`/reader/${mangaId}`} style={{ marginTop: '20px', display: 'block' }}>
                        &larr; Back to Chapter List
                    </Link>
                </div>
                
                <div className="centered_container">
                    <div className="pageViewer">
                        <div className="page">
                            <img
                                src={getCurrentImageUrl()} 
                                alt={`Page ${currentPageIndex + 1}`}
                                style={{ 
                                    maxWidth: '100%', 
                                    height: 'auto', 
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)' 
                                }}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="sidebar">
                    <p>Page {currentPageIndex + 1} of {totalPages}</p>
                    <p style={{ fontSize: '0.8em', color: '#666', marginTop: '20px' }}>
                        Use arrow keys to navigate
                    </p>
                </div>
            </div>
        </main>
    );
}