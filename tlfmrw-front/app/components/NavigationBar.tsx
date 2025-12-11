"use client"

import styles from '@/styles/landing.module.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from "../lib/auth"
import { setUser } from '../lib/user'



export function NavigationBar() {
    const { isLoggedIn, setLoggedIn } = useAuth()
    const { userData, setUserData } = setUser()
    const router = useRouter()
    // const [user, setUser] = useState(null)


    useEffect(() => {
        async function GetCookie() {
            const userRequest = await fetch("/api/cookie")
            if (!userRequest.ok) return

            // const userData = await userRequest.json()
            // setUser(userData)
            setLoggedIn(true)
            router.refresh()
        }
        GetCookie()
    }, [isLoggedIn,])
    
    async function signout() {
        const response = await fetch("/api/cookie", {
            method: "DELETE",
            credentials: "include"
        })
        console.log(response)
        setLoggedIn(false)
        setUserData(null)
        router.refresh()
    }

    return (
        <nav>
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
                    {
                        isLoggedIn
                        ?
                        <button onClick={signout}>sign out</button>
                        :
                        <Link href="/login">Sign In</Link>
                    }
                </div>
            </div>
        </nav>
    )
}