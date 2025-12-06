// app/reader/[mangaId]/chapter/[chapterId]/page.js

"use client";

import "@/styles/reader.css";
import { useParams } from "next/navigation"; // <-- Use useParams for App Router
import { useEffect, useState } from "react";
import Link from 'next/link'; // Added Link for navigation

// Define the structure for the fetched data
interface ChapterData {
  hash: string;
  data: string[]; // Array of image filenames
  baseUrl: string; // The image server base URL
}

export default function ChapterReaderPage() {
    
    // Use useParams to access the dynamic segments from the URL
    const params = useParams();
    const mangaId = params.mangaId as string;
    const chapterId = params.chapterId as string;
    
    // State to hold the fetched chapter pages data
    const [chapterData, setChapterData] = useState<ChapterData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // This state will track the current page number for display
    const [currentPageIndex, setCurrentPageIndex] = useState(0); 
    
    // --- 1. Fetch Chapter Image URLs ---
    useEffect(() => {
        if (!chapterId) return;
        
        async function fetchChapterPages() {
            setLoading(true);
            
            // NOTE: You must create this new API route (e.g., /api/chapter/[chapterId])
            const apiUrl = `/api/chapter/${chapterId}`; 
            
            try {
                const res = await fetch(apiUrl);
                if (!res.ok) {
                    throw new Error(`Failed to fetch chapter data (Status: ${res.status})`);
                }
                const data: ChapterData = await res.json();
                
                // The API route should return { hash, data (filenames), baseUrl }
                setChapterData(data);
                setError(null);
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Could not load chapter pages. Check API endpoint.");
            } finally {
                setLoading(false);
            }
        }
        fetchChapterPages();
    }, [chapterId]);


    // --- 2. Construct the full image URL ---
    // This is the function that builds the final, readable image URL
    const getCurrentImageUrl = () => {
        if (!chapterData || !chapterData.data || chapterData.data.length === 0) return '';
        
        const filename = chapterData.data[currentPageIndex];
        // The MangaDex image URL format is usually: BASE_URL + QUALITY_MODE + HASH + FILENAME
        // Assuming your local API already built the BASE_URL
        return `${chapterData.baseUrl}/data/${chapterData.hash}/${filename}`;
    };

    // --- 3. Handle Navigation ---
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


    // --- 4. Render the UI ---

    if (loading) {
        return <main>Loading Chapter...</main>;
    }

    if (error) {
        return <main style={{ padding: '50px', color: 'red' }}>Error: {error}</main>;
    }

    const totalPages = chapterData?.data.length || 0;

    return (
        <main>
            <div className="master_container">
                <div className="sidebar">
                    {/* Navigation buttons */}
                    <button onClick={goToPrevPage} disabled={currentPageIndex === 0}>
                        &larr; Previous Page
                    </button>
                    <p>Page {currentPageIndex + 1} of {totalPages}</p>
                    <button onClick={goToNextPage} disabled={currentPageIndex >= totalPages - 1}>
                        Next Page &rarr;
                    </button>
                    {/* Link back to chapter list */}
                    <Link href={`/reader/${mangaId}`} style={{ marginTop: '20px', display: 'block' }}>
                        &larr; Back to Chapter List
                    </Link>
                </div>
                
                <div className="centered_container">
                    <div className="pageViewer">
                        <div className="page">
                            <img
                                // The crucial part: setting the src dynamically
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
                    {/* Repeat buttons/info for easy access */}
                    <p>Page {currentPageIndex + 1} of {totalPages}</p>
                </div>
            </div>
        </main>
    );
}