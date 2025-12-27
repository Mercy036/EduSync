"use client";
import { useState, useEffect } from "react";
import { auth } from "@/src/lib/firebase"; 
import { updateProfile } from "firebase/auth";
import { toast } from "react-toastify";

import { User, Mail, Phone, Save, Camera, X, ArrowLeft } from "lucide-react";

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
        // Overlay: fixed position, blurred backdrop
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-[9999] animate-[fadeIn_0.2s_ease-out]">
            
            {/* Modal Card */}
            <div className="bg-white w-full max-w-[500px] p-10 rounded-3xl relative shadow-2xl animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                
                {/* Close Button (X) */}
                <button 
                    className="absolute top-5 right-5 text-gray-400 hover:text-gray-800 transition-colors bg-transparent border-none cursor-pointer" 
                    onClick={onClose}
                >
                    <X size={24} />
                </button>

                {loading ? (
                    <div className="h-[300px] flex items-center justify-center text-gray-500 font-medium">
                        Loading Profile...
                    </div>
                ) : (
                    <>
                        {/* Header Section */}
                        <div className="flex items-center gap-6 mb-8">
                            <div className="relative w-[80px] h-[80px]">
                                <img 
                                    src={formData.photoURL} 
                                    alt="Profile" 
                                    className="w-full h-full rounded-full object-cover border-4 border-gray-50"
                                />
                                <button className="absolute bottom-0 right-0 bg-[#111] text-white p-1.5 rounded-full border-2 border-white flex items-center justify-center cursor-pointer">
                                    <Camera size={12}/>
                                </button>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold m-0 text-gray-900">
                                    {formData.displayName}
                                </h1>
                                <span className="inline-block mt-1 bg-[#faedcd] text-[#d4a373] px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Student
                                </span>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                                    <User size={16}/> Full Name
                                </label>
                                <input 
                                    type="text" 
                                    value={formData.displayName}
                                    disabled={!isEditing}
                                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                                    className={`w-full p-3 rounded-xl border text-sm transition-all outline-none
                                        ${isEditing 
                                            ? "bg-[#fffcf5] border-[#d4a373] text-gray-800" 
                                            : "bg-white border-gray-200 text-gray-600"
                                        }
                                    `}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                                    <Mail size={16}/> Email
                                </label>
                                <input 
                                    type="email" 
                                    value={formData.email} 
                                    disabled 
                                    className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                                    <Phone size={16}/> Phone Number
                                </label>
                                <input 
                                    type="text" 
                                    value={formData.phoneNumber}
                                    placeholder="Enter 10-digit number"
                                    disabled={!isEditing}
                                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                    className={`w-full p-3 rounded-xl border text-sm transition-all outline-none
                                        ${isEditing 
                                            ? "bg-[#fffcf5] border-[#d4a373] text-gray-800" 
                                            : "bg-white border-gray-200 text-gray-600"
                                        }
                                    `}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 mt-4">
                                {isEditing ? (
                                    <>
                                        <button 
                                            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors cursor-pointer" 
                                            onClick={() => setIsEditing(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            className="flex items-center gap-2 px-5 py-2.5 bg-[#d4a373] text-white rounded-xl font-semibold hover:bg-[#c69363] transition-colors border-none cursor-pointer" 
                                            onClick={handleSave}
                                        >
                                            <Save size={16}/> Save
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex w-full justify-between items-center">
                                        <button 
                                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-pointer" 
                                            onClick={onClose}
                                        >
                                            <ArrowLeft size={16}/> Back
                                        </button>
                                        <button 
                                            className="px-6 py-2.5 bg-[#111] text-white rounded-xl font-semibold hover:bg-black transition-colors border-none cursor-pointer" 
                                            onClick={() => setIsEditing(true)}
                                        >
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