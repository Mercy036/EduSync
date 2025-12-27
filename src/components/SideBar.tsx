"use client";

import { useState, useEffect } from "react";
import "./SideBar.css";
import {
    LayoutGrid, LayoutDashboard, FilePlus2, NotebookText, Bell, Coffee, Briefcase, HelpCircle, Menu, User2Icon, Car, DollarSign 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "./SignOutButton";
import ProfileButton from "./ProfileButton"; 
import ProfileModal from "./ProfileModal"; 

export default function SideBar() {
    const [collapsed, setCollapsed] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false); 
    const pathname = usePathname();

    useEffect(() => {
        const savedState = localStorage.getItem("sidebar-collapsed");
        if (savedState !== null) setCollapsed(JSON.parse(savedState));
    }, []);

    const toggleSidebar = () => {
        const newState = !collapsed;
        setCollapsed(newState);
        localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
    };

    const navItems = [
       { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
       { label: "Timetable", href: "/timetable", icon: FilePlus2 },
       { label: "Notes.Co", href: "/notes", icon: NotebookText },
       { label: "My Shelf", href: "/shelf", icon: User2Icon },
       { label: "Buy & Sell", href: "/buy&sell", icon: DollarSign  },
       { label: "JCafe", href: "/jcafe", icon: Coffee },
       { label: "CarBuddy", href: "/car-buddy", icon: Car },
       { label: "Campus Essentials", href: "/essentialServices", icon: Briefcase },
       { label: "Announcements", href: "/announcements", icon: Bell },
       { label: "Help", href: "/help", icon: HelpCircle },
    ];

    return (
        <>
            <aside className={`sidebar${collapsed ? " collapsed" : ""}`}>
                <div className="sidebar-header">
                    <div className="logo"><LayoutGrid size={24} /></div>
                    <div className="header-text">
                        <a href="/home"><span className="header-title">EduSync</span></a>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        {navItems.map(({ label, href, icon: Icon }) => {
                            const isActive = pathname === href || pathname.startsWith(`${href}/`);
                            return (
                                <li key={href} className={isActive ? "active" : ""}>
                                    <Link href={href}>
                                        <Icon size={20} />
                                        <span className="label">{label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
                
                <ProfileButton 
                    collapsed={collapsed} 
                    onClick={() => setIsProfileOpen(true)} 
                />
                <SignOutButton collapsed={collapsed} />

                <div className="sidebar-footer">
                    <button onClick={toggleSidebar}>
                        <Menu size={20} />
                        <span className="label">{collapsed ? "Expand" : "Collapse"}</span>
                    </button>
                </div>
            </aside>

            <ProfileModal 
                isOpen={isProfileOpen} 
                onClose={() => setIsProfileOpen(false)} 
            />
        </>
    );
}