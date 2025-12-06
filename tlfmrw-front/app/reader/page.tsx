"use client";

import "@/styles/reader.css";
import { useRouter } from "next/navigation";
import { useEffect,useState } from "react";

interface Manga {
  title: string;
  pages: string[];
}

export default function library() {
const [pages, setPages] = useState<Manga[]>([]);

  useEffect(() => {
    async function fetchPages() {
      const res = await fetch("");
      const data: Manga[] = await res.json();
      setPages(data);
    }
    fetchPages();
  }, []);

  return (

  

    <main>
      <div className="master_container">
        <div className="sidebar">
        </div>
        <div className="centered_container">
          <div className="pageViewer">
            <div className="page">
              <img

              />
            </div>
            
          </div>
        </div>
        <div className="sidebar">
        </div>
      </div>
      
    </main>
  );
}



