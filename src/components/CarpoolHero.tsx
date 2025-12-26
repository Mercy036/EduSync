import React from 'react';
import { Navigation, Disc, ArrowRight } from 'lucide-react';
import "../app/car-buddy/car-buddy.css"

interface HeroProps {
  className?: string;
  offerPrice: number;
  setOfferPrice: (price: number) => void;
}

const CarpoolHero = ({ className, offerPrice, setOfferPrice }: HeroProps) => {
  return (
    // We combine the base tile class with any extra layout classes passed in (like 'wide')
    <div className={`carbuddy-hero-tile ${className || ''}`}>
      
      <div className="carbuddy-badge">Student Match</div>

      <div className="carbuddy-hero-inner">
        <div className="carbuddy-location-card">
          
          {/* THE FIX: The vertical line is now guaranteed to exist */}
          <div className="carbuddy-timeline-line"></div>

          <div className="carbuddy-loc-row">
            <label>From</label>
            <div className="carbuddy-input-flex">
              <div className="carbuddy-icon-circle">
                <Disc size={20} className="carbuddy-icon-orange" fill="currentColor" />
              </div>
              <input type="text" className="carbuddy-loc-input" defaultValue="JIIT Main Campus" />
            </div>
          </div>

          <div className="carbuddy-divider"></div>

          <div className="carbuddy-loc-row">
            <label>To</label>
            <div className="carbuddy-input-flex">
               <div className="carbuddy-icon-circle">
                <Navigation size={20} className="carbuddy-icon-blue" fill="currentColor" />
               </div>
              <input type="text" className="carbuddy-loc-input" defaultValue="Sector 62 Metro" />
            </div>
          </div>
        </div>

        <div className="carbuddy-action-row">
          <button className="carbuddy-black-btn">
            Find Ride <ArrowRight size={18} />
          </button>

          <div className="carbuddy-price-pill">
            <span className="carbuddy-currency">₹</span>
            <input 
              type="number" 
              className="carbuddy-price-input" 
              value={offerPrice}
              onChange={(e) => setOfferPrice(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarpoolHero;