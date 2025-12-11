"use client"

import "@/styles/signup.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../lib/auth";
import { setUser } from "../lib/user";

export default function login() {
const { isLoggedIn, setLoggedIn } = useAuth()
const { userData, setUserData } = setUser()
const [username, setUsername] = useState("")
const [password, setPassword] = useState("")
const router = useRouter()

async function PostSignup() {
  const result = await fetch("/api/signup", {
    method: "POST",
    headers: {"Content-Type" : "application/json"},
    credentials: "include",
    body: JSON.stringify({
      username: username,
      password: password
    })
  })

  const data = await result.json()
  if (data.success) {
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
    console.log("User already exists")
  }
}

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
                onKeyDown={(e) => {
                  if (e.code === "Enter") {
                    PostSignup()
                  }
                }}
                />
            </div>
            <div className="input-wrapper">
                <input className="futuristic-input" placeholder="Password" type="password" 
                value={password}
                onChange={(e) => {setPassword(e.target.value);}}
                onKeyDown={(e) => {
                  if (e.code === "Enter") {
                    PostSignup()
                  }
                }}
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
  )
}


