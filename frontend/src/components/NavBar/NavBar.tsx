"use client";

import React, { useState, useEffect } from "react";
import styles from "./NavBar.module.css";
import { Button } from "../ui/button";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Calendar,
  Lightbulb,
  User,
  Settings,
  LogOut,
  Timer,
} from "lucide-react";
import Link from "next/link";

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  // Define routes with their paths, names and icons
  const routes = [
    {
      path: "/",
      name: "Dashboard",
      icon: <Home className={styles.navIcon} size={18} />,
    },
    {
      path: "/assignments",
      name: "Assignments",
      icon: <BookOpen className={styles.navIcon} size={18} />,
    },
    {
      path: "/calendar",
      name: "Calendar",
      icon: <Calendar className={styles.navIcon} size={18} />,
    },
    {
      path: "/productivity",
      name: "Productivity",
      icon: <Timer className={styles.navIcon} size={18} />,
    },
    {
      path: "/insights",
      name: "Insights",
      icon: <Lightbulb className={styles.navIcon} size={18} />,
    },
  ];

  // Determine if a route is active based on the current pathname
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className={`${styles.container} `}>
      <div className={`${styles.top} border-r border-zinc-200 pr-4`}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🎓</div>
          <span className={styles.logoText}>StudyDash</span>
        </div>

        <div className={styles.buttons}>
          {routes.map((route) => (
            <Button
              key={route.path}
              className={styles.navButton}
              onClick={() => router.push(route.path)}
              variant={isActive(route.path) ? "default" : "ghost"}
            >
              {route.icon}
              {route.name}
            </Button>
          ))}
        </div>
      </div>

      <div className={`${styles.bottom} border-r border-zinc-200 mr-2`}>
        <Button
          variant="ghost"
          className={styles.accountButton}
          onClick={() => router.push("/profile")}
        >
          <User size={16} className={styles.accountIcon} />
          <span>Profile</span>
        </Button>

        <Button
          variant="ghost"
          className={styles.accountButton}
          onClick={() => router.push("/settings")}
        >
          <Settings size={16} className={styles.accountIcon} />
          <span>Settings</span>
        </Button>

        <Button variant="ghost" className={styles.accountButton}>
          <LogOut size={16} className={styles.accountIcon} />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}
