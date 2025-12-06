// app/api/chapter/[chapterId]/route.js

import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.mangadex.org';

/**
 * Handles GET requests to fetch chapter page image data.
 * This is crucial for retrieving the list of image files and the base image URL.
 */
export async function GET(request, context) {
    // 1. Extract the chapterId from the dynamic route parameter
    const chapterId = context.params.chapterId; 

    if (!chapterId) {
        return NextResponse.json({ error: 'Chapter ID is required.' }, { status: 400 });
    }

    try {
        // --- 2. Request the Image Server URL and Filenames ---
        // We use the '/at-home/server/{chapterId}' endpoint.
        // The 'dataSaver=true' parameter requests smaller, compressed images.
        const response = await fetch(
            `${API_BASE_URL}/at-home/server/${chapterId}?forcePort443=false&dataSaver=true`
        );
        
        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch chapter images from MangaDex.' }, 
                { status: response.status }
            );
        }
        
        const data = await response.json();

        // --- 3. Process and Return Data ---
        
        // MangaDex response format:
        // { result: 'ok', baseUrl: '...', chapter: { hash: '...', dataSaver: [...filenames] } }
        
        const chapterHash = data.chapter.hash;
        const imageFilenames = data.chapter.dataSaver; // Using dataSaver mode filenames
        const baseUrl = data.baseUrl;

        // Return the clean data object expected by your front-end component
        return NextResponse.json({
            baseUrl: baseUrl,
            hash: chapterHash,
            data: imageFilenames, // This is the list of page filenames
        });

    } catch (error) {
        console.error('Server Error during chapter API call:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}