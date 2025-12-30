import "./essentialLayout.css";
import SideBar from "@/src/components/SideBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EssentialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="essential-layout">
      <SideBar />
      <main className="essential-main">
        {children}
      </main>
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
    </div>
  );
}