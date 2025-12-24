"use client";
import { useState } from "react";
import "./cafe.css";

interface MenuItem {
    id: number;
    name: string;
    price: number;
    category: string;
}

const MENU_ITEMS: MenuItem[] = [
    { id: 1, name: "Masala Chai (Ginger)", price: 15, category: "Hot" },
    { id: 2, name: "Samosa (2 pcs)", price: 30, category: "Snacks" },
    { id: 3, name: "Paneer Pakoda", price: 80, category: "Snacks" },
    { id: 4, name: "Masala Potato Chips", price: 20, category: "Sides" },
    { id: 5, name: "Vada Pav", price: 25, category: "Snacks" },
    { id: 6, name: "Cold Coffee", price: 60, category: "Cold" },
];

export default function CafePage() {
    const [cart, setCart] = useState<{ item: MenuItem; qty: number }[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = (item: MenuItem) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.item.id === item.id);
            if (existing) {
                return prev.map((i) =>
                    i.item.id === item.id ? { ...i, qty: i.qty + 1 } : i
                );
            }
            return [...prev, { item, qty: 1 }];
        });
        setIsCartOpen(true);
    };

    const total = cart.reduce((acc, curr) => acc + curr.item.price * curr.qty, 0);

    return (
        <section className="jcafe-container">
            <header className="jcafe-header">
                <h1>J<span>Cafe</span></h1>
                <p>Fuelling your study sessions with premium snacks.</p>
            </header>

            <div className="jcafe-content">
                {/* LEFT SIDE: Bento Column */}
                <div className="jcafe-left-col">
                    <div className="jcafe-card jcafe-featured">
                        <span className="jcafe-badge">Student Combo</span>
                        <h3>Chai & Samosa</h3>
                        <p>The ultimate study-break fuel. Ginger Masala Chai with 2 crispy Samosas.</p>
                        <button onClick={() => addToCart(MENU_ITEMS[1])} className="jcafe-primary-btn">
                            Quick Add — ₹45
                        </button>
                    </div>

                    <div className="jcafe-bento-grid">
                        <div className="jcafe-card">
                            <h4 className="jcafe-label">Rewards</h4>
                            <p className="jcafe-value">You have 4 stars.</p>
                            <span className="jcafe-hint">6 more for a free chai!</span>
                        </div>
                        <div className="jcafe-card">
                            <h4 className="jcafe-label">Quick Reorder</h4>
                            <p className="jcafe-value">Vada Pav</p>
                            <span className="jcafe-hint">Ordered 2 days ago</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: Menu */}
                <div className="jcafe-menu-card">
                    <div className="jcafe-menu-top">
                        <h3>Full Menu</h3>
                        <p>Tap items to add to tray</p>
                    </div>
                    <ul className="jcafe-list">
                        {MENU_ITEMS.map((item) => (
                            <li key={item.id} className="jcafe-list-item" onClick={() => addToCart(item)}>
                                <div className="jcafe-item-info">
                                    <span className="jcafe-item-name">{item.name}</span>
                                    <span className="jcafe-item-tag">{item.category}</span>
                                </div>
                                <div className="jcafe-item-price">₹{item.price}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* SLIDING CART */}
            <div className={`jcafe-sidebar ${isCartOpen ? "is-open" : ""}`}>
                <div className="jcafe-sidebar-header">
                    <h3>Your Tray</h3>
                    <button onClick={() => setIsCartOpen(false)}>Close</button>
                </div>
                <div className="jcafe-sidebar-items">
                    {cart.length === 0 ? (
                        <p className="empty-tray">Your tray is empty.</p>
                    ) : (
                        cart.map((entry) => (
                            <div key={entry.item.id} className="jcafe-cart-row">
                                <span>{entry.qty}x {entry.item.name}</span>
                                <span>₹{entry.item.price * entry.qty}</span>
                            </div>
                        ))
                    )}
                </div>
                {cart.length > 0 && (
                    <div className="jcafe-sidebar-footer">
                        <div className="jcafe-total-row">
                            <span>Total</span>
                            <span>₹{total}</span>
                        </div>
                        <button className="jcafe-checkout-btn">Complete Order</button>
                    </div>
                )}
            </div>
        </section>
    );
}