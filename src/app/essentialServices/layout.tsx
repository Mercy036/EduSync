import "./essential.css";
import SideBar from "@/src/components/SideBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EssentialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#ffffff" }}>
      <SideBar />
      <main style={{ flex: 1, marginLeft: "140px", padding: "0", boxSizing: "border-box" }}>
        {children}
      </main>
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
    </div>
  );
}