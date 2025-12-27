"use client";
import { useState } from "react";
import "./essential.css";
type TabType = "Library" | "Buy & Sell" | "Print Out";

export default function CampusEssentials() {
    const [activeTab, setActiveTab] = useState<TabType>("Library");
    const [searchQuery, setSearchQuery] = useState("");

    const tabContent: Record<TabType, { title: string; desc: string; action: string; placeholder: string }> = {
        "Library": { 
            title: "Book Finder", 
            desc: "Don't walk all the way to the basement. Check if the book is actually on the shelf first.", 
            action: "Reserve Book",
            placeholder: "Search book title or author..." 
        },
        "Buy & Sell": { 
            title: "The Stash", 
            desc: "Pass on your old textbooks or grab a cheap lab coat from seniors who are finally graduating.", 
            action: "Post Ad",
            placeholder: "What are you looking for?"
        },
        "Print Out": { 
            title: "Ink & Paper", 
            desc: "Upload lab reports and pick them up at any kiosk. No more fighting for the USB port.", 
            action: "Upload PDF",
            placeholder: "Search recent prints..." 
        }
    };

    return (
        <section className="ce-page-container">
            <header className="ce-header">
                <h1>Campus<span>Essentials</span></h1>
                <p>Built by students, for the students who actually show up.</p>
            </header>

            <nav className="ce-tab-bar">
                {(Object.keys(tabContent) as TabType[]).map((tab) => (
                    <button
                        key={tab}
                        className={`ce-tab-btn ${activeTab === tab ? "is-active" : ""}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </nav>

            <div className="ce-bento-layout">
                <div className="ce-card ce-main-portal">
                    <span className="ce-badge">Live Portal</span>
                    <h3>{tabContent[activeTab].title}</h3>
                    <p>{tabContent[activeTab].desc}</p>
                    
                    <div className="ce-input-group">
                        <input 
                            type="text" 
                            className="ce-search-bar" 
                            placeholder={tabContent[activeTab].placeholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="ce-submit-btn">{tabContent[activeTab].action}</button>
                    </div>

                    <div className="ce-board">
                        <h4>Student Board</h4>
                        <ul className="ce-feed">
                            <li>"Found a lost ID card in Library Wing A" — Rahul, 2nd Year</li>
                            <li>"Selling Engineering Physics Vol 1" — Sneha, 4th Year</li>
                            <li>"Who has the digital copy of the Microprocessors manual?" — Arul</li>
                        </ul>
                    </div>
                </div>
                <div className="ce-card ce-status-card">
                    <h4>System Health</h4>
                    <div className="ce-stat-box">
                        <div className="ce-stat">
                            <strong>85%</strong>
                            <span>Availability</span>
                        </div>
                        <div className="ce-stat">
                            <strong>12m</strong>
                            <span>Wait Time</span>
                        </div>
                        <div className="ce-stat">
                            <strong className="ce-online">Active</strong>
                            <span>System Status</span>
                        </div>
                    </div>
                </div>
                <div className="ce-card ce-tip-card">
                    <h4 className="ce-gold-text">Pro-Tip</h4>
                    <p>
                        {activeTab === "Library" && "The 3rd-floor wing has the fastest Wi-Fi and quietest desks."}
                        {activeTab === "Buy & Sell" && "Sell your notes now. Prices peak right before mid-sems."}
                        {activeTab === "Print Out" && "Use the Block B printer; it rarely jams."}
                    </p>
                </div>
                <div className="ce-card ce-help-card">
                    <h4>Need Help?</h4>
                    <p>Ping the student coordinator for urgent issues.</p>
                </div>
            </div>

            <footer className="ce-footer">
                <p>EduSync // For the hustle.</p>
            </footer>
        </section>
    );
}