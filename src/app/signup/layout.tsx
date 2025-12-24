import { LoginForm } from "@/src/components/login-form";
import "./dashboardLayout.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <main className="dashboard-main">
        <LoginForm />
        {children}
      </main>
    </div>
  );
}
