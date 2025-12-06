"use client";

import Image from "next/image";
import "@/styles/login.css";
import { useRouter } from "next/navigation";
import { useState } from "react";






export default function library() {

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");

  return (
    <main>
      <div className="container">
        <Image 
          src="/loginlogo.png" 
          alt="Logo" 
          width={1000} 
          height={700} 
          style={{ margin: "-20px" }} 
        />
      </div>

      <div className="container">
        <input className="futuristic-input" placeholder="Username" style={{ margin: "10px"}}
        
          value={username}
          onChange={(e) => {setUsername(e.target.value);}}
        />
        <input className="futuristic-input" placeholder="Password" type="password" 
        
          value={password}
          onChange={(e) => {setPassword(e.target.value);}}
        />

        <nav style={{ paddingTop: "10px" }}>
          <a href="/signup" style={{ color: "white" }}>
            Create Account
          </a>
        </nav>
      </div>
    </main>
  );
}


