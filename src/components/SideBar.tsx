"use client";

import { useState } from "react";
import "./SideBar.css";
import {
    LayoutGrid,
    LayoutDashboard,
    FilePlus2,
    Sparkles,
    NotebookText,
    Bell,
    ShoppingCart,
    Coffee,
    Briefcase,
    HelpCircle,
    Menu,
    User2Icon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Generate Timetable", href: "/gentt", icon: FilePlus2 },
        { label: "Notes.Co", href: "/notes", icon: NotebookText },
        { label: "My Shelf", href: "/shelf", icon: User2Icon },
        { label: "JCafe", href: "/jcafe", icon: Coffee },
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
                    <span className="header-title">EduSync</span>
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

            <div className="sidebar-footer">
                <button onClick={() => setCollapsed(!collapsed)}>
                    <Menu size={20} />
                    <span className="label">
                        {collapsed ? "Expand" : "Collapse"}
                    </span>
                </button>
            </div>
        </aside>
    );
}
