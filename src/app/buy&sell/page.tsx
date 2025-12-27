"use client";

import { useState } from "react";
import AuthGuard from "@/src/components/AuthGuard";
import { 
  Search, 
  Plus, 
  MapPin, 
  X, 
  Share2, 
  MessageCircle, 
  Tag
} from "lucide-react";
import "./marketplace.css";

// --- Types ---
interface Listing {
  id: string;
  title: string;
  price: number;
  category: string;
  location: "Jaypee Sector 62 Campus" | "Jaypee Sector 128 Campus";
  description: string;
  image: string;
  sellerName: string;
  sellerJoined: string;
  postedAt: string;
}

// --- Mock Data ---
const SAMPLE_LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Engineering Mathematics - H.K. Dass (Used)",
    price: 450,
    category: "Books",
    location: "Jaypee Sector 62 Campus",
    description: "Slightly used copy, good condition. No highlighting inside. Necessary for 1st year B.Tech students. Pickup from JBH Hostel.",
    image: "https://m.media-amazon.com/images/I/71s8Q4l+JBL._AC_UF1000,1000_QL80_.jpg", 
    sellerName: "Aarav Singh",
    sellerJoined: "2023",
    postedAt: "2 days ago"
  },
  {
    id: "2",
    title: "Scientific Calculator fx-991ES Plus",
    price: 800,
    category: "Electronics",
    location: "Jaypee Sector 128 Campus",
    description: "Original Casio calculator. Working perfectly. Solar panel intact. Selling because I upgraded.",
    image: "https://m.media-amazon.com/images/I/61Z5y+2yG9L.jpg",
    sellerName: "Priya Sharma",
    sellerJoined: "2022",
    postedAt: "5 hours ago"
  },
  {
    id: "3",
    title: "Mini Cooler for Hostel Room",
    price: 2500,
    category: "Appliances",
    location: "Jaypee Sector 62 Campus",
    description: "Lifesaver for summers. Compact size, fits on study table. Low power consumption. Comes with original box.",
    image: "https://m.media-amazon.com/images/I/51r+2+w+1gL._SX679_.jpg",
    sellerName: "Rohan Gupta",
    sellerJoined: "2021",
    postedAt: "1 day ago"
  },
  {
    id: "4",
    title: "Drafter + Roller Scale Combo",
    price: 300,
    category: "Stationery",
    location: "Jaypee Sector 62 Campus",
    description: "Complete engineering drawing kit. Omega drafter + 30cm roller scale. Used for one semester only.",
    image: "https://m.media-amazon.com/images/I/61jC5yQ8YJL.jpg",
    sellerName: "Neha Patel",
    sellerJoined: "2024",
    postedAt: "Just now"
  },
  {
    id: "5",
    title: "Decathlon Cycle (Triban RC100)",
    price: 12000,
    category: "Vehicles",
    location: "Jaypee Sector 128 Campus",
    description: "Road bike in excellent condition. Serviced last month. Great for commuting between gates. Includes lock.",
    image: "https://contents.mediadecathlon.com/p1287954/k$550ef313508c909c251d855018d721d7/road-bike-triban-rc100-grey.jpg?format=auto&quality=40&f=800x800",
    sellerName: "Vikram Malhotra",
    sellerJoined: "2022",
    postedAt: "3 days ago"
  }
];

const CATEGORIES = ["All", "Books", "Electronics", "Appliances", "Stationery", "Vehicles", "Clothing", "Other"];

export default function CampusMarketplacePage() {
  const [listings, setListings] = useState<Listing[]>(SAMPLE_LISTINGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<Listing | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  // New Listing Form State
  const [newListing, setNewListing] = useState({
    title: "",
    price: "",
    category: "Books",
    description: "",
    location: "Jaypee Sector 62 Campus"
  });

  const filteredListings = listings.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleShare = (item: Listing) => {
    const dummyLink = `https://edusync.com/marketplace/${item.id}`;
    navigator.clipboard.writeText(dummyLink);
    alert("Link copied to clipboard!");
  };

  const handleMessageSeller = (sellerName: string) => {
    alert(`Chat window opened with ${sellerName}. (Feature coming soon!)`);
  };

  const handleAddListing = (e: React.FormEvent) => {
    e.preventDefault();
    const item: Listing = {
      id: Math.random().toString(36).substr(2, 9),
      title: newListing.title,
      price: parseInt(newListing.price) || 0,
      category: newListing.category,
      location: newListing.location as any,
      description: newListing.description,
      // Placeholder image for user uploads
      image: "https://placehold.co/600x600?text=New+Item", 
      sellerName: "You",
      sellerJoined: "2024",
      postedAt: "Just now"
    };

    setListings([item, ...listings]);
    setIsSellModalOpen(false);
    setNewListing({ title: "", price: "", category: "Books", description: "", location: "Jaypee Sector 62 Campus" });
  };

  return (
    <AuthGuard>
      <div className="marketplace-container">
        
        {/* HEADER */}
        <header className="marketplace-header">
          <div>
            <h1>Campus<span>Marketplace</span></h1>
            <p style={{ color: '#666', marginTop: '0.5rem' }}>Buy & sell items within Jaypee Campus</p>
          </div>
          
          <div className="marketplace-actions">
            <div className="search-bar-wrapper">
              <Search className="search-icon" size={18} />
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn-sell" onClick={() => setIsSellModalOpen(true)}>
              <Plus size={18} />
              Sell Item
            </button>
          </div>
        </header>

        {/* CATEGORY FILTER */}
        <div className="category-filter">
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ITEMS GRID */}
        <div className="items-grid">
          {filteredListings.length > 0 ? (
            filteredListings.map(item => (
              <div 
                key={item.id} 
                className="item-card"
                onClick={() => setSelectedItem(item)}
              >
                <div className="item-image-box">
                  <img src={item.image} alt={item.title} className="item-img" />
                </div>
                <div className="item-info">
                  <span className="price-tag">₹{item.price.toLocaleString()}</span>
                  <span className="item-name">{item.title}</span>
                  <div className="item-location">
                    <MapPin size={12} />
                    {item.location.replace("Jaypee ", "")}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem", color: "#999" }}>
              <p>No items found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* ITEM DETAIL MODAL */}
        {selectedItem && (
          <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
            <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal-btn" onClick={() => setSelectedItem(null)}>
                <X size={20} />
              </button>
              
              <div className="modal-left">
                <img src={selectedItem.image} alt={selectedItem.title} className="modal-img-full" />
              </div>

              <div className="modal-right">
                <h2 className="modal-title">{selectedItem.title}</h2>
                <div className="modal-price-large">₹{selectedItem.price.toLocaleString()}</div>
                
                <div className="modal-tags">
                  <div className="tag-pill">
                    <Tag size={14} /> 
                    {selectedItem.category}
                  </div>
                  <div className="tag-pill">
                    <MapPin size={14} />
                    {selectedItem.location}
                  </div>
                </div>

                <div className="seller-row">
                  <div className="seller-pic">
                    {selectedItem.sellerName.charAt(0)}
                  </div>
                  <div className="seller-text">
                    <h4>{selectedItem.sellerName}</h4>
                    <p>Student • Joined {selectedItem.sellerJoined}</p>
                  </div>
                </div>

                <div className="modal-desc">
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#888', textTransform: 'uppercase' }}>Details</h4>
                  <p>{selectedItem.description}</p>
                  <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#999' }}>
                    Posted {selectedItem.postedAt}
                  </p>
                </div>

                <div className="action-buttons">
                  <button 
                    className="btn-msg"
                    onClick={() => handleMessageSeller(selectedItem.sellerName)}
                  >
                    <MessageCircle size={18} />
                    Message Seller
                  </button>
                  <button 
                    className="btn-share"
                    onClick={() => handleShare(selectedItem)}
                    title="Share Listing"
                  >
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SELL ITEM MODAL */}
        {isSellModalOpen && (
          <div className="modal-overlay" onClick={() => setIsSellModalOpen(false)}>
            <div className="sell-form-container" onClick={(e) => e.stopPropagation()}>
              <div className="form-header">
                <h2>List an Item</h2>
                <button onClick={() => setIsSellModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddListing}>
                <div className="form-field">
                  <label>Item Title</label>
                  <input 
                    type="text" 
                    className="form-ctrl" 
                    placeholder="What are you selling?"
                    value={newListing.title}
                    onChange={e => setNewListing({...newListing, title: e.target.value})}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-field">
                    <label>Price (₹)</label>
                    <input 
                      type="number" 
                      className="form-ctrl" 
                      placeholder="0"
                      value={newListing.price}
                      onChange={e => setNewListing({...newListing, price: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Category</label>
                    <select 
                      className="form-ctrl"
                      value={newListing.category}
                      onChange={e => setNewListing({...newListing, category: e.target.value})}
                    >
                      {CATEGORIES.filter(c => c !== "All").map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label>Campus Location</label>
                  <select 
                    className="form-ctrl"
                    value={newListing.location}
                    onChange={e => setNewListing({...newListing, location: e.target.value})}
                  >
                    <option value="Jaypee Sector 62 Campus">Jaypee Sector 62 Campus</option>
                    <option value="Jaypee Sector 128 Campus">Jaypee Sector 128 Campus</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Description</label>
                  <textarea 
                    className="form-ctrl form-area" 
                    placeholder="Describe condition, reason for selling, etc."
                    value={newListing.description}
                    onChange={e => setNewListing({...newListing, description: e.target.value})}
                    required
                  />
                </div>

                <button type="submit" className="btn-submit">
                  Post Listing
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}