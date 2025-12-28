"use client";

import { useState, useRef } from "react";
import "./essential.css";
import AuthGuard from "@/src/components/AuthGuard";
import { Search, MapPin, BookOpen, Printer, Clock, AlertCircle, FileText, X, CheckCircle, UploadCloud } from "lucide-react";
import { toast } from "react-toastify";

// Types
type TabType = "Library" | "Print Out";

interface Book {
    id: string;
    title: string;
    author: string;
    category: string;
    status: "Available" | "Issued";
    location: string;
}

interface PrintJob {
    id: string;
    name: string;
    size: string;
    status: "queued" | "processing" | "completed";
}

// Mock Data for the Library
const MOCK_BOOKS: Book[] = [
    { id: "1", title: "Introduction to Algorithms", author: "Cormen", category: "CSE", status: "Available", location: "Row 4, Shelf B" },
    { id: "2", title: "Digital Design", author: "Morris Mano", category: "ECE", status: "Issued", location: "Row 2, Shelf A" },
    { id: "3", title: "Engineering Physics", author: "H.K. Dass", category: "Physics", status: "Available", location: "Row 1, Shelf D" },
    { id: "4", title: "Clean Code", author: "Robert Martin", category: "CSE", status: "Available", location: "Row 4, Shelf C" },
    { id: "5", title: "Microprocessors & Interfacing", author: "Douglas Hall", category: "ECE", status: "Available", location: "Row 2, Shelf B" },
    { id: "6", title: "Organic Chemistry", author: "Morrison & Boyd", category: "Biotech", status: "Issued", location: "Row 6, Shelf A" },
    { id: "7", title: "Data Structures Using C", author: "Reema Thareja", category: "CSE", status: "Available", location: "Row 4, Shelf A" },
    { id: "8", title: "Signals and Systems", author: "Oppenheim", category: "ECE", status: "Available", location: "Row 3, Shelf E" },
];

export default function CampusEssentials() {
    const [activeTab, setActiveTab] = useState<TabType>("Library");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("All");

    // Print State
    const [printQueue, setPrintQueue] = useState<PrintJob[]>([]);
    const [isPrinting, setIsPrinting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Filter Logic
    const filteredBooks = MOCK_BOOKS.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              book.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = selectedFilter === "All" || book.category === selectedFilter;
        return matchesSearch && matchesFilter;
    });

    // --- Print Logic ---
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles: PrintJob[] = Array.from(e.target.files).map(file => ({
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                size: (file.size / 1024 / 1024).toFixed(2) + " MB",
                status: "queued"
            }));
            setPrintQueue([...printQueue, ...newFiles]);
            toast.success("Added to print queue!");
        }
    };

    const removeFile = (id: string) => {
        setPrintQueue(printQueue.filter(job => job.id !== id));
    };

    const handlePrintCommand = () => {
        if (printQueue.length === 0) return;
        
        setIsPrinting(true);
        
        // Simulate printing process
        setTimeout(() => {
            setPrintQueue(prev => prev.map(job => ({ ...job, status: "completed" })));
            setIsPrinting(false);
            toast.success("Documents sent to Block B Printer! 🖨️");
        }, 2000);
    };

    return (
        <AuthGuard>
            <section className="ce-page-container">
                {/* Header */}
                <header className="ce-header">
                    <h1>Campus<span>Essentials</span></h1>
                    <p>Library resources and printing services at your fingertips.</p>
                </header>

                {/* Tabs */}
                <nav className="ce-tab-bar">
                    <button 
                        className={`ce-tab-btn ${activeTab === "Library" ? "is-active" : ""}`}
                        onClick={() => setActiveTab("Library")}
                    >
                        <BookOpen size={18} /> Library Search
                    </button>
                    <button 
                        className={`ce-tab-btn ${activeTab === "Print Out" ? "is-active" : ""}`}
                        onClick={() => setActiveTab("Print Out")}
                    >
                        <Printer size={18} /> PrintOut
                    </button>
                </nav>

                <div className="ce-bento-layout">
                    
                    <div className="ce-card ce-main-portal">
                        {activeTab === "Library" ? (
                            <>
                                <span className="ce-badge">Live Catalog</span>
                                <h3>Book Finder</h3>
                                <p>Locate books instantly. Check availability before you walk to the LRC.</p>
                                
                                <div className="ce-input-group">
                                    <input 
                                        type="text" 
                                        className="ce-search-bar" 
                                        placeholder="Search by title, author..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button className="ce-submit-btn">
                                        <Search size={20} />
                                    </button>
                                </div>

                                {/* Filters */}
                                <div className="lib-filters">
                                    {["All", "CSE", "ECE", "Physics", "Biotech"].map(cat => (
                                        <button 
                                            key={cat}
                                            className={`lib-chip ${selectedFilter === cat ? "active" : ""}`}
                                            onClick={() => setSelectedFilter(cat)}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                {/* Book List */}
                                <div className="lib-book-list">
                                    {filteredBooks.length > 0 ? (
                                        filteredBooks.map(book => (
                                            <div key={book.id} className="lib-book-item">
                                                <div className="lib-book-info">
                                                    <h4>{book.title}</h4>
                                                    <span>by {book.author}</span>
                                                </div>
                                                <div className="lib-book-meta">
                                                    <span className={`lib-status ${book.status.toLowerCase()}`}>
                                                        {book.status}
                                                    </span>
                                                    <span className="lib-location">
                                                        <MapPin size={12} style={{marginRight:4}} />
                                                        {book.location}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{textAlign:'center', marginTop:'3rem', color: '#999'}}>
                                            <AlertCircle size={40} style={{marginBottom: '10px', opacity: 0.5}} />
                                            <p>No books found matching "{searchQuery}"</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            // --- PRINT OUT SECTION ---
                            <>
                                <span className="ce-badge">Smart Printing</span>
                                <h3>Upload & Print</h3>
                                <p>Queue your documents here and pick them up at the Stationery Shop.</p>
                                
                                <div className="print-workspace">
                                    {/* Upload Area */}
                                    <div 
                                        className="print-upload-zone"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <UploadCloud size={48} className="print-icon" />
                                        <span className="print-cta">Click to upload documents</span>
                                        <span className="print-sub">Supports PDF, DOCX (Max 10MB)</span>
                                        <input 
                                            type="file" 
                                            hidden 
                                            ref={fileInputRef} 
                                            multiple 
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileSelect}
                                        />
                                    </div>

                                    {/* Queue List */}
                                    {printQueue.length > 0 && (
                                        <div className="print-queue">
                                            <h4>Print Queue ({printQueue.length})</h4>
                                            <div className="queue-list">
                                                {printQueue.map(job => (
                                                    <div key={job.id} className={`queue-item ${job.status}`}>
                                                        <div className="queue-info">
                                                            <FileText size={20} />
                                                            <div>
                                                                <span className="file-name">{job.name}</span>
                                                                <span className="file-size">{job.size}</span>
                                                            </div>
                                                        </div>
                                                        {job.status === "completed" ? (
                                                            <span className="status-success"><CheckCircle size={18} /> Sent</span>
                                                        ) : (
                                                            <button 
                                                                className="remove-queue-btn" 
                                                                onClick={() => removeFile(job.id)}
                                                                disabled={isPrinting}
                                                            >
                                                                <X size={18} />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <button 
                                                className="print-action-btn"
                                                onClick={handlePrintCommand}
                                                disabled={isPrinting || printQueue.every(j => j.status === 'completed')}
                                            >
                                                {isPrinting ? "Processing..." : "Send to Printer (Block B)"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Stats & Tips */}
                    <div className="ce-sidebar-col">
                        
                        {/* Account Status */}
                        <div className="ce-card ce-stat-card">
                            <h4>My Account</h4>
                            <div className="stat-row">
                                <span className="stat-label">Library Books</span>
                                <span className="stat-val">2 / 4</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-label">Pending Fines</span>
                                <span className="stat-val">₹0</span>
                            </div>
                        </div>

                        {/* Quick Tips */}
                        <div className="ce-card ce-tip-card">
                            <h4 className="ce-gold-text">Pro-Tip</h4>
                            <p style={{fontSize: '0.9rem', color: '#555', marginTop: '0.5rem'}}>
                                {activeTab === "Library" 
                                    ? "The 3rd-floor quiet zone has the strongest Wi-Fi signal. Avoid Row 6 during lunch hours."
                                    : "Use the Block B printer for color prints; it rarely jams and has better paper quality."}
                            </p>
                        </div>

                        {/* Info Card */}
                        <div className="ce-card ce-help-card" style={{ background: '#f9f9f9', border: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <Clock size={24} color="#666" />
                                <div>
                                    <h4 style={{margin:0, fontSize:'1rem'}}>Closing Time</h4>
                                    <p style={{margin:'4px 0 0 0', fontSize:'0.85rem'}}>
                                        Services open until <strong>9:00 PM</strong> today.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <footer className="ce-footer">
                    <p>EduSync Essentials // Making campus life slightly less chaotic.</p>
                </footer>
            </section>
        </AuthGuard>
    );
}