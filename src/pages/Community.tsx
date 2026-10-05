import { useState } from "react";

type Report = {
  id: number;
  user: string;
  route: string;
  status: "Available" | "Limited" | "Unavailable";
  time: string;
  upvotes: number;
};

const INITIAL_REPORTS: Report[] = [
  { id: 1, user: "Priya S.", route: "Andheri → Bandra (Auto)", status: "Limited", time: "7:42 AM", upvotes: 12 },
  { id: 2, user: "Rohan M.", route: "Kurla → Dadar (Metro)", status: "Available", time: "7:50 AM", upvotes: 8 },
  { id: 3, user: "Aisha K.", route: "Borivali → Andheri (Bus)", status: "Unavailable", time: "8:01 AM", upvotes: 23 },
];

const STUDENTS_NEARBY = [
  { name: "Neha T.", route: "Andheri → DJ Sanghvi", time: "8:10 AM", avatar: "NT" },
  { name: "Arjun P.", route: "Andheri → DJ Sanghvi", time: "8:15 AM", avatar: "AP" },
  { name: "Meera R.", route: "Bandra → DJ Sanghvi", time: "7:55 AM", avatar: "MR" },
];

const STATUS_COLORS: Record<Report["status"], string> = {
  Available: "#00C853",
  Limited: "#FFE135",
  Unavailable: "#FF1744",
};

export default function Community() {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [myStatus, setMyStatus] = useState<Report["status"] | null>(null);
  const [myRoute, setMyRoute] = useState("");
  const [upvoted, setUpvoted] = useState<Set<number>>(new Set());
  const [joined, setJoined] = useState<Set<number>>(new Set());

  function submitReport() {
    if (!myStatus || !myRoute.trim()) return;
    const newReport: Report = {
      id: Date.now(),
      user: "You",
      route: myRoute,
      status: myStatus,
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      upvotes: 0,
    };
    setReports(r => [newReport, ...r]);
    setMyRoute("");
    setMyStatus(null);
  }

  function toggleUpvote(id: number) {
    setUpvoted(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setReports(r => r.map(rep => rep.id === id ? { ...rep, upvotes: rep.upvotes - 1 } : rep));
      } else {
        next.add(id);
        setReports(r => r.map(rep => rep.id === id ? { ...rep, upvotes: rep.upvotes + 1 } : rep));
      }
      return next;
    });
  }

  return (
    <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 18 }}>

      {/* Header */}
      <div>
        <p style={{ fontSize: 22, fontWeight: 700, color: "#0A0A0A", margin: 0 }}>Community Intel 👥</p>
        <p style={{ fontSize: 11, color: "#666", fontFamily: "Space Mono, monospace", margin: "4px 0 0" }}>
          REAL-TIME STUDENT TRANSPORT REPORTS
        </p>
      </div>

      {/* Submit Report */}
      <div className="nb-card-yellow" style={{ padding: 16 }}>
        <p style={{ fontFamily: "Space Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", margin: "0 0 12px" }}>
          ▸ REPORT TRANSPORT STATUS
        </p>
        <input
          className="nb-input"
          placeholder="Route (e.g. Andheri → DJ Sanghvi)"
          value={myRoute}
          onChange={e => setMyRoute(e.target.value)}
          style={{ width: "100%", padding: "9px 12px", marginBottom: 10, fontSize: 13 }}
        />
        <div style={{ display: "flex", gap: 0, border: "2.5px solid #0A0A0A", marginBottom: 12 }}>
          {(["Available", "Limited", "Unavailable"] as const).map((s, i) => (
            <button
              key={s}
              className={`nb-toggle ${myStatus === s ? "active" : ""}`}
              style={{
                flex: 1,
                borderLeft: i > 0 ? "2px solid #0A0A0A" : "none",
                borderTop: "none", borderBottom: "none", borderRight: "none",
                padding: "9px 4px",
              }}
              onClick={() => setMyStatus(p => p === s ? null : s)}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          className="nb-btn nb-btn-black"
          style={{ width: "100%", padding: "10px 0", fontSize: 12, letterSpacing: "0.05em", borderRadius: 0 }}
          onClick={submitReport}
          disabled={!myStatus || !myRoute.trim()}
        >
          SUBMIT REPORT ↑
        </button>
      </div>

      {/* Travel Together */}
      <div className="nb-card" style={{ padding: 16 }}>
        <p style={{ fontFamily: "Space Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", margin: "0 0 12px" }}>
          ▸ TRAVEL TOGETHER NEARBY
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {STUDENTS_NEARBY.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                background: "#F5F0E8",
                border: "2px solid #0A0A0A",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  background: ["#FFE135", "#00C2CB", "#FF3CAC"][i],
                  border: "2px solid #0A0A0A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 13,
                  flexShrink: 0,
                  fontFamily: "Space Mono, monospace",
                }}
              >
                {s.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 13, margin: 0 }}>{s.name}</p>
                <p style={{ fontSize: 11, color: "#555", margin: "2px 0 0", fontFamily: "Space Mono, monospace" }}>
                  {s.route} · {s.time}
                </p>
              </div>
              <button
                className="nb-btn"
                style={{
                  fontSize: 11,
                  padding: "6px 12px",
                  borderRadius: 0,
                  background: joined.has(i) ? "#0A0A0A" : "#fff",
                  color: joined.has(i) ? "#FFE135" : "#0A0A0A",
                }}
                onClick={() => setJoined(prev => {
                  const next = new Set(prev);
                  next.has(i) ? next.delete(i) : next.add(i);
                  return next;
                })}
              >
                {joined.has(i) ? "✓ JOINED" : "JOIN"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Live Reports Feed */}
      <div>
        <p style={{ fontFamily: "Space Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", margin: "0 0 12px" }}>
          ▸ LIVE COMMUNITY REPORTS ({reports.length})
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {reports.map(rep => (
            <div
              key={rep.id}
              className="nb-card"
              style={{ padding: "12px 14px" }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span
                      className="nb-tag"
                      style={{
                        background: STATUS_COLORS[rep.status],
                        color: rep.status === "Limited" ? "#0A0A0A" : rep.status === "Available" ? "#0A0A0A" : "#fff",
                        fontSize: 10,
                      }}
                    >
                      {rep.status === "Available" ? "✓" : rep.status === "Limited" ? "⚠" : "✕"} {rep.status.toUpperCase()}
                    </span>
                    <span style={{ fontSize: 10, color: "#888", fontFamily: "Space Mono, monospace" }}>{rep.time}</span>
                  </div>
                  <p style={{ fontWeight: 600, fontSize: 13, margin: 0, color: "#0A0A0A" }}>{rep.route}</p>
                  <p style={{ fontSize: 11, color: "#666", margin: "2px 0 0", fontFamily: "Space Mono, monospace" }}>— {rep.user}</p>
                </div>
                <button
                  onClick={() => toggleUpvote(rep.id)}
                  style={{
                    background: upvoted.has(rep.id) ? "#0A0A0A" : "#fff",
                    border: "2px solid #0A0A0A",
                    boxShadow: "2px 2px 0 #0A0A0A",
                    padding: "5px 9px",
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: "Space Mono, monospace",
                    color: upvoted.has(rep.id) ? "#FFE135" : "#0A0A0A",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                    minWidth: 40,
                    transition: "all 0.1s",
                  }}
                >
                  <span>▲</span>
                  <span>{rep.upvotes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
