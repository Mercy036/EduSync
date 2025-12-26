import "./shelflayout.css";
import SideBar from "@/src/components/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="shelf-layout">
      <SideBar />
      <main className="shelf-main">
        {children}
      </main>
    </div>
  );
}
