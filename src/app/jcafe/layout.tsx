import "./dashboardLayout.css";
import SideBar from "@/src/components/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <SideBar />
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}
