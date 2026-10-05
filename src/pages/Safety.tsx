import { useState } from "react";

const TRAINS = [
  { time: "10:22 PM", platform: "1", coach: "Ladies Special", confidence: 97 },
  { time: "10:42 PM", platform: "3", coach: "Ladies Special", confidence: 94 },
  { time: "11:05 PM", platform: "2", coach: "Women-Designated (2nd)", confidence: 88 },
  { time: "11:34 PM", platform: "1", coach: "Women-Designated (1st)", confidence: 82 },
];

const CHECKPOINTS = [
  { id: 1, name: "DJ Sanghvi Main Gate", status: "Open", type: "college", time: "9:00 PM closes" },
  { id: 2, name: "Andheri Metro Station", status: "Staffed", type: "metro", time: "12:00 AM last" },
  { id: 3, name: "Vile Parle Police Chowky", status: "Active", type: "police", time: "24 hrs" },
];

const TIPS = [
  "Share your live location before boarding an auto at night.",
  "Prefer metro or bus over autos post 10 PM.",
  "Save emergency contact numbers offline — don't rely on signal.",
  "Women-designated coaches are always the first and last of the train.",
  "The SafetyNet WhatsApp group auto-alerts your guardian at 11 PM.",
];

export default function Safety() {
  const [sos, setSos] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);
  const [sharing, setSharing] = useState(false);

  function triggerSos() {
    setSos(true);
    let count = 5;
    const interval = setInterval(() => {
      count -= 1;
      setSosCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  function cancelSos() {
    setSos(false);
    setSosCountdown(5);
  }

  return (
    <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 18 }}>

      {/* Header */}
      <div>
        <p style={{ fontSize: 22, fontWeight: 700, color: "#0A0A0A", margin: 0 }}>Safety Centre 🌙</p>
        <p style={{ fontSize: 11, color: "#666", fontFamily: "Space Mono, monospace", margin: "4px 0 0" }}>
          NIGHT TRAVEL INTELLIGENCE + EMERGENCY
        </p>
      </div>

      {/* SOS Panel */}
      {sos ? (
        <div
          style={{
            background: "#FF1744",
            border: "2.5px solid #0A0A0A",
            boxShadow: "6px 6px 0px #0A0A0A",
            padding: "20px 18px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#fff", fontFamily: "Space Mono, monospace", fontSize: 12, fontWeight: 700, margin: "0 0 8px", letterSpacing: "0.1em" }}>
            ⚡ SOS ACTIVATING IN {sosCountdown}s
          </p>
          <p style={{ color: "#fff", fontSize: 28, fontWeight: 700, margin: "0 0 16px" }}>
            Contacting Emergency Contacts...
          </p>
          <button
            className="nb-btn"
            style={{ background: "#fff", fontSize: 14, padding: "12px 30px", borderRadius: 0, fontWeight: 700 }}
            onClick={cancelSos}
          >
            CANCEL SOS
          </button>
        </div>
      ) : (
        <div
          style={{
            background: "#0A0A0A",
            border: "2.5px solid #0A0A0A",
            boxShadow: "6px 6px 0px #FF1744",
            padding: "18px",
          }}
        >
          <p style={{ color: "#FF1744", fontFamily: "Space Mono, monospace", fontSize: 10, fontWeight: 700, margin: "0 0 14px", letterSpacing: "0.1em" }}>
            ⚡ EMERGENCY
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            <button
              className="nb-btn"
              style={{ padding: "12px 0", fontSize: 13, background: "#fff", borderRadius: 0, fontWeight: 700 }}
            >
              🚔 Police<br />
              <span style={{ fontSize: 10, fontFamily: "Space Mono, monospace" }}>100</span>
            </button>
            <button
              className="nb-btn"
              style={{ padding: "12px 0", fontSize: 13, background: "#fff", borderRadius: 0, fontWeight: 700 }}
            >
              🏫 College<br />
              <span style={{ fontSize: 10, fontFamily: "Space Mono, monospace" }}>Security</span>
            </button>
            <button
              className="nb-btn"
              style={{ padding: "12px 0", fontSize: 13, background: "#fff", borderRadius: 0, fontWeight: 700 }}
            >
              🚑 Ambulance<br />
              <span style={{ fontSize: 10, fontFamily: "Space Mono, monospace" }}>102</span>
            </button>
            <button
              className="nb-btn"
              style={{ padding: "12px 0", fontSize: 13, background: "#fff", borderRadius: 0, fontWeight: 700 }}
            >
              👩 Helpline<br />
              <span style={{ fontSize: 10, fontFamily: "Space Mono, monospace" }}>1091</span>
            </button>
          </div>
          <button
            className="nb-btn"
            style={{ width: "100%", padding: "14px 0", fontSize: 14, fontWeight: 700, background: "#FF1744", color: "#fff", borderColor: "#FF1744", letterSpacing: "0.05em", borderRadius: 0 }}
            onClick={triggerSos}
          >
            🆘 HOLD FOR SOS ALERT
          </button>
        </div>
      )}

      {/* Live Location Sharing */}
      <div className="nb-card" style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>📍 Live Location Sharing</p>
            <p style={{ fontSize: 11, color: "#666", margin: "2px 0 0", fontFamily: "Space Mono, monospace" }}>
              {sharing ? "SHARING WITH: Mom, College Security" : "CURRENTLY OFF"}
            </p>
          </div>
          <button
            className="nb-btn"
            style={{
              padding: "8px 16px",
              fontSize: 12,
              fontWeight: 700,
              background: sharing ? "#00C853" : "#fff",
              color: sharing ? "#fff" : "#0A0A0A",
              borderRadius: 0,
              boxShadow: sharing ? "2px 2px 0 #0A0A0A" : "4px 4px 0 #0A0A0A",
            }}
            onClick={() => setSharing(s => !s)}
          >
            {sharing ? "ON ✓" : "START"}
          </button>
        </div>
        {sharing && (
          <div
            style={{
              background: "#00C853",
              border: "2px solid #0A0A0A",
              padding: "8px 12px",
              fontFamily: "Space Mono, monospace",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.04em",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ display: "inline-block", width: 8, height: 8, background: "#0A0A0A", borderRadius: "50%", animation: "pulse 1.2s infinite" }} />
            SHARING LIVE · EXPIRES IN 2 HRS
          </div>
        )}
      </div>

      {/* Night Train Schedule */}
      <div className="nb-card" style={{ padding: 16 }}>
        <p style={{ fontFamily: "Space Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", margin: "0 0 12px" }}>
          🌙 NIGHT TRAIN SCHEDULE — WOMEN'S COACHES
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {TRAINS.map((t, i) => (
            <div
              key={i}
              style={{
                background: i === 1 ? "#FFE135" : "#F5F0E8",
                border: "2px solid #0A0A0A",
                padding: "10px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <p style={{ fontWeight: 700, fontSize: 16, margin: 0, fontFamily: "Space Mono, monospace" }}>{t.time}</p>
                <p style={{ fontSize: 11, margin: "2px 0 0", color: "#444" }}>
                  Platform {t.platform} · {t.coach}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontFamily: "Space Mono, monospace",
                    fontWeight: 700,
                    fontSize: 16,
                    margin: 0,
                    color: t.confidence >= 90 ? "#007A30" : "#7A5500",
                  }}
                >
                  {t.confidence}%
                </p>
                <p style={{ fontSize: 9, color: "#666", margin: 0, fontFamily: "Space Mono, monospace" }}>ON-TIME</p>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 10, color: "#888", fontFamily: "Space Mono, monospace", margin: "10px 0 0", lineHeight: 1.6 }}>
          ★ HIGHLIGHTED = RECOMMENDED TRAIN
        </p>
      </div>

      {/* Safety Checkpoints */}
      <div className="nb-card" style={{ padding: 16 }}>
        <p style={{ fontFamily: "Space Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", margin: "0 0 12px" }}>
          ◈ SAFETY CHECKPOINTS ON YOUR ROUTE
        </p>
        {CHECKPOINTS.map(cp => (
          <div
            key={cp.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 0",
              borderBottom: cp.id < CHECKPOINTS.length ? "1.5px dashed #ccc" : "none",
            }}
          >
            <span style={{ fontSize: 20 }}>
              {cp.type === "college" ? "🏫" : cp.type === "metro" ? "🚇" : "🚔"}
            </span>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 13, margin: 0 }}>{cp.name}</p>
              <p style={{ fontSize: 10, fontFamily: "Space Mono, monospace", color: "#666", margin: "2px 0 0" }}>{cp.time}</p>
            </div>
            <span
              className="nb-tag"
              style={{
                background: cp.status === "Open" || cp.status === "Staffed" || cp.status === "Active" ? "#00C853" : "#FF1744",
                fontSize: 10,
                color: "#0A0A0A",
              }}
            >
              {cp.status}
            </span>
          </div>
        ))}
      </div>

      {/* Safety Tips */}
      <div className="nb-card-teal" style={{ padding: 16 }}>
        <p style={{ fontFamily: "Space Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", margin: "0 0 12px", color: "#0A0A0A" }}>
          ▸ NIGHT TRAVEL TIPS
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {TIPS.map((tip, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                background: "rgba(0,0,0,0.08)",
                border: "1.5px solid #0A0A0A",
                padding: "9px 11px",
              }}
            >
              <span style={{ fontFamily: "Space Mono, monospace", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p style={{ fontSize: 12, margin: 0, color: "#0A0A0A", lineHeight: 1.5 }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
