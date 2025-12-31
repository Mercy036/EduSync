import "./marketplace.css";
import SideBar from "@/src/components/SideBar";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#ffffff", overflowX: "hidden" }}>
      <SideBar />
      <main style={{ 
        flex: 1, 
        padding: "2.5rem 3rem", 
        boxSizing: "border-box",
        minWidth: 0, /* Prevents flex overflow */
        width: "100%" 
      }}>
        {children}
      </main>
    </div>
  );
}