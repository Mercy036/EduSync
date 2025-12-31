"use client"
import "./HomePage.css";
import { useEffect, useState } from "react";
import {
    ArrowRight,
    CheckCircle,
    LayoutDashboard,
    CalendarRange,
    Library,
    Coffee,
    ShoppingBag,
    BellRing,
    Sparkles,
    XCircle,
    BookOpenText,
    FolderHeart,
    Car,
    Zap
} from "lucide-react";
import TopBar from "@/src/components/TopBar";

export default function HomePage() {
    const [fade, setFade] = useState(false);
    useEffect(() => {
        const timeout = setTimeout(() => setFade(true), 50);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <>
        <TopBar />
            <section className="hero">
                <div className={`hero-badge fade-up${fade ? ' visible' : ''}`}>
                    <Sparkles size={14} style={{marginRight: '8px'}} />
                    Powered by Google Gemini AI
                </div>
                <div className={`hero-title fade-up${fade ? ' visible' : ''}`}>
                    The Smart OS for <br /> Modern Campus Life
                </div>
                <p className={`hero-subtext fade-up${fade ? ' visible' : ''}`}>
                    EduSync isn't just an app—it's a high-impact ecosystem. We bridge the gap between academic 
                    success and campus logistics through AI-automated scheduling, peer-to-peer carpooling, 
                    and intelligent resource management.
                </p>
            </section>
            
            <section className="features-section">
                <div className="features-container">
                    <div className={`features-content fade-up${fade ? ' visible' : ''}`}>
                        <h2>Engineering a Frictionless Campus</h2>
                        <p>
                            We identified the 4 core bottlenecks of student life: fragmented resources, 
                            scheduling conflicts, transport accessibility, and manual support requests. 
                            EduSync solves them with a unified technical stack.
                        </p>
                        <ul className="features-list">
                            <li>
                                <CheckCircle size={20} className="feature-icon" />
                                <strong>AI-Optimized Logic:</strong> Gemini-driven timetable and doubt solving.
                            </li>
                            <li>
                                <CheckCircle size={20} className="feature-icon" />
                                <strong>Sustainable Mobility:</strong> Integrated student-only ridesharing.
                            </li>
                            <li>
                                <CheckCircle size={20} className="feature-icon" />
                                <strong>P2P Economy:</strong> Direct marketplace for campus essentials.
                            </li>
                        </ul>
                    </div>
                    <div className={`features-dashboard-home fade-up${fade ? ' visible' : ''}`}>
                        <div className="dashboard-header">
                            <Zap size={18} color="#f59e0b" />
                            <span>System Impact Metrics</span>
                        </div>
                        <div className="dashboard-metric">
                            <div className="metric-info">
                                <span>Wait-time Reduction</span>
                                <span>85%</span>
                            </div>
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar"
                                    style={{ width: "85%" }}
                                ></div>
                            </div>
                        </div>
                        <div className="dashboard-metric">
                            <div className="metric-info">
                                <span>Resource Accessibility</span>
                                <span>10x Faster</span>
                            </div>
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar"
                                    style={{ width: "95%" }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid-features-section">
                <div className="grid-features-header fade-up visible">
                    <h2>Technical Innovations</h2>
                    <p>
                        Our modular architecture scales to support every facet of the student journey.
                    </p>
                </div>
                <div className="features-grid">
                    <div className={`feature-card fade-up${fade ? ' visible' : ''}`}>
                        <Car size={28} className="card-icon" />
                        <h3>Smart Rideshare</h3>
                        <p>
                            Solving the "Last Mile" problem. Our algorithm pairs peers based on proximity and destination to reduce carbon footprint and costs.
                        </p>
                    </div>
                    <div className={`feature-card fade-up${fade ? ' visible' : ''}`}>
                        <Sparkles size={28} className="card-icon" />
                        <h3>AI Doubt Solver</h3>
                        <p>
                            Context-aware learning. Upload lecture PDFs and query our Gemini-integrated agent for instant academic clarification.
                        </p>
                    </div>
                    <div className={`feature-card fade-up${fade ? ' visible' : ''}`}>
                        <CalendarRange size={28} className="card-icon" />
                        <h3>Algorithmic Timetable</h3>
                        <p>
                            No more overlaps. Generates an optimized weekly schedule that balances study hours and extracurriculars automatically.
                        </p>
                    </div>
                    <div className={`feature-card fade-up${fade ? ' visible' : ''}`}>
                        <ShoppingBag size={28} className="card-icon" />
                        <h3>Campus Marketplace</h3>
                        <p>
                            A secure, internal economy for students to buy/sell books and gear, verified by institutional email authentication.
                        </p>
                    </div>
                    <div className={`feature-card fade-up${fade ? ' visible' : ''}`}>
                        <FolderHeart size={28} className="card-icon" />
                        <h3>My Shelf</h3>
                        <p>
                            Centralized resource vault. Sync YouTube playlists and PDFs into a single, searchable knowledge base.
                        </p>
                    </div>
                    <div className={`feature-card fade-up${fade ? ' visible' : ''}`}>
                        <Coffee size={28} className="card-icon" />
                        <h3>Zero-Queue Cafe</h3>
                        <p>
                            Pre-order system with real-time status notifications, eliminating physical bottlenecks during peak hours.
                        </p>
                    </div>
                </div>

                <section className="comparison-section">
                    <h2 className="fade-up visible">Disrupting the Status Quo</h2>
                    <div className="comparison-container">
                        <div className={`comparison-card problems-card fade-up${fade ? ' visible' : ''}`}>
                            <h3>The Current Problem</h3>
                            <ul>
                                <li>
                                    <XCircle size={20} className="icon-problem" />
                                    Fragmented data across 10+ platforms
                                </li>
                                <li>
                                    <XCircle size={20} className="icon-problem" />
                                    Wasteful commute costs and logistical lag
                                </li>
                                <li>
                                    <XCircle size={20} className="icon-problem" />
                                    Manual, error-prone support reporting
                                </li>
                            </ul>
                        </div>
                        <div className={`comparison-card solutions-card fade-up${fade ? ' visible' : ''}`}>
                            <h3>The EduSync Solution</h3>
                            <ul>
                                <li>
                                    <CheckCircle size={20} className="icon-solution" />
                                    Unified API-first architecture
                                </li>
                                <li>
                                    <CheckCircle size={20} className="icon-solution" />
                                    Cost-efficient peer-to-peer transport
                                </li>
                                <li>
                                    <CheckCircle size={20} className="icon-solution" />
                                    Real-time automated incident tracking
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            </section>

            <section className="cta-section">
                <h2 className="fade-up visible">Ready to Revolutionize Your Campus?</h2>
                <p className="fade-up visible">
                    Experience the future of student life. Built for impact. Engineered for efficiency.
                </p>
            </section>
        </>
    );
}