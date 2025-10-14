"use client"

import { useEffect } from "react"

export function SWRegister() {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            const registerSW = async () => {
                try {
                    const reg = await navigator.serviceWorker.register("/sw.js")
                    // optional: listen for updates
                    reg.addEventListener("updatefound", () => {
                        const installing = reg.installing
                        if (!installing) return
                        installing.addEventListener("statechange", () => {
                            if (installing.state === "installed") {
                                // new content available if there's an active controller
                                if (navigator.serviceWorker.controller) {
                                    console.log("New content available, refresh to update.")
                                } else {
                                    console.log("Content cached for offline use.")
                                }
                            }
                        })
                    })
                } catch (err) {
                    console.error("SW registration failed:", err)
                }
            }
            registerSW()
        }
    }, [])

    return null
}