"use client";
import { useState } from "react";
import "./help.css";
import { Upload, AlertTriangle, CheckCircle, Clock, MapPin, Camera } from "lucide-react";
import { toast } from "react-toastify"; // Assumes you have ToastContainer in layout

type StatusType = "Pending" | "In Progress" | "Resolved";

interface Issue {
    id: number;
    title: string;
    location: string;
    image: string;
    status: StatusType;
    date: string;
}

const MOCK_ISSUES: Issue[] = [
    { id: 1, title: "Broken AC Unit", location: "Library Floor 3", image: "https://imgs.search.brave.com/OPYiP1O9TmID3QWjDwvBeY41v3oA4fXKJParCZ5kdYo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93Zy5z/Y2VuZTcuY29tL2lz/L2ltYWdlL3dyZW5j/aGdyb3VwL2NvbW1v/bi1zaWducy13aXRo/LWJyb2tlbi1hYy11/bml0cy1hYjIyd2kw/MDF3Zz8kV3JlbmNo/X05ldyQ", status: "In Progress", date: "2 hrs ago" },
    { id: 2, title: "Water Leakage", location: "Canteen Washroom", image: "https://imgs.search.brave.com/q7Mtvvyu5_cIRo4QHkxXibu6vryx4II84qgUf64kFCw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi93YXRl/ci1sZWFrYWdlLWNy/YWNrLXRhbmstaW5z/dGFsbGVkLWhvdXNl/LXJvb2Z0b3AtMTYx/MDU4NjM5LmpwZw", status: "Pending", date: "5 hrs ago" },
    { id: 3, title: "Projector Malfunction", location: "Lecture Hall-254", image: "https://imgs.search.brave.com/TvU9FBx7bMBKQ1hJsDfjjDbdNy0AoHMOXwRf7zfhR1o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9iLnRo/dW1icy5yZWRkaXRt/ZWRpYS5jb20vajlw/aTh3cmV4LVllbm1m/RW95TGVrV0ljZEVv/ak5VZ0o2ejNEdjNH/enBYcy5qcGc", status: "Resolved", date: "1 day ago" },
];

export default function HelpPage() {
    const [issues, setIssues] = useState<Issue[]>(MOCK_ISSUES);
    const [preview, setPreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({ title: "", location: "", desc: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle Image Upload Preview
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
        }
    };

    // Handle Form Submit
    const handleSubmit = () => {
        if (!formData.title || !formData.location || !preview) {
            toast.error("Please fill all fields and upload a photo.");
            return;
        }

        setIsSubmitting(true);

        // Simulate Network Delay
        setTimeout(() => {
            const newIssue: Issue = {
                id: Date.now(),
                title: formData.title,
                location: formData.location,
                image: preview, // Using local preview URL for demo
                status: "Pending",
                date: "Just now"
            };

            setIssues([newIssue, ...issues]);
            setFormData({ title: "", location: "", desc: "" });
            setPreview(null);
            setIsSubmitting(false);
            toast.success("Issue Reported Successfully! 🛠️");
        }, 1000);
    };

    return (
        <section className="help-container">
            <header className="help-header">
                <h1>Help & <span>Support</span></h1>
                <p>Spot an issue? Snap a picture and we'll fix it.</p>
            </header>

            <div className="help-grid-layout">
                
                {/* === LEFT: REPORT FORM === */}
                <div className="help-card help-form-card">
                    <div className="card-header">
                        <Camera className="icon-gold" size={24} />
                        <h3>Report an Issue</h3>
                    </div>
                    
                    <div className="form-group">
                        <label>What's broken?</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Broken Table, AC Leak..." 
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <div className="input-with-icon">
                            <MapPin size={16} />
                            <input 
                                type="text" 
                                placeholder="e.g. Lab 3, 2nd Floor" 
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Photo Evidence</label>
                        <div className={`image-upload-box ${preview ? 'has-image' : ''}`}>
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                            {preview ? (
                                <img src={preview} alt="Preview" className="preview-img" />
                            ) : (
                                <div className="upload-placeholder">
                                    <Upload size={24} />
                                    <span>Click to Upload Image</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <button 
                        className="submit-btn" 
                        onClick={handleSubmit} 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Report"}
                    </button>
                </div>

                {/* === RIGHT: INFO & STATS === */}
                <div className="help-sidebar">
                    {/* Status Card */}
                    <div className="help-card status-card">
                        <h4>Maintenance Crew</h4>
                        <div className="status-row">
                            <div className="status-dot active"></div>
                            <span>Online & Active</span>
                        </div>
                        <p className="status-note">Avg. response time: <strong>24 hrs</strong></p>
                    </div>

                    {/* Emergency Card */}
                    <div className="help-card emergency-card">
                        <h4>Urgent?</h4>
                        <p>For fire or electrical hazards, call immediately.</p>
                        <button className="call-btn">
                            <AlertTriangle size={16} /> Call Security
                        </button>
                    </div>
                </div>

                {/* === BOTTOM: ISSUE GALLERY === */}
                <div className="help-gallery-section">
                    <h3>Recent Reports</h3>
                    <div className="gallery-grid">
                        {issues.map((issue) => (
                            <div key={issue.id} className="issue-card">
                                <div className="issue-img-container">
                                    <img src={issue.image} alt={issue.title} />
                                    <span className={`status-badge ${issue.status.toLowerCase().replace(" ", "-")}`}>
                                        {issue.status}
                                    </span>
                                </div>
                                <div className="issue-content">
                                    <h4>{issue.title}</h4>
                                    <div className="issue-meta">
                                        <span><MapPin size={12}/> {issue.location}</span>
                                        <span><Clock size={12}/> {issue.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}