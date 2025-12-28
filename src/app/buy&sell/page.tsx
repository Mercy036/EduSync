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
    image: "https://imgs.search.brave.com/rOoUqTZbgOhOK0YNyhWF_aVxLI6qgdyJ9d0Je618iZ8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9ydWtt/aW5pbTIuZmxpeGNh/cnQuY29tL2ltYWdl/LzQxNi80MTYveGlm/MHEvcmVnaW9uYWxi/b29rcy9rL3EvYy9l/bmdpbmVlcmluZy1t/YXRoZW1hdGljcy1m/b3Itc2VtZXN0ZXJz/LWktYW5kLWlpLW9s/ZC1ib29rLW9yaWdp/bmFsLWltYWd0ZjN5/OXI4YXBzMmIuanBl/Zz9xPTcwJmNyb3A9/ZmFsc2U", 
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
    image: "https://imgs.search.brave.com/EZ_o3BSXARm87FpCJWuOeKh9Cp121eeDKlqxQBawqpM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9ydWtt/aW5pbTIuZmxpeGNh/cnQuY29tL2ltYWdl/LzYxMi82MTIveGlm/MHEvY2FsY3VsYXRv/ci9hLzkvci9iYXR0/ZXJ5LW9wZXJhdGVk/LW11bHRpLWZ1bmN0/aW9uLXBvY2tldC1j/YWxjdWxhdG9yLXBv/cnRhYmxlLWJsYWNr/LW9yaWdpbmFsLWlt/YWhncXE1YmtmZnc4/aDguanBlZz9xPTcw",
    sellerName: "Priya Sharma",
    sellerId: "mock-seller-2",
    sellerJoined: "2022",
    createdAt: new Date().toISOString()
  },
  {
    _id: "mock-3",
    title: "Prestige Electric Kettle (1.5L)",
    price: 550,
    category: "Appliances",
    location: "Jaypee Sector 128 Campus",
    description: "Used for 6 months. Works perfectly. Great for making maggi/coffee in hostel. Cable included.",
    image: "https://imgs.search.brave.com/DYYzw1z_u9eq1BiNImvSLBQv-B0Kv6FGDZgAUYxbdqE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9TRUxMRVIvRGVm/YXVsdC8yMDI0Lzkv/NDUzMTEzODExL0FU/L0dTL09RLzg3NzE2/ODkzL3ByZXN0aWdl/LWVsZWN0cmljLWtl/dHRsZS01MDB4NTAw/LmpwZw",
    sellerName: "Karan Mehta",
    sellerId: "mock-seller-3",
    sellerJoined: "2023",
    createdAt: new Date().toISOString()
  },
  {
    _id: "mock-4",
    title: "Chemistry Lab Coat & Goggles",
    price: 250,
    category: "Clothing",
    location: "Jaypee Sector 62 Campus",
    description: "White lab coat size L. Includes safety goggles. Washed and ironed. No stains.",
    image: "https://imgs.search.brave.com/jcOl-bb-yM1EKDyC9IN8OCPAiNp2TzsPR6zke3G4PGU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjE5a2owSWo3Q0wu/anBn",
    sellerName: "Ananya Roy",
    sellerId: "mock-seller-4",
    sellerJoined: "2024",
    createdAt: new Date().toISOString()
  },
  {
    _id: "mock-5",
    title: "Yamaha F310 Acoustic Guitar",
    price: 4200,
    category: "Other",
    location: "Jaypee Sector 62 Campus",
    description: "Good condition, slight scratch on the back but doesn't affect sound. Strings replaced last week. Comes with bag.",
    image: "https://imgs.search.brave.com/uvKfTuwO7-3gi8jl3kSOvmR0TIE1FWrcwk6lW3molrs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/Z3VtdHJlZS5jb20v/ZVBSOFB5S2Y4NHdQ/SHg3X1JZbUVhZy9j/MDk2NGExZjk1ZTQ0/NjcyYmZfMTUxNjYx/YmYyMzYxLzg2",
    sellerName: "Dev Patel",
    sellerId: "mock-seller-5",
    sellerJoined: "2022",
    createdAt: new Date().toISOString()
  },
  {
    _id: "mock-6",
    title: "Comfy Bean Bag (XXL)",
    price: 900,
    category: "Other",
    location: "Jaypee Sector 128 Campus",
    description: "Black leatherette bean bag. Filled with beans. Super comfy for gaming or studying. Pickup only.",
    image: "https://imgs.search.brave.com/zp8FLwoiJIbH3o6DX-vSuizOupt2wgnCgYJydYc1y-k/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/YmlnYmVydGhhb3Jp/Z2luYWwuY29tL2Nk/bi9zaG9wL3Byb2R1/Y3RzL2xvdW5nZS1w/dWctaGlnaGJhY2st/Z2FtaW5nLWJlYW4t/YmFnLWNoYWlyLWNv/cmQtZ3JhcGhpdGUt/Z3JleS1iZWFuYmFn/LXVrX0xQSENCQkdS/XzAxXzY0MHg2NDBf/Y3JvcF9jZW50ZXIu/anBnP3Y9MTY0Njkx/MzgzOA",
    sellerName: "Sahil Khan",
    sellerId: "mock-seller-6",
    sellerJoined: "2021",
    createdAt: new Date().toISOString()
  },
  {
    _id: "mock-7",
    title: "Python Crash Course - 2nd Ed",
    price: 350,
    category: "Books",
    location: "Jaypee Sector 62 Campus",
    description: "Eric Matthes. Best book for beginners. Mint condition, no pen marks.",
    image: "https://imgs.search.brave.com/RfztyJzT86Gbi-1zYNtFWdQiQ8UBIRg0LU0ez6AHbjk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9ib29r/LXNoZWxmLnBrL2Nk/bi9zaG9wL2ZpbGVz/L3B5dGhvbi1jcmFz/aC1jb3Vyc2UtM3Jk/LWVkaXRpb24tYnkt/ZXJpYy1tYXR0aGVz/LWJvb2tzaGVsZnBr/LXBha2lzdGFuLTcy/MDY5NzguanBnP3Y9/MTc2MzA1OTU0OA",
    sellerName: "Ishita Verma",
    sellerId: "mock-seller-7",
    sellerJoined: "2024",
    createdAt: new Date().toISOString()
  }
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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<Listing | null>(null);
  

  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isSendingMsg, setIsSendingMsg] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); 

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

  const handleDeleteListing = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedItem) return;
    

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
        setSelectedItem(null); 
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      toast.error("Failed to delete listing");
    } finally {
      setIsDeleting(false);
    }
  };

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

        {isContactModalOpen && selectedItem && (
          <div className="modal-overlay" style={{ zIndex: 10002 }} onClick={() => setIsContactModalOpen(false)}>
            <div className="sell-form-container" style={{ maxWidth: '450px', height: 'auto', padding: '0' }} onClick={(e) => e.stopPropagation()}>

              <div className="form-header" style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', marginBottom: 0 }}>
                <h2 style={{ fontSize: '1.2rem' }}>Contact Seller</h2>
                <button onClick={() => setIsContactModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

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

        {isSellModalOpen && (
          <div className="modal-overlay" style={{ zIndex: 10000 }} onClick={() => setIsSellModalOpen(false)}>
            <div className="sell-form-container" onClick={(e) => e.stopPropagation()}>
              <div className="form-header">
                <h2>List an Item</h2>
                <button onClick={() => setIsSellModalOpen(false)} className="close-modal-btn" style={{ position: 'static' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleAddListing}>

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