import "./announcementsLayout.css";
import SideBar from "@/src/components/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="announcements-layout">
      <SideBar />
      <main className="announcements-main">
        {children}
      </main>
    </div>
  );
}
