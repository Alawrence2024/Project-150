'use client'; 

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '@/styles/landing.module.css'
import { NavigationBar } from "../app/components/NavigationBar"

async function getTrendingManga() {
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
            {/* <header>
                <NavigationBar />
            </header> */}

            <main className={styles.mainContent}>
                <section className={styles.heroSection}>
                    <h2>Welcome to MangaApp</h2>
                    <p>Discover and read your favorite manga</p>
                </section>

                <section className={styles.popularSection}>
                    <h3>Popular This Week</h3>
                    
                    {loading ? (
                        <p>Loading trending manga...</p>
                    ) : (
                        <div className={styles.mangaGrid}>
                            
                            {trendingManga.map((manga) => (
                                <Link 
                                    key={manga.id} 
                                    href={`/reader/${manga.id}`}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <div className={styles.mangaCard}>
                                        
                                        <div className={styles.coverImageContainer}>
                                            <img 
                                                src={manga.coverUrl} 
                                                alt={manga.title} 
                                                className={styles.coverImage}
                                            />
                                        </div>
                                        
                                        <h4 className={styles.mangaTitle}>
                                            {manga.title}
                                        </h4>
                                        
                                        <p className={styles.mangaDescription}>
                                            {manga.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}

                        </div>
                    )}
                </section>

            </main>

            <footer className={styles.footerContainer}>
                <p>© 2024 TLFMRW. All rights reserved.</p>
            </footer>
        </div>
    );
}