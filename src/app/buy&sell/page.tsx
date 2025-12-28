"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation"; 
import AuthGuard from "@/src/components/AuthGuard";
import { auth } from "@/src/lib/firebase"; 
import { toast } from "react-toastify";
import { 
  Search, 
  Plus, 
  MapPin, 
  X, 
  Share2, 
  MessageCircle, 
  Tag,
  ImageIcon,
  Trash2,
  Loader2,
  Send,
  AlertCircle
} from "lucide-react";
import "./marketplace.css";

interface Listing {
  _id: string;
  title: string;
  price: number;
  category: string;
  location: string;
  description: string;
  image: string;
  sellerName: string;
  sellerId: string;
  sellerJoined: string;
  createdAt: string;
}

const CATEGORIES = ["All", "Books", "Electronics", "Appliances", "Stationery", "Vehicles", "Clothing", "Other"];

// Mock Data
const SAMPLE_LISTINGS: Listing[] = [
  {
    _id: "mock-1",
    title: "Engineering Mathematics - H.K. Dass",
    price: 450,
    category: "Books",
    location: "Jaypee Sector 62 Campus",
    description: "Slightly used copy. No highlighting. Must have for 1st years. Price negotiable.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800", 
    sellerName: "Aarav Singh",
    sellerId: "mock-seller-1",
    sellerJoined: "2023",
    createdAt: new Date().toISOString()
  },
  {
    _id: "mock-2",
    title: "Scientific Calculator fx-991ES Plus",
    price: 800,
    category: "Electronics",
    location: "Jaypee Sector 128 Campus",
    description: "Original Casio calculator. Solar panel working perfectly. Cover included.",
    image: "https://images.unsplash.com/photo-1587145820266-a5951ee1f620?auto=format&fit=crop&q=80&w=800",
    sellerName: "Priya Sharma",
    sellerId: "mock-seller-2",
    sellerJoined: "2022",
    createdAt: new Date().toISOString()
  },
  // ... (keep your other mocks if desired)
];

const SUGGESTED_MESSAGES = [
  "Hi, is this still available?",
  "Is the price negotiable?",
  "Can I see it in person tomorrow?",
  "What is the condition like?"
];

export default function CampusMarketplacePage() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>(SAMPLE_LISTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<Listing | null>(null);
  
  // Modals
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isSendingMsg, setIsSendingMsg] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // New delete state

  // New Listing Form
  const [newListing, setNewListing] = useState({
    title: "",
    price: "",
    category: "Books",
    description: "",
    location: "Jaypee Sector 62 Campus"
  });
  
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Init ---
  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    const itemId = searchParams.get("item");
    if (itemId && listings.length > 0) {
      const item = listings.find(l => l._id === itemId);
      if (item) setSelectedItem(item);
    }
  }, [searchParams, listings]);

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/marketplace");
      if (res.ok) {
        const dbData = await res.json();
        setListings([...dbData, ...SAMPLE_LISTINGS]);
      } else {
        setListings(SAMPLE_LISTINGS);
      }
    } catch (error) {
      console.error("Fetch error", error);
      setListings(SAMPLE_LISTINGS);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Delete Functionality ---
  const handleDeleteListing = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedItem) return;
    
    // Check if it's a mock item
    if (selectedItem._id.startsWith("mock-")) {
      toast.error("Cannot delete demo items.");
      return;
    }

    if (!confirm("Are you sure you want to delete this listing?")) return;

    setIsDeleting(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/marketplace", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id: selectedItem._id })
      });

      if (res.ok) {
        toast.success("Listing deleted successfully");
        setListings(prev => prev.filter(l => l._id !== selectedItem._id));
        setSelectedItem(null); // Close modal
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      toast.error("Failed to delete listing");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- Messaging ---
  const handleOpenContact = () => {
    if (!auth.currentUser) {
      toast.error("Please login to message");
      return;
    }
    if (auth.currentUser.uid === selectedItem?.sellerId) {
      toast.info("This is your listing!");
      return;
    }
    setIsContactModalOpen(true);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedItem) return;
    setIsSendingMsg(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: selectedItem.sellerId,
          listingId: selectedItem._id,
          content: messageText
        })
      });

      if (res.ok) {
        toast.success(`Message sent to ${selectedItem.sellerName}!`);
        setIsContactModalOpen(false);
        setMessageText("");
      } else {
        throw new Error("Failed");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to send message");
    } finally {
      setIsSendingMsg(false);
    }
  };

  // --- Form Handlers (Add Listing) ---
  const handleAddListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImageFile) return toast.warn("Image required");
    if (!auth.currentUser) return toast.error("Login required");

    setIsSubmitting(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const formData = new FormData();
      Object.entries(newListing).forEach(([k, v]) => formData.append(k, v));
      formData.append("image", selectedImageFile);

      const res = await fetch("/api/marketplace", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) throw new Error("Failed");
      
      const newItem = await res.json();
      setListings([newItem, ...listings]);
      setIsSellModalOpen(false);
      setNewListing({ title: "", price: "", category: "Books", description: "", location: "Jaypee Sector 62 Campus" });
      setSelectedImageFile(null);
      setImagePreviewUrl(null);
      toast.success("Item posted!");
    } catch (e) {
      toast.error("Failed to post");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helpers
  const handleShare = (item: Listing) => {
    const url = `${window.location.origin}/campus-marketplace?item=${item._id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const filteredListings = listings.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AuthGuard>
      <div className="marketplace-container">
        {/* Header */}
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
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn-sell" onClick={() => setIsSellModalOpen(true)}>
              <Plus size={20} /> Sell Item
            </button>
          </div>
        </header>

        {/* Categories */}
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

        {/* Grid */}
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <Loader2 className="spinner" size={40} />
          </div>
        ) : (
          <div className="items-grid">
            {filteredListings.length > 0 ? filteredListings.map(item => (
              <div key={item._id} className="item-card" onClick={() => setSelectedItem(item)}>
                <div className="item-image-box">
                  <img src={item.image} alt={item.title} className="item-img" />
                </div>
                <div className="item-info">
                  <div className="price-tag">₹{item.price.toLocaleString()}</div>
                  <div className="item-name">{item.title}</div>
                  <div className="item-location"><MapPin size={12} /> {item.location}</div>
                </div>
              </div>
            )) : (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem", color: "#999" }}>
                <Tag size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p>No items found.</p>
              </div>
            )}
          </div>
        )}

        {/* DETAIL POPUP */}
        {selectedItem && (
          <div className="modal-overlay" style={{ zIndex: 10000 }} onClick={() => setSelectedItem(null)}>
            <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal-btn" onClick={() => setSelectedItem(null)}><X size={20} /></button>
              
              <div className="modal-left">
                <img src={selectedItem.image} alt={selectedItem.title} className="modal-img-full" />
              </div>

              <div className="modal-right">
                <h2 className="modal-title">{selectedItem.title}</h2>
                <div className="modal-price-large">₹{selectedItem.price.toLocaleString()}</div>
                
                <div className="modal-tags">
                  <div className="tag-pill"><Tag size={14} /> {selectedItem.category}</div>
                  <div className="tag-pill"><MapPin size={14} /> {selectedItem.location}</div>
                </div>

                <div className="seller-row">
                  <div className="seller-pic">{selectedItem.sellerName.charAt(0)}</div>
                  <div className="seller-text">
                    <h4>{selectedItem.sellerName}</h4>
                    <p>Joined {selectedItem.sellerJoined}</p>
                  </div>
                </div>

                <div className="modal-desc">
                  <h4>Description</h4>
                  <p>{selectedItem.description}</p>
                </div>

                <div className="action-buttons">
                  {/* Delete Button (Only for Owner) */}
                  {auth.currentUser?.uid === selectedItem.sellerId ? (
                    <button 
                      className="btn-delete" 
                      onClick={handleDeleteListing}
                      disabled={isDeleting}
                    >
                      {isDeleting ? <Loader2 size={18} className="spinner"/> : <><Trash2 size={18}/> Delete</>}
                    </button>
                  ) : (
                    <button className="btn-msg" onClick={handleOpenContact}>
                      <MessageCircle size={18} /> Message Seller
                    </button>
                  )}
                  
                  <button className="btn-share" onClick={() => handleShare(selectedItem)}>
                    <Share2 size={18} /> Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BETTER CHAT MODAL */}
        {isContactModalOpen && selectedItem && (
          <div className="modal-overlay" style={{ zIndex: 10002 }} onClick={() => setIsContactModalOpen(false)}>
            <div className="sell-form-container" style={{ maxWidth: '450px', height: 'auto', padding: '0' }} onClick={(e) => e.stopPropagation()}>
              
              {/* Header */}
              <div className="form-header" style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', marginBottom: 0 }}>
                <h2 style={{ fontSize: '1.2rem' }}>Contact Seller</h2>
                <button onClick={() => setIsContactModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              {/* Chat Content */}
              <div style={{ padding: '24px' }}>
                <div className="chat-header-user">
                  <div className="chat-avatar">
                    {selectedItem.sellerName.charAt(0)}
                  </div>
                  <div className="chat-user-details">
                    <h3>{selectedItem.sellerName}</h3>
                    <span>Replying to: <b>{selectedItem.title}</b></span>
                  </div>
                </div>

                <div className="chat-suggestions">
                  {SUGGESTED_MESSAGES.map((msg, i) => (
                    <button key={i} className="suggestion-chip" onClick={() => setMessageText(msg)}>
                      {msg}
                    </button>
                  ))}
                </div>

                <textarea 
                  className="chat-textarea" 
                  placeholder="Write your message..."
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  autoFocus
                />

                <div className="chat-footer">
                  <button 
                    className="btn-send-large" 
                    onClick={handleSendMessage} 
                    disabled={isSendingMsg || !messageText.trim()}
                  >
                    {isSendingMsg ? <Loader2 size={18} className="spinner"/> : <><Send size={18} /> Send Message</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sell Modal (Same as before) */}
        {isSellModalOpen && (
          <div className="modal-overlay" style={{ zIndex: 10000 }} onClick={() => setIsSellModalOpen(false)}>
            <div className="sell-form-container" onClick={(e) => e.stopPropagation()}>
              <div className="form-header">
                <h2>List an Item</h2>
                <button onClick={() => setIsSellModalOpen(false)} className="close-modal-btn" style={{ position: 'static' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleAddListing}>
                {/* Upload Area */}
                <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
                  {imagePreviewUrl ? (
                    <>
                      <img src={imagePreviewUrl} className="preview-img" />
                      <button type="button" className="remove-img-btn" onClick={(e) => { e.stopPropagation(); setSelectedImageFile(null); setImagePreviewUrl(null); }}>
                        <Trash2 size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="upload-icon-wrapper"><ImageIcon size={24} /></div>
                      <span>Upload Photo</span>
                    </>
                  )}
                  <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleImageSelect} />
                </div>

                <div className="form-field">
                  <label>Title</label>
                  <input type="text" className="form-ctrl" value={newListing.title} onChange={e => setNewListing({...newListing, title: e.target.value})} required />
                </div>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Price</label>
                    <input type="number" className="form-ctrl" value={newListing.price} onChange={e => setNewListing({...newListing, price: e.target.value})} required />
                  </div>
                  <div className="form-field">
                    <label>Category</label>
                    <select className="form-ctrl" value={newListing.category} onChange={e => setNewListing({...newListing, category: e.target.value})}>
                      {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label>Location</label>
                  <select className="form-ctrl" value={newListing.location} onChange={e => setNewListing({...newListing, location: e.target.value})}>
                    <option value="Jaypee Sector 62 Campus">Jaypee Sector 62 Campus</option>
                    <option value="Jaypee Sector 128 Campus">Jaypee Sector 128 Campus</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Description</label>
                  <textarea className="form-ctrl form-area" value={newListing.description} onChange={e => setNewListing({...newListing, description: e.target.value})} required />
                </div>

                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? "Posting..." : "Post Listing"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}