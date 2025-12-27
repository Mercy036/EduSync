"use client"

import { useEffect } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface PlaceholderMapProps {
  center?: [number, number]
  zoom?: number
}

export default function PlaceholderMap({
  center = [28.6304, 77.2177],
  zoom = 12,
}: PlaceholderMapProps) {
  useEffect(() => {
    const map = L.map("carbuddy-map", {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
    }).setView(center, zoom)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map)

    return () => {
      map.remove()
    }
  }, [center, zoom])

  return (
    <div
      id="carbuddy-map"
      style={{ width: "100%", height: "100%", borderRadius: "14px" }}
    />
  )
}
