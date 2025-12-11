"use client";

import Image from "next/image";
import "@/styles/login.css"
import styles from "@/styles/login.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../lib/auth";
import { setUser } from "../lib/user"

export default function login() {
const { isLoggedIn, setLoggedIn } = useAuth()
const { userData, setUserData } = setUser()

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const router = useRouter()

async function signin() {
  const response = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({
      username: username,
      password: password
    })
  })

  const result = await response.json()

  console.log(result)
  if (result.success) {
    await fetch("/api/cookie", {
      method: "POST",
      body: JSON.stringify({
        username: username
      })
    })
    setLoggedIn(true)
    setUserData(username)
    router.push("/")
  } else {
    console.log("Invalid login.")
  }
}

  return (
    <div className="loginpage">

    <main>
      <div className={styles.container}>
        <Image 
          src="/LoginLogo.png" 
          alt="Logo" 
          width={1000} 
          height={700} 
          style={{ margin: "-20px" }} 
        />
      </div>

      <div className={styles.container}>
        <input className={styles.futuristic_input} placeholder="Username" style={{ margin: "10px"}}
        
          value={username}
          onChange={(e) => {setUsername(e.target.value);}}
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              signin()
            }
          }}
        />
        <input className={styles.futuristic_input} placeholder="Password" type="password" 
        
          value={password}
          onChange={(e) => {setPassword(e.target.value);}}
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              signin()
            }
          }}
        />

        <nav style={{ paddingTop: "10px" }}>
          <a href="/signup" style={{ color: "white" }}>
            Create Account
          </a>
        </nav>
      </div>
    </main>
    </div>
  )
}


