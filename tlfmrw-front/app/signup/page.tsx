"use client";

import "@/styles/signup.css";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function login() {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");

  return (
    <main>
      <div className="container" style={{paddingTop: 100}}>
        <span>
            Free manga is waiting...
        </span>
        <div className="row">
            <div className="input-wrapper">
                <input className="futuristic-input" placeholder="Username" style={{ margin: "0px"}}
                value={username}
                onChange={(e) => {setUsername(e.target.value);}}
                />
            </div>
            <div className="input-wrapper">
                <input className="futuristic-input" placeholder="Password" type="password" 
                value={password}
                onChange={(e) => {setPassword(e.target.value);}}
                />
            </div>
        </div>
        <nav style={{ paddingTop: "20px" }}>
          <a href="/login" style={{ color: "white" }}>
            Return
          </a>
        </nav>
      </div>
    </main>
  );
}


