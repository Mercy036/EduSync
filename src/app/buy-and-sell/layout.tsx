import "./marketplace.css";
import SideBar from "@/src/components/SideBar";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#ffffff" }}>
      <SideBar />
      <main style={{ flex: 1, marginLeft: "140px", padding: "2.5rem 3rem", boxSizing: "border-box" }}>
        {children}
      </main>
    </div>
  );
}