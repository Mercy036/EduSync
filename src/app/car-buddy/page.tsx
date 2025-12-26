"use client"

import { useState, useMemo } from "react"
import { MapPin, Star } from "lucide-react"
import "./car-buddy.css"
import ChatWindow from "@/src/components/ChatWindow"
import CarpoolHero from "@/src/components/CarpoolHero" // Ensure path is correct

interface Ride {
  id: string
  name: string
  destination: string
  distance: number
  price: number
  rating?: number
}

const mockRides: Ride[] = [
  { id: "1", name: "Aman Gupta", destination: "Sector 62", distance: 2.5, price: 40 },
  { id: "2", name: "Riya Sharma", destination: "Botanical Garden", distance: 8.2, price: 80 },
  { id: "3", name: "Kunal Singh", destination: "Noida Sec 15", distance: 12.0, price: 150 },
  { id: "4", name: "Priya Verma", destination: "Indirapuram", distance: 6.5, price: 60 },
  { id: "5", name: "Rahul Jain", destination: "Vaishali", distance: 9.1, price: 90 },
]

export default function CarpoolPage() {
  const [offerPrice, setOfferPrice] = useState(45)
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null)

  const ratingFromId = (id: string) => {
    let h = 0
    for (let i = 0; i < id.length; i++) {
      h = (h << 5) - h + id.charCodeAt(i)
      h |= 0
    }
    const positive = Math.abs(h)
    const scaled = (positive % 150) / 100 // 0.00 - 1.49
    return parseFloat((3.5 + scaled).toFixed(1))
  }

  const ridesWithRatings = useMemo(() => {
    return mockRides.map((r) => ({
      ...r,
      rating: ratingFromId(r.id),
    }))
  }, [])

  const nearbyRides = ridesWithRatings
    .filter((ride) => ride.distance <= 10)
    .sort((a, b) => a.distance - b.distance)

  return (
    <section className="carbuddy-dashboard-root">
      <header className="carbuddy-main-header">
        <div className="carbuddy-welcome-container">
          <h1>J<span>Carpool</span></h1>
          <p>Find students heading your way.</p>
        </div>
      </header>

      <div className="carbuddy-bento-layout">
        
        {/* FIX: Use the component directly. 
            We pass 'carbuddy-tile-wide' if your CSS grid needs it to span columns. */}
        <CarpoolHero 
          className="carbuddy-tile-wide" 
          offerPrice={offerPrice} 
          setOfferPrice={setOfferPrice} 
        />

        {/* Ride List Tile */}
        <div className="carbuddy-tile carbuddy-tile-wide carbuddy-tile-tall">
          <div className="carbuddy-list-header">
            <h3>Students Also Going Your Direction</h3>
            <p>{nearbyRides.length} active riders within 10km</p>
          </div>
          
          <div className="carbuddy-scroll-area">
            {nearbyRides.map((ride) => (
              <div key={ride.id} className="carbuddy-ride-item">
                <div className="carbuddy-ride-info">
                  <button 
                    className="carbuddy-name-trigger"
                    onClick={() => setSelectedRide(ride)}
                  >
                    {ride.name}
                  </button>
                  <div className="carbuddy-ride-meta">
                    <MapPin size={12} />
                    <span>{ride.destination}</span>
                    <span>• {ride.distance} km</span>
                  </div>
                  <div className="carbuddy-ride-rating">
                    <Star size={14} color="#d4a23a" />
                    <span>{ride.rating ?? "-"} / 5</span>
                  </div>
                </div>
                <div className="carbuddy-ride-actions">
                  <div className="carbuddy-price-badge">
                    ₹{ride.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Tiles */}
        <div className="carbuddy-tile carbuddy-stat-tile">
          <span className="carbuddy-tag-label">Rewards</span>
          <p className="carbuddy-stat-value">4.8</p>
          <p className="carbuddy-stat-label">Passenger Rating</p>
        </div>

        <div className="carbuddy-tile carbuddy-stat-tile">
          <span className="carbuddy-tag-label">History</span>
          <p className="carbuddy-stat-value">12</p>
          <p className="carbuddy-stat-label">Rides shared this month</p>
        </div>
      </div>

      {selectedRide && (
        <ChatWindow 
          recipientName={selectedRide.name}
          destination={selectedRide.destination}
          onClose={() => setSelectedRide(null)}
        />
      )}
    </section>
  )
}