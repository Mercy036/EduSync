"use client"

import { useEffect } from "react"

interface PlaceholderMapProps {
  center?: [number, number]
  zoom?: number
}

export default function PlaceholderMap({
  center = [28.6304, 77.2177],
  zoom = 12,
}: PlaceholderMapProps) {
  useEffect(() => {
    let mounted = true

    ;(async () => {
      if (!mounted) return
      const L = await import("leaflet")
      // Inject Leaflet CSS via a link tag to avoid server-side CSS dynamic import errors
      if (typeof document !== "undefined" && !document.getElementById("leaflet-css")) {
        const link = document.createElement("link")
        link.id = "leaflet-css"
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        link.crossOrigin = ""
        document.head.appendChild(link)
      }

      const el = document.getElementById("carbuddy-map")
      // If a map instance was previously attached to the element, remove it first
      if (el && (el as any).__leaflet_map) {
        try {
          (el as any).__leaflet_map.remove()
        } catch (e) {
          // ignore removal errors
        }
        delete (el as any).__leaflet_map
      }

      const map = L.map("carbuddy-map", {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
      }).setView(center, zoom)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map)

      // store instance on element for later cleanup
      if (el) (el as any).__leaflet_map = map
    })()

    return () => {
      mounted = false
      const el = document.getElementById("carbuddy-map")
      if (el && (el as any).__leaflet_map) {
        try {
          (el as any).__leaflet_map.remove()
        } catch (e) {
          /* ignore */
        }
        delete (el as any).__leaflet_map
      }
    }
  }, [center, zoom])

  return (
    <div
      id="carbuddy-map"
      style={{ width: "100%", height: "100%", borderRadius: "14px" }}
    />
  )
}
