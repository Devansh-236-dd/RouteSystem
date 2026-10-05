import { Outlet, useNavigate, useLocation } from "react-router";

const NAV = [
  { path: "/", icon: "⏱", label: "Timetable" },
  { path: "/maps", icon: "🗺", label: "Maps" },
  { path: "/community", icon: "👥", label: "Community" },
  { path: "/safety", icon: "🌙", label: "Safety" },
];

export default function Root() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "#F5F0E8", maxWidth: 430, margin: "0 auto", position: "relative" }}
    >
      {/* App Header */}
      <header
        style={{
          background: "#0A0A0A",
          borderBottom: "2.5px solid #0A0A0A",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              background: "#FFE135",
              border: "2px solid #FFE135",
              fontWeight: 900,
              fontSize: 15,
              padding: "3px 9px",
              letterSpacing: "-0.5px",
              fontFamily: "Space Mono, monospace",
              color: "#0A0A0A",
            }}
          >
            RS
          </span>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 17, letterSpacing: "-0.3px" }}>
            RouteSense
          </span>
        </div>
        <span
          style={{
            background: "#FF3CAC",
            border: "2px solid #FF3CAC",
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 8px",
            fontFamily: "Space Mono, monospace",
            letterSpacing: "0.05em",
          }}
        >
          LIVE
        </span>
      </header>

      {/* Page content */}
      <main style={{ flex: 1, overflow: "auto", paddingBottom: 80 }}>
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 430,
          background: "#fff",
          borderTop: "2.5px solid #0A0A0A",
          display: "flex",
          zIndex: 100,
        }}
      >
        {NAV.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              className={`nb-nav-item ${active ? "active" : ""}`}
              style={{ flex: 1, borderRadius: 0 }}
              onClick={() => navigate(item.path)}
            >
              <span style={{ fontSize: 19 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
