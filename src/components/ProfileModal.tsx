"use client";
import { useState, useEffect } from "react";
import { auth } from "@/src/lib/firebase"; 
import { updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import "./ProfileModal.css"; 
import { User, Mail, Phone, Save, Camera, ShieldCheck, X, ArrowLeft } from "lucide-react";

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    
    const [formData, setFormData] = useState({
        displayName: "",
        email: "",
        phoneNumber: "",
        photoURL: ""
    });
    useEffect(() => {
        if (!isOpen) return; 

        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const token = await user.getIdToken();
                    const res = await fetch("/api/user", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const data = await res.json();
                    
                    setFormData({
                        displayName: user.displayName || "Student",
                        email: user.email || "",
                        phoneNumber: data.user?.phoneNo || "", 
                        photoURL: user.photoURL || "https://avatar.iran.liara.run/public"
                    });
                } catch (err) {
                    console.error("Failed to load profile", err);
                }
            }
            setLoading(false);
        };

        fetchUserData();
    }, [isOpen]);

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
            
            if (res.ok) {
                toast.success("Profile updated successfully!");
                setIsEditing(false);
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to update phone number");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="profile-overlay">
            <div className="profile-modal-card">
                <button className="close-modal-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                {loading ? (
                    <div className="loading-state">Loading Profile...</div>
                ) : (
                    <>
                        <div className="profile-header">
                            <div className="avatar-wrapper">
                                <img src={formData.photoURL} alt="Profile" />
                                <button className="edit-avatar-btn"><Camera size={14}/></button>
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
                                    placeholder="Enter 10-digit number"
                                    disabled={!isEditing}
                                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                    className={isEditing ? "editable" : ""}
                                />
                            </div>

                            <div className="form-actions">
                                {isEditing ? (
                                    <>
                                        <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                                        <button className="save-btn" onClick={handleSave}><Save size={16}/> Save</button>
                                    </>
                                ) : (
                                    <div className="view-actions">
                                        <button className="back-btn" onClick={onClose}>
                                            <ArrowLeft size={16}/> Back
                                        </button>
                                        <button className="edit-btn" onClick={() => setIsEditing(true)}>
                                            Edit Profile
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}