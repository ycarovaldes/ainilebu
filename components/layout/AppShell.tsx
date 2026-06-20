import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100dvh" }}>
      {/* Sidebar — visible solo en desktop/tablet landscape */}
      <div className="sidebar-wrapper">{<Sidebar />}</div>

      {/* Contenido principal */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          paddingBottom: "80px", /* espacio para bottom nav en mobile */
        }}
        className="main-content"
      >
        {children}
      </main>

      {/* Bottom nav — visible solo en mobile */}
      <div className="bottom-nav-wrapper">
        <BottomNav />
      </div>

      <style>{`
        @media (min-width: 768px) {
          .bottom-nav-wrapper { display: none; }
          .main-content { padding-bottom: 0; }
        }
        @media (max-width: 767px) {
          .sidebar-wrapper { display: none; }
        }
      `}</style>
    </div>
  );
}
