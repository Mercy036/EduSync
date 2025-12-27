"use client";

import { useState, useRef } from "react";
import AuthGuard from "@/src/components/AuthGuard";
import { 
  Search, 
  Plus, 
  MapPin, 
  X, 
  Share2, 
  MessageCircle, 
  Tag,
  ImageIcon,
  Trash2
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

// --- Reliable Image Links (Unsplash) ---
const SAMPLE_LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Engineering Mathematics - H.K. Dass",
    price: 450,
    category: "Books",
    location: "Jaypee Sector 62 Campus",
    description: "Slightly used copy. No highlighting. Must have for 1st years.",
    image: "https://imgs.search.brave.com/nKu_MHDhn9PO_ZM1ERTkeuHHhpmgQrIvuxzfuLZP3DA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMtbmEuc3NsLWlt/YWdlcy1hbWF6b24u/Y29tL2ltYWdlcy9J/LzYxWEM2cWRSLUtM/LmpwZw", 
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
    description: "Original Casio calculator. Solar panel working perfectly.",
    image: "https://imgs.search.brave.com/_w2Y5MHYXtgFeB40Ee9jScOHPabopVxP9dRzzlGaaqs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/Y3JlYXRlLnZpc3Rh/LmNvbS9hcGkvbWVk/aWEvc21hbGwvNTIz/NzA5OTI2L3N0b2Nr/LXBob3RvLXNjaWVu/dGlmaWMtY2FsY3Vs/YXRvci10ZXh0dXJl/ZC1iYWNrZ3JvdW5k/LXN0b2NrLWltYWdl",
    sellerName: "Priya Sharma",
    sellerJoined: "2022",
    postedAt: "5 hours ago"
  },
  {
    id: "3",
    title: "Mini Table Fan",
    price: 600,
    category: "Appliances",
    location: "Jaypee Sector 62 Campus",
    description: "Compact size, fits on study table. Lifesaver for summer.",
    image: "https://images.unsplash.com/photo-1618941716939-553dfdfc674d?auto=format&fit=crop&q=80&w=800",
    sellerName: "Rohan Gupta",
    sellerJoined: "2021",
    postedAt: "1 day ago"
  },
  {
    id: "5",
    title: "Road Bike (Triban RC100)",
    price: 12000,
    category: "Vehicles",
    location: "Jaypee Sector 128 Campus",
    description: "Excellent condition. Great for commuting between gates.",
    image: "https://images.unsplash.com/photo-1485965120184-e224f7a1db69?auto=format&fit=crop&q=80&w=800",
    sellerName: "Vikram Malhotra",
    sellerJoined: "2022",
    postedAt: "3 days ago"
  },
  {
    id: "6",
    title: "Sony Noise Cancelling Headphones",
    price: 4500,
    category: "Electronics",
    location: "Jaypee Sector 62 Campus",
    description: "WH-CH710N. 30hr battery life. Barely used.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
    sellerName: "Sneha Reddy",
    sellerJoined: "2023",
    postedAt: "Just now"
  }
];

const CATEGORIES = ["All", "Books", "Electronics", "Appliances", "Stationery", "Vehicles", "Clothing", "Other"];

export default function CampusMarketplacePage() {
  const [listings, setListings] = useState<Listing[]>(SAMPLE_LISTINGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<Listing | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  // Form State
  const [newListing, setNewListing] = useState({
    title: "",
    price: "",
    category: "Books",
    description: "",
    location: "Jaypee Sector 62 Campus"
  });
  
  // Image Upload State
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredListings = listings.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleShare = (item: Listing) => {
    alert("Link copied!");
  };

  const handleMessageSeller = (sellerName: string) => {
    alert(`Chat opened with ${sellerName}`);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddListing = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage = imagePreviewUrl || "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800"; // Generic placeholder

    const item: Listing = {
      id: Math.random().toString(36).substr(2, 9),
      title: newListing.title,
      price: parseInt(newListing.price) || 0,
      category: newListing.category,
      location: newListing.location as any,
      description: newListing.description,
      image: finalImage, 
      sellerName: "You",
      sellerJoined: "2024",
      postedAt: "Just now"
    };

    setListings([item, ...listings]);
    setIsSellModalOpen(false);
    setNewListing({ title: "", price: "", category: "Books", description: "", location: "Jaypee Sector 62 Campus" });
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
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
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn-sell" onClick={() => setIsSellModalOpen(true)}>
              <Plus size={20} />
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
                  <div className="price-tag">₹{item.price.toLocaleString()}</div>
                  <div className="item-name">{item.title}</div>
                  <div className="item-location">
                    <MapPin size={12} />
                    {item.location.replace("Jaypee ", "")}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem", color: "#999" }}>
              <p>No items found.</p>
            </div>
          )}
        </div>

        {/* DETAIL MODAL */}
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
                  <h4>Description</h4>
                  <p>{selectedItem.description}</p>
                  <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#ccc' }}>
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
                  >
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SELL MODAL */}
        {isSellModalOpen && (
          <div className="modal-overlay" onClick={() => setIsSellModalOpen(false)}>
            <div className="sell-form-container" onClick={(e) => e.stopPropagation()}>
              <div className="form-header">
                <h2>List an Item</h2>
                <button 
                  onClick={() => setIsSellModalOpen(false)} 
                  className="close-modal-btn" 
                  style={{ position: 'static' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddListing}>
                {/* Image Upload */}
                <div 
                  className="upload-area" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreviewUrl ? (
                    <>
                      <img src={imagePreviewUrl} alt="Preview" className="preview-img" />
                      <button 
                        type="button"
                        className="remove-img-btn" 
                        onClick={handleRemoveImage}
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="upload-icon-wrapper">
                        <ImageIcon size={24} />
                      </div>
                      <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600 }}>
                        Click to upload photo
                      </span>
                    </>
                  )}
                  <input 
                    type="file" 
                    hidden 
                    ref={fileInputRef} 
                    accept="image/*"
                    onChange={handleImageSelect}
                  />
                </div>

                <div className="form-field">
                  <label>Item Title</label>
                  <input 
                    type="text" 
                    className="form-ctrl" 
                    placeholder="E.g. Engineering Physics Book"
                    value={newListing.title}
                    onChange={e => setNewListing({...newListing, title: e.target.value})}
                    required
                  />
                </div>

                <div className="form-grid-2">
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
                    placeholder="Describe condition, reason for selling..."
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