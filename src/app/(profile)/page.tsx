"use client";
import { useState, useEffect } from "react";
import { auth, } from "@/src/lib/firebase"; 
import { updateProfile } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; 
import { toast } from "react-toastify";
import "./profile.css"; 
import { User, Mail, Phone, Save, Camera, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    
    const [formData, setFormData] = useState({
        displayName: "",
        email: "",
        phoneNumber: "",
        photoURL: ""
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                let phone = "";
                setFormData({
                    displayName: user.displayName || "Student",
                    email: user.email || "",
                    phoneNumber: phone || "", 
                    photoURL: user.photoURL || "https://avatar.iran.liara.run/public"
                });
            }
            setLoading(false);
        };
        setTimeout(fetchUserData, 800);
    }, []);

    const handleSave = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            await updateProfile(user, { displayName: formData.displayName });
            const token = await user.getIdToken();
            const res = await fetch("/api/update-phone", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken: token, phoneNo: formData.phoneNumber })
            });
            
            const data = await res.json();
            
            if (res.ok) {
                toast.success("Profile updated successfully!");
                setIsEditing(false);
            } else {
                toast.error(data.error || "Failed to update phone number");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="avatar-wrapper">
                        <img src={formData.photoURL} alt="Profile" />
                    </div>
                    <div className="header-info">
                        <h1>{formData.displayName}</h1>
                        <span className="role-badge">Student</span>
                    </div>
                </div>

                <div className="profile-form">
                    <div className="input-group">
                        <label><User size={16}/> Full Name</label>
                        <input 
                            type="text" 
                            value={formData.displayName}
                            disabled={!isEditing}
                            onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                            className={isEditing ? "editable" : ""}
                        />
                    </div>

                    <div className="input-group">
                        <label><Mail size={16}/> Email</label>
                        <input type="email" value={formData.email} disabled className="locked"/>
                    </div>

                    <div className="input-group">
                        <label><Phone size={16}/> Phone Number</label>
                        <input 
                            type="text" 
                            value={formData.phoneNumber}
                            placeholder="9876543210"
                            disabled={!isEditing}
                            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                            className={isEditing ? "editable" : ""}
                        />
                    </div>

                    <div className="form-actions">
                        {isEditing ? (
                            <button className="save-btn" onClick={handleSave}><Save size={16}/> Save</button>
                        ) : (
                            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}