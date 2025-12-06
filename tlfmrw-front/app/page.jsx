'use client'; 

import Link from 'next/link';
import { useEffect, useState } from 'react';
// FIX 1: Change import to use the variable (styles) and ensure it's a CSS Module import (e.g., landing.module.css)
import styles from '@/styles/landing.module.css'; 

// --- API Helper Function (Keep this here or move to a separate lib file) ---
async function getTrendingManga() {
    // ... (API logic remains unchanged)
    const params = new URLSearchParams({
        limit: 10,
        'includes[]': 'cover_art',
        'order[followedCount]': 'desc',
        'contentRating[]': 'safe', 
    });

    try {
        const response = await fetch(`https://api.mangadex.org/manga?${params}`);
        const data = await response.json();

        return data.data.map((manga) => {
            const coverArt = manga.relationships.find((rel) => rel.type === 'cover_art');
            const fileName = coverArt ? coverArt.attributes.fileName : null;
            return {
                id: manga.id,
                title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
                coverUrl: fileName
                    ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg`
                    : 'https://via.placeholder.com/200x300?text=No+Image',
                description: manga.attributes.description.en || 'No description available',
            };
        });
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default function LandingPage() {
    const [trendingManga, setTrendingManga] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getTrendingManga();
            setTrendingManga(data);
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <div>
            {/* Header Section */}
            <header>
                {/* FIX 2: Use styles.headerContainer */}
                <div className={styles.headerContainer}> 
                    <div className={styles.headerNav}>
                        <Link href="/">
                            <h1 className={styles.logoTitle}>TLFMRW</h1>
                        </Link>
                        <nav className={styles.navLinks}>
                            <Link href="/library">Library</Link>
                            <Link href="/search">Search</Link>
                        </nav>
                    </div>
                    <div>
                        <Link href="/login">Sign In</Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {/* Hero Section */}
                <section className={styles.heroSection}>
                    <h2>Welcome to MangaApp</h2>
                    <p>Discover and read your favorite manga</p>
                </section>

                {/* --- POPULAR SECTION (5x2 GRID) --- */}
                <section className={styles.popularSection}>
                    <h3>Popular This Week</h3>
                    
                    {loading ? (
                        <p>Loading trending manga...</p>
                    ) : (
                        // FIX 2: Use styles.mangaGrid
                        <div className={styles.mangaGrid}>
                            
                            {trendingManga.map((manga) => (
                                // STEP 3: Wrap the card in a Link component
                                <Link 
                                    key={manga.id} 
                                    href={`/reader/${manga.id}`} // Dynamic route to your reader page
                                    style={{ textDecoration: 'none', color: 'inherit' }} // Remove default link styling
                                >
                                    {/* FIX 2: Use styles.mangaCard */}
                                    <div className={styles.mangaCard}>
                                        
                                        {/* Image Container */}
                                        <div className={styles.coverImageContainer}>
                                            <img 
                                                src={manga.coverUrl} 
                                                alt={manga.title} 
                                                className={styles.coverImage}
                                            />
                                        </div>
                                        
                                        {/* Title */}
                                        <h4 className={styles.mangaTitle}>
                                            {manga.title}
                                        </h4>
                                        
                                        {/* Description */}
                                        <p className={styles.mangaDescription}>
                                            {manga.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}

                        </div>
                    )}
                </section>

                {/* Call to Action Section (Assuming you want to keep the light background) */}
                <section style={{ textAlign: 'center', padding: '40px 20px', background: '#f5f5f5' }}>
                    <h3>Start Reading Today</h3>
                    <p>Join thousands of manga readers</p>
                    <Link href="/signin">
                        <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
                            Get Started
                        </button>
                    </Link>
                </section>
            </main>

            {/* Footer */}
            <footer className={styles.footerContainer}>
                <p>© 2024 TLFMRW. All rights reserved.</p>
            </footer>
        </div>
    );
}