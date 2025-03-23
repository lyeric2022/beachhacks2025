"use client"

import React, { useState } from 'react'
import styles from './NavBar.module.css'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

export default function NavBar() {
  const [currentRoute, setCurrentRoute] = useState("Route One")
  const router = useRouter()


  const handleRoute = (route: string) => {
    setCurrentRoute(route)
    //router.push("/assignments")
  }

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.logo}>Logo</div>
        <div className={styles.buttons}>
          <Button style={{ border: "none", boxShadow: "none" }} onClick={() => { handleRoute("Route One") }} variant={currentRoute == "Route One" ? undefined : "outline"}>Route One</Button>
          <Button style={{ border: "none", boxShadow: "none" }} onClick={() => { handleRoute("Route Two") }} variant={currentRoute == "Route Two" ? undefined : "outline"}>Route Two</Button>
          <Button style={{ border: "none", boxShadow: "none" }} onClick={() => { handleRoute("Route Three") }} variant={currentRoute == "Route Three" ? undefined : "outline"}>Route Three</Button>
          <Button style={{ border: "none", boxShadow: "none" }} onClick={() => { handleRoute("Route Four") }} variant={currentRoute == "Route Four" ? undefined : "outline"}>Route Four</Button>
        </div>
      </div>
      <div className={styles.bottom}>
        <div>Account stuff</div>
        <div>Account stuff</div>
        <div>Account stuff</div>
      </div>
    </div>
  )
}
