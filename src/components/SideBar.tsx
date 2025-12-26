"use client";

import { useState, useEffect } from "react";
import "./SideBar.css";
import {
    LayoutGrid,
    LayoutDashboard,
    FilePlus2,
    NotebookText,
    Bell,
    Coffee,
    Briefcase,
    HelpCircle,
    Menu,
    User2Icon,
    Car
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "./SignOutButton";

export default function SideBar() {
    // 1. Initialize state as false (expanded) by default to prevent hydration errors
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    // 2. On component mount, check localStorage for saved preference
    useEffect(() => {
        const savedState = localStorage.getItem("sidebar-collapsed");
        if (savedState !== null) {
            setCollapsed(JSON.parse(savedState));
        }
    }, []);

    // 3. Create a toggle function that updates both State and LocalStorage
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
        { label: "JCafe", href: "/jcafe", icon: Coffee },
        { label: "CarBuddy", href: "/car-buddy", icon: Car },
        { label: "Campus Essentials", href: "/essentialServices", icon: Briefcase },
        { label: "Announcements", href: "/announcements", icon: Bell },
        { label: "Help", href: "/help", icon: HelpCircle },
    ];

    return (
        <aside className={`sidebar${collapsed ? " collapsed" : ""}`}>
            <div className="sidebar-header">
                <div className="logo">
                    <LayoutGrid size={24} />
                </div>
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
            
            {/* Pass the collapsed state to SignOutButton */}
            <SignOutButton collapsed={collapsed} />

            <div className="sidebar-footer">
                {/* Use the new toggleSidebar function */}
                <button onClick={toggleSidebar}>
                    <Menu size={20} />
                    <span className="label">
                        {collapsed ? "Expand" : "Collapse"}
                    </span>
                </button>
            </div>
        </aside>
    );
}