import "./carBuddylayout.css";
import SideBar from "@/src/components/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="carBuddy-layout">
      <SideBar />
      <main className="carBuddy-main">
        {children}
      </main>
    </div>
  );
}
