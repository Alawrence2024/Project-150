// app/api/manga/[mangaId]/route.js

import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.mangadex.org';

/**
 * Handles GET requests to fetch manga details and chapters list.
 * @param {Request} request - The incoming request object.
 * @param {Object} context - The context object containing dynamic parameters.
 * @returns {NextResponse} The JSON response containing manga data or an error.
 */
export async function GET(request, context) {
    // 1. Extract the dynamic mangaId from the URL parameters
    const mangaId = context.params.mangaId; 

    if (!mangaId) {
        return NextResponse.json({ error: 'Manga ID is required.' }, { status: 400 });
    }

    try {
        // --- 2. Fetch Manga Details ---
        const mangaResponse = await fetch(
            `${API_BASE_URL}/manga/${mangaId}?includes[]=cover_art&includes[]=author`
        );
        
        if (!mangaResponse.ok) {
            // Forward API error status (e.g., 404 if manga not found)
            const errorData = await mangaResponse.json();
            return NextResponse.json({ error: errorData.errors || 'Failed to fetch manga details' }, { status: mangaResponse.status });
        }
        const mangaData = await mangaResponse.json();

        // --- 3. Fetch Chapters List ---
        // Fetch up to 500 English chapters, ordered by chapter number
        const chapterParams = new URLSearchParams({
            'limit': 500, 
            'translatedLanguage[]': 'en',
            'order[chapter]': 'asc',
            'includes[]': 'scanlation_group' 
        });
        
        const chapterResponse = await fetch(
            `${API_BASE_URL}/manga/${mangaId}/feed?${chapterParams}`
        );
        
        if (!chapterResponse.ok) {
            const errorData = await chapterResponse.json();
            return NextResponse.json({ error: errorData.errors || 'Failed to fetch chapter feed' }, { status: chapterResponse.status });
        }
        const chapterFeed = await chapterResponse.json();

        // --- 4. Process and Structure Data ---
        
        const titleMap = mangaData.data.attributes.title;
        const englishTitle = titleMap.en || Object.values(titleMap)[0];
        
        // Extract the main cover filename
        const coverArtRelationship = mangaData.data.relationships.find(rel => rel.type === 'cover_art');
        const coverFileName = coverArtRelationship ? coverArtRelationship.attributes.fileName : null;

        const processedChapters = chapterFeed.data
            .map(chapter => ({
                id: chapter.id,
                title: chapter.attributes.title,
                chapterNumber: chapter.attributes.chapter,
                volume: chapter.attributes.volume,
            }))
            .filter(c => c.chapterNumber !== null && c.chapterNumber !== undefined);

        // --- 5. Return Success Response ---
        return NextResponse.json({
            id: mangaId,
            title: englishTitle,
            description: mangaData.data.attributes.description.en || 'No description available.',
            coverFileName: coverFileName,
            chapters: processedChapters,
        });

    } catch (error) {
        console.error('Server Error during API call:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}