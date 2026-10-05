import { useState } from "react";
import { useNavigate } from "react-router";

type Transport = "Available" | "Limited" | "Unavailable" | null;
type Signal = { rain: boolean; block: boolean; noAuto: boolean };

const BASE_SIGNALS = [
  { id: "rain", icon: "🌦", label: "Light Rain (Route)", accent: false },
  { id: "block", icon: "🚨", label: "Road Blocked", accent: true },
  { id: "rickshaw", icon: "🚖", label: "Rickshaws Low", accent: false },
  { id: "metro", icon: "🚇", label: "Metro On Time", accent: false },
];

function Tag({ children, color = "#FFE135" }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="nb-tag"
      style={{ background: color, color: color === "#0A0A0A" ? "#FFE135" : "#0A0A0A" }}
    >
      {children}
    </span>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [whyOpen, setWhyOpen] = useState(false);
  const [nightOpen, setNightOpen] = useState(false);
  const [transport, setTransport] = useState<Transport>(null);
  const [signals, setSignals] = useState<Signal>({ rain: false, block: false, noAuto: false });

  const demoSignals = [
    signals.rain && { id: "d-rain", icon: "🌧", label: "Heavy Rain Active", accent: true },
    signals.block && { id: "d-block", icon: "🚧", label: "Road Blocked (Live)", accent: true },
    signals.noAuto && { id: "d-auto", icon: "🚫", label: "No Autos Available", accent: true },
  ].filter(Boolean) as typeof BASE_SIGNALS;

  const displaySignals = demoSignals.length > 0 ? demoSignals : BASE_SIGNALS;

  return (
    <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Greeting */}
      <div>
        <p style={{ fontSize: 22, fontWeight: 700, color: "#0A0A0A", margin: 0, lineHeight: 1.2 }}>
          Good Morning, Student 👋
        </p>
        <p style={{ fontSize: 12, fontWeight: 500, color: "#666", margin: "4px 0 0", fontFamily: "Space Mono, monospace" }}>
          TIMETABLE-FIRST COMMUTE INTELLIGENCE
        </p>
      </div>

      {/* Timetable Card — yellow hero */}
      <div className="nb-card-yellow" style={{ padding: "18px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "Space Mono, monospace", letterSpacing: "0.08em" }}>
            NEXT COMMITMENT
          </span>
          <Tag color="#00C853">🟢 LOW RISK</Tag>
        </div>
        <p style={{ fontSize: 28, fontWeight: 700, margin: 0, lineHeight: 1.1, color: "#0A0A0A" }}>
          Data Structures
        </p>
        <p style={{ fontSize: 14, fontWeight: 500, margin: "4px 0 14px", color: "#333" }}>
          9:00 AM · Room 301, Block C
        </p>
        <div className="nb-divider" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
          <div>
            <p style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "#0A0A0A" }}>Leave by 8:00 AM</p>
            <p style={{ fontSize: 14, fontWeight: 500, margin: "2px 0 0", color: "#333" }}>Arrive 8:50 AM</p>
            <p style={{ fontSize: 11, margin: "6px 0 0", color: "#555", fontFamily: "Space Mono, monospace" }}>
              ⏱ INCLUDES 8-MIN SAFETY BUFFER
            </p>
          </div>
          <button
            className="nb-btn nb-btn-black"
            style={{ fontSize: 12, padding: "8px 14px", borderRadius: 0 }}
            onClick={() => navigate("/maps")}
          >
            VIEW MAP →
          </button>
        </div>
      </div>

      {/* Route Decision */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Primary */}
        <div className="nb-card" style={{ padding: 14 }}>
          <div style={{ marginBottom: 10 }}>
            <Tag color="#2D6BE4" >
              <span style={{ color: "#fff" }}>PRIMARY</span>
            </Tag>
          </div>
          <div style={{ fontSize: 20, marginBottom: 8, letterSpacing: 2 }}>🚖—🚇—🚶</div>
          <p style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "#0A0A0A" }}>42 min</p>
          <p style={{ fontSize: 13, margin: "2px 0 10px", color: "#666", fontFamily: "Space Mono, monospace" }}>₹45</p>
          <button
            className="nb-btn"
            style={{ fontSize: 10, padding: "5px 8px", width: "100%", fontFamily: "Space Mono, monospace" }}
            onClick={() => setWhyOpen(o => !o)}
          >
            {whyOpen ? "▲ HIDE" : "WHY THIS?"}
          </button>
          {whyOpen && (
            <div
              style={{
                marginTop: 8,
                background: "#F5F0E8",
                border: "2px solid #0A0A0A",
                padding: "8px 10px",
                fontSize: 11,
                fontFamily: "Space Mono, monospace",
                color: "#333",
                lineHeight: 1.6,
              }}
            >
              Fastest reliable option. No active disruptions on this corridor.
            </div>
          )}
        </div>

        {/* Backup */}
        <div
          style={{
            background: "#F5F0E8",
            border: "2.5px solid #0A0A0A",
            boxShadow: "4px 4px 0px #0A0A0A",
            padding: 14,
          }}
        >
          <div style={{ marginBottom: 10 }}>
            <Tag color="#999">
              <span style={{ color: "#0A0A0A" }}>BACKUP</span>
            </Tag>
          </div>
          <div style={{ fontSize: 20, marginBottom: 8, letterSpacing: 2 }}>🚌—🚆</div>
          <p style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "#0A0A0A" }}>52 min</p>
          <p style={{ fontSize: 13, margin: "2px 0 10px", color: "#666", fontFamily: "Space Mono, monospace" }}>₹30</p>
          <p style={{ fontSize: 11, color: "#888", fontFamily: "Space Mono, monospace" }}>
            USE IF METRO FAILS
          </p>
        </div>
      </div>

      {/* Location Input */}
      <div>
        <input
          className="nb-input"
          placeholder="Starting area (e.g., Andheri East)"
          style={{ width: "100%", padding: "11px 14px", fontSize: 14 }}
        />
        <p style={{ fontSize: 11, margin: "6px 0 0 2px", color: "#888", fontFamily: "Space Mono, monospace" }}>
          🔒 WE NEVER USE EXACT HOME ADDRESSES
        </p>
      </div>

      {/* Live Signals */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, fontFamily: "Space Mono, monospace", color: "#0A0A0A", marginBottom: 10, letterSpacing: "0.08em" }}>
          LIVE SIGNALS
        </p>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {displaySignals.map(sig => (
            <div
              key={sig.id}
              className="nb-tag"
              style={{
                background: sig.accent ? "#FF1744" : "#fff",
                color: sig.accent ? "#fff" : "#0A0A0A",
                whiteSpace: "nowrap",
                fontSize: 12,
                padding: "6px 12px",
              }}
            >
              {sig.icon} {sig.label}
            </div>
          ))}
        </div>
      </div>

      {/* Community Card */}
      <div className="nb-card" style={{ padding: 18 }}>
        <p style={{ fontSize: 11, fontWeight: 700, fontFamily: "Space Mono, monospace", color: "#0A0A0A", marginBottom: 14, letterSpacing: "0.08em" }}>
          COMMUNITY
        </p>

        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: "#0A0A0A" }}>Report Transport Status</p>
        <div style={{ display: "flex", gap: 0, marginBottom: 18, border: "2.5px solid #0A0A0A" }}>
          {(["Available", "Limited", "Unavailable"] as const).map((s, i) => (
            <button
              key={s}
              className={`nb-toggle ${transport === s ? "active" : ""}`}
              style={{
                flex: 1,
                borderLeft: i > 0 ? "2px solid #0A0A0A" : "none",
                borderTop: "none",
                borderBottom: "none",
                borderRight: "none",
                padding: "8px 4px",
              }}
              onClick={() => setTransport(p => p === s ? null : s)}
            >
              {s}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>Travel Together</p>
            <p style={{ fontSize: 11, color: "#666", margin: "2px 0 0", fontFamily: "Space Mono, monospace" }}>3 STUDENTS HEADING YOUR WAY</p>
          </div>
          <button className="nb-btn" style={{ width: 42, height: 42, fontSize: 18, borderRadius: 0 }}>👥</button>
        </div>

        <div
          style={{
            background: "#F5F0E8",
            border: "2px solid #0A0A0A",
            padding: "10px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontSize: 11, color: "#555", margin: 0, fontFamily: "Space Mono, monospace", lineHeight: 1.5, flex: 1 }}>
            {signals.noAuto ? "⚡ RICKSHAWS LOW — SHARED RIDE AVAILABLE" : "SHARED RIDE AVAILABLE (RICKSHAWS LOW)"}
          </p>
          <button className="nb-btn nb-btn-green" style={{ fontSize: 12, padding: "6px 14px", marginLeft: 10, borderRadius: 0 }}>
            JOIN
          </button>
        </div>
      </div>

      {/* Night Safety Accordion */}
      <div className="nb-card">
        <button
          style={{
            width: "100%",
            padding: "16px 18px",
            background: nightOpen ? "#0A0A0A" : "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 700,
            fontSize: 15,
            color: nightOpen ? "#FFE135" : "#0A0A0A",
          }}
          onClick={() => setNightOpen(o => !o)}
        >
          <span>🌙 Night Travel Mode</span>
          <span style={{ transition: "transform 0.2s", display: "inline-block", transform: nightOpen ? "rotate(180deg)" : "none", fontSize: 18 }}>▾</span>
        </button>
        {nightOpen && (
          <div style={{ padding: "0 18px 18px" }}>
            <div className="nb-divider" style={{ marginBottom: 14 }} />
            <p style={{ fontSize: 12, fontFamily: "Space Mono, monospace", color: "#333", marginBottom: 14, lineHeight: 1.7 }}>
              WOMEN-DESIGNATED COACH AVAILABLE AT 10:42 PM · PLATFORM 3
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="nb-btn" style={{ flex: 1, padding: "9px 0", fontSize: 12, borderRadius: 0 }}>🚔 Police</button>
              <button className="nb-btn" style={{ flex: 1, padding: "9px 0", fontSize: 12, borderRadius: 0 }}>🏫 College Security</button>
            </div>
          </div>
        )}
      </div>

      {/* Demo Simulator */}
      <div
        style={{
          background: "#0A0A0A",
          border: "2.5px solid #0A0A0A",
          boxShadow: "6px 6px 0px #666",
          padding: "14px 16px",
        }}
      >
        <p style={{ fontSize: 10, fontWeight: 700, color: "#FFE135", fontFamily: "Space Mono, monospace", letterSpacing: "0.1em", textAlign: "center", marginBottom: 12 }}>
          ⚡ DEMO SIMULATOR
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {[
            { key: "rain", label: "🌧 RAIN", active: signals.rain, color: "#2D6BE4" },
            { key: "block", label: "🚧 BLOCK", active: signals.block, color: "#FF1744" },
            { key: "noAuto", label: "🚖 NO AUTO", active: signals.noAuto, color: "#FF6B35" },
            { key: "clear", label: "↺ CLEAR", active: false, color: "#00C853" },
          ].map(btn => (
            <button
              key={btn.key}
              style={{
                background: btn.active ? btn.color : "#fff",
                color: btn.active ? "#fff" : "#0A0A0A",
                border: `2px solid ${btn.active ? btn.color : "#fff"}`,
                boxShadow: btn.active ? "none" : "2px 2px 0px #555",
                padding: "7px 8px",
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Space Mono, monospace",
                flex: 1,
                transition: "all 0.1s",
              }}
              onClick={() => {
                if (btn.key === "clear") setSignals({ rain: false, block: false, noAuto: false });
                else if (btn.key === "rain") setSignals(s => ({ ...s, rain: !s.rain }));
                else if (btn.key === "block") setSignals(s => ({ ...s, block: !s.block }));
                else if (btn.key === "noAuto") setSignals(s => ({ ...s, noAuto: !s.noAuto }));
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
