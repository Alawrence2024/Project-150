"use client";

import "@/styles/library.css";
import { useRouter } from "next/navigation";
import { useEffect,useState } from "react";

interface Manga {
  title: string;
  cover: string;
}

export default function library() {
const [covers, setCovers] = useState<Manga[]>([]);

  useEffect(() => {
    async function fetchCovers() {
      const res = await fetch("");
      const data: Manga[] = await res.json();
      setCovers(data);
    }
    fetchCovers();
  }, []);

  return (
    <main>
      <div className="master_container">
        <div className="sidebar">
        </div>
        <div className="centered_container">
          <div className="scrollview" id="mangaDisplay">
            {covers.map((manga, i) => (
              <a>
                <img
                key={i}
                src={manga.cover}
                width={200}
                height={300}
                alt={manga.title}
                className="cover"
              />
              </a>


              

              
            ))}
          </div>
        </div>
        <div className="sidebar">
        </div>
      </div>
    </main>
  );
}

