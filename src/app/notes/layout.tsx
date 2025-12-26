import "./notesLayout.css";
import SideBar from "@/src/components/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="notes-layout">
      <SideBar />
      <main className="notes-main">
        {children}
      </main>
    </div>
  );
}
