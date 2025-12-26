"use client"
import { X, Send, UserCircle } from "lucide-react"
import "../app/car-buddy/car-buddy.css"

interface ChatWindowProps {
  recipientName: string
  destination: string
  onClose: () => void
}

export default function ChatWindow({ recipientName, destination, onClose }: ChatWindowProps) {
  return (
    <div className="carbuddy-modal-overlay" onClick={onClose}>
      <div className="carbuddy-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="carbuddy-modal-header">
          <div className="carbuddy-chat-user-info">
            <div className="carbuddy-avatar-small">
              <UserCircle size={24} color="#555" />
            </div>
            <div>
              <h3>{recipientName}</h3>
              <span className="carbuddy-chat-status">Heading to {destination}</span>
            </div>
          </div>
          <button className="carbuddy-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        
        <div className="carbuddy-chat-body">
          <div className="carbuddy-msg-bubble received">
            I saw you are going to Noida Sector 62
          </div>
          <div className="carbuddy-msg-bubble received">
            I'm going to {destination} as well — can I hop in?
          </div>
          <div className="carbuddy-date-divider">Today 4:20 PM</div>
        </div>

        <div className="carbuddy-chat-input-area">
          <input 
            type="text" 
            placeholder="Type a message..."
            autoFocus
          />
          <button className="carbuddy-send-btn">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}