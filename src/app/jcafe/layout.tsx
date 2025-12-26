import "./jcafeLayout.css";
import SideBar from "@/src/components/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="jcafe-layout">
      <SideBar />
      <main className="jcafe-main">
        {children}
      </main>
    </div>
  );
}
