"use client";
import { useState } from "react";
import { 
  Bell, 
  Trophy, 
  BookOpen, 
  Briefcase, 
  Calendar, 
  Clock, 
  Info, 
  ExternalLink 
} from "lucide-react";
import "./announcements.css";

export default function AnnouncementsPage() {
    const [filter, setFilter] = useState("All");

    const ANNOUNCEMENTS = [
        { id: 1, type: "Hackathon", title: "Code-A-Thon 2026", date: "Jan 15", desc: "48-hour build session. Winners get ₹50k prize pool.", tag: "Urgent", icon: <Trophy size={18} /> },
        { id: 2, type: "Exam", title: "Internal Assessment - II", date: "Jan 05", desc: "Syllabus covers Units 3 & 4. Admit cards issued at Block C.", tag: "Academic", icon: <BookOpen size={18} /> },
        { id: 3, type: "Internship", title: "Google Summer Internships", date: "Feb 10", desc: "Applications open for 3rd-year students. Referrals available.", tag: "Career", icon: <Briefcase size={18} /> },
        { id: 4, type: "Holiday", title: "Republic Day Break", date: "Jan 26", desc: "Campus remains closed. All lab sessions rescheduled.", tag: "Notice", icon: <Calendar size={18} /> },
    ];

    return (
        <section className="an-container">
            <header className="an-header">
                <h1>Campus<span>Announcements</span></h1>
                <p>Stay ahead of the curve. Never miss a deadline again.</p>
            </header>

            <div className="an-bento-grid">
                <div className="an-card an-main-feed">
                    <div className="an-card-head">
                        <div className="an-title-wrapper">
                            <Bell size={20} className="an-gold-icon" />
                            <h3>Upcoming Events</h3>
                        </div>
                        <span className="an-count">{ANNOUNCEMENTS.length} New</span>
                    </div>
                    <div className="an-list">
                        {ANNOUNCEMENTS.map((item) => (
                            <div key={item.id} className="an-item">
                                <div className="an-item-left">
                                    <div className="an-tag-row">
                                        <span className={`an-tag ${item.tag.toLowerCase()}`}>
                                            {item.icon}
                                            {item.tag}
                                        </span>
                                    </div>
                                    <h4>{item.title}</h4>
                                    <p>{item.desc}</p>
                                </div>
                                <div className="an-item-right">
                                    <span className="an-date">{item.date}</span>
                                    <ExternalLink size={14} className="an-link-icon" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="an-card an-exam-spotlight">
                    <Clock size={32} className="an-clock-icon" />
                    <h4>Exam Countdown</h4>
                    <div className="an-countdown">
                        <div className="an-timer">
                            <strong>12</strong>
                            <span>Days Left</span>
                        </div>
                        <p>End-Sem Theory Exams begin Jan 05, 2026.</p>
                    </div>
                    <button className="an-ghost-btn">View Full Schedule</button>
                </div>

                <div className="an-card an-career-tile">
                    <Briefcase size={20} className="an-gold-icon" />
                    <span className="an-small-tag">Career Alert</span>
                    <h4>New Internship</h4>
                    <p>Microsoft is hiring Cloud Interns. Apply by tonight!</p>
                </div>

                <div className="an-card an-holiday-wide">
                    <div className="an-holiday-content">
                        <div className="an-tab-header">
                            <Calendar size={18} className="an-gold-icon" />
                            <h4>Next Holiday</h4>
                        </div>
                        <div className="an-holiday-info">
                            <h3>Republic Day</h3>
                            <p>Monday, 26th January • Full Campus Closure</p>
                        </div>
                    </div>
                    <Calendar size={64} className="an-cal-bg-icon" />
                </div>

                <div className="an-card an-help-tile">
                    <Info size={20} className="an-gold-icon" />
                    <h4>Missing something?</h4>
                    <p>Contact the Student Affairs office for circulars.</p>
                </div>
            </div>

            <footer className="an-footer">
                <p>EduSync // For the hustle.</p>
            </footer>
        </section>
    );
}