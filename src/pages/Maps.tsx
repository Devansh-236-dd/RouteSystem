import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Fix default icon issue with Vite
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Mumbai area coordinates
const LOCATIONS: Record<string, { name: string; lat: number; lng: number }> = {
  andheri: { name: "Andheri East", lat: 19.1136, lng: 72.8697 },
  bandra: { name: "Bandra West", lat: 19.0544, lng: 72.8408 },
  dadar: { name: "Dadar", lat: 19.0178, lng: 72.8478 },
  churchgate: { name: "Churchgate", lat: 18.9322, lng: 72.8264 },
  borivali: { name: "Borivali", lat: 19.2307, lng: 72.8567 },
  kurla: { name: "Kurla", lat: 19.0728, lng: 72.8826 },
  thane: { name: "Thane", lat: 19.2183, lng: 72.9781 },
  college: { name: "DJ Sanghvi College", lat: 19.1045, lng: 72.8370 },
};

type LocationKey = keyof typeof LOCATIONS;

type Route = {
  id: string;
  name: string;
  mode: string;
  color: string;
  confidence: number;
  eta: number;
  cost: number;
  description: string;
  coords: [number, number][];
  issues: string[];
};

function buildRoutes(from: LocationKey, to: LocationKey): Route[] {
  const origin = LOCATIONS[from];
  const dest = LOCATIONS[to];

  const midLat1 = (origin.lat + dest.lat) / 2 + 0.01;
  const midLng1 = (origin.lng + dest.lng) / 2 + 0.008;
  const midLat2 = (origin.lat + dest.lat) / 2 - 0.008;
  const midLng2 = (origin.lng + dest.lng) / 2 + 0.018;
  const midLat3 = (origin.lat + dest.lat) / 2 + 0.005;
  const midLng3 = (origin.lng + dest.lng) / 2 - 0.01;

  const dist = Math.sqrt(
    Math.pow((dest.lat - origin.lat) * 111, 2) +
    Math.pow((dest.lng - origin.lng) * 85, 2)
  );

  return [
    {
      id: "r1",
      name: "Metro + Walk",
      mode: "🚇 🚶",
      color: "#2D6BE4",
      confidence: 89,
      eta: Math.round(dist * 3.2 + 12),
      cost: Math.round(dist * 6 + 20),
      description: "Fastest option. Metro Line 2A from nearest station, 6-min walk at destination.",
      coords: [
        [origin.lat, origin.lng],
        [midLat1, midLng1],
        [dest.lat, dest.lng],
      ],
      issues: [],
    },
    {
      id: "r2",
      name: "Auto + Local Train",
      mode: "🚖 🚆",
      color: "#FF6B35",
      confidence: 74,
      eta: Math.round(dist * 3.8 + 18),
      cost: Math.round(dist * 5 + 15),
      description: "Auto-rickshaw to station, then Western Railway local. Crowded at peak hours.",
      coords: [
        [origin.lat, origin.lng],
        [midLat2, midLng2],
        [dest.lat, dest.lng],
      ],
      issues: ["🚖 Rickshaws may be limited"],
    },
    {
      id: "r3",
      name: "Bus Direct",
      mode: "🚌",
      color: "#00C853",
      confidence: 61,
      eta: Math.round(dist * 4.5 + 22),
      cost: Math.round(dist * 2 + 10),
      description: "BEST bus — cheapest but slowest. Route 302/405 direct.",
      coords: [
        [origin.lat, origin.lng],
        [midLat3, midLng3],
        [dest.lat, dest.lng],
      ],
      issues: ["🚦 Traffic delays possible"],
    },
  ];
}

function ConfBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="conf-bar-wrap" style={{ flex: 1 }}>
      <div
        className="conf-bar"
        style={{
          width: `${value}%`,
          background: value >= 80 ? "#00C853" : value >= 65 ? "#FFE135" : "#FF6B35",
        }}
      />
    </div>
  );
}

function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 13, { duration: 0.8 });
  }, [lat, lng, map]);
  return null;
}

function MapBounds({ routes, from, to }: { routes: Route[]; from: LocationKey; to: LocationKey }) {
  const map = useMap();
  useEffect(() => {
    const origin = LOCATIONS[from];
    const dest = LOCATIONS[to];
    const bounds = L.latLngBounds([
      [origin.lat, origin.lng],
      [dest.lat, dest.lng],
    ]);
    routes.forEach(r => r.coords.forEach(c => bounds.extend(c)));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [routes, from, to, map]);
  return null;
}

const customIcon = (color: string) =>
  L.divIcon({
    html: `<div style="width:14px;height:14px;background:${color};border:3px solid #0A0A0A;box-shadow:2px 2px 0 #0A0A0A;"></div>`,
    className: "",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

const destIcon = L.divIcon({
  html: `<div style="width:18px;height:18px;background:#FFE135;border:3px solid #0A0A0A;box-shadow:3px 3px 0 #0A0A0A;transform:rotate(45deg);"></div>`,
  className: "",
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export default function Maps() {
  const [from, setFrom] = useState<LocationKey>("andheri");
  const [to, setTo] = useState<LocationKey>("college");
  const [departTime, setDepartTime] = useState("08:00");
  const [arriveTime, setArriveTime] = useState("09:00");
  const [selectedRoute, setSelectedRoute] = useState("r1");
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState<Route[]>(() => buildRoutes("andheri", "college"));
  const [searched, setSearched] = useState(true);

  const handleSearch = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setRoutes(buildRoutes(from, to));
      setSelectedRoute("r1");
      setLoading(false);
      setSearched(true);
    }, 900);
  }, [from, to]);

  const active = routes.find(r => r.id === selectedRoute) ?? routes[0];
  const origin = LOCATIONS[from];
  const dest = LOCATIONS[to];

  const locOptions = Object.entries(LOCATIONS);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 130px)", overflow: "hidden" }}>

      {/* Top controls */}
      <div style={{ background: "#0A0A0A", padding: "14px 16px", borderBottom: "2.5px solid #0A0A0A" }}>
        <p style={{ color: "#FFE135", fontFamily: "Space Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", margin: "0 0 12px" }}>
          ◈ ROUTE PLANNER
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
          {/* From */}
          <div>
            <label style={{ color: "#aaa", fontSize: 10, fontFamily: "Space Mono, monospace", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>FROM</label>
            <select
              className="nb-input"
              value={from}
              onChange={e => setFrom(e.target.value as LocationKey)}
              style={{ width: "100%", padding: "8px 10px", fontSize: 13, background: "#1A1A1A", color: "#FFE135", border: "2px solid #FFE135" }}
            >
              {locOptions.map(([key, loc]) => (
                <option key={key} value={key} style={{ background: "#1A1A1A" }}>{loc.name}</option>
              ))}
            </select>
          </div>

          {/* To */}
          <div>
            <label style={{ color: "#aaa", fontSize: 10, fontFamily: "Space Mono, monospace", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>TO</label>
            <select
              className="nb-input"
              value={to}
              onChange={e => setTo(e.target.value as LocationKey)}
              style={{ width: "100%", padding: "8px 10px", fontSize: 13, background: "#1A1A1A", color: "#FFE135", border: "2px solid #FFE135" }}
            >
              {locOptions.map(([key, loc]) => (
                <option key={key} value={key} style={{ background: "#1A1A1A" }}>{loc.name}</option>
              ))}
            </select>
          </div>

          {/* Depart */}
          <div>
            <label style={{ color: "#aaa", fontSize: 10, fontFamily: "Space Mono, monospace", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>DEPART</label>
            <input
              type="time"
              className="nb-input"
              value={departTime}
              onChange={e => setDepartTime(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", fontSize: 13, background: "#1A1A1A", color: "#FFE135", border: "2px solid #FFE135", colorScheme: "dark" }}
            />
          </div>

          {/* Arrive by */}
          <div>
            <label style={{ color: "#aaa", fontSize: 10, fontFamily: "Space Mono, monospace", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>ARRIVE BY</label>
            <input
              type="time"
              className="nb-input"
              value={arriveTime}
              onChange={e => setArriveTime(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", fontSize: 13, background: "#1A1A1A", color: "#FFE135", border: "2px solid #FFE135", colorScheme: "dark" }}
            />
          </div>
        </div>

        <button
          className="nb-btn nb-btn-yellow"
          style={{ width: "100%", padding: "11px 0", fontSize: 13, letterSpacing: "0.05em", borderRadius: 0 }}
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "COMPUTING ROUTES..." : "◈ FIND ALL ROUTES"}
        </button>
      </div>

      {/* Map */}
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        <MapContainer
          center={[origin.lat, origin.lng]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {searched && <MapBounds routes={routes} from={from} to={to} />}
          {routes.map(route => (
            <Polyline
              key={route.id}
              positions={route.coords}
              pathOptions={{
                color: route.id === selectedRoute ? route.color : "#aaa",
                weight: route.id === selectedRoute ? 5 : 2.5,
                opacity: route.id === selectedRoute ? 1 : 0.45,
                dashArray: route.id === selectedRoute ? undefined : "6 4",
              }}
              eventHandlers={{ click: () => setSelectedRoute(route.id) }}
            />
          ))}
          <Marker position={[origin.lat, origin.lng]} icon={customIcon("#2D6BE4")}>
            <Popup>{LOCATIONS[from].name} (Start)</Popup>
          </Marker>
          <Marker position={[dest.lat, dest.lng]} icon={destIcon}>
            <Popup>{LOCATIONS[to].name} (Destination)</Popup>
          </Marker>
        </MapContainer>

        {/* Map legend overlay */}
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1000,
            background: "#0A0A0A",
            border: "2px solid #FFE135",
            padding: "8px 10px",
            fontFamily: "Space Mono, monospace",
          }}
        >
          <p style={{ color: "#FFE135", fontSize: 9, fontWeight: 700, margin: "0 0 6px", letterSpacing: "0.08em" }}>ROUTES</p>
          {routes.map(r => (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, cursor: "pointer" }} onClick={() => setSelectedRoute(r.id)}>
              <div style={{ width: 16, height: 4, background: r.id === selectedRoute ? r.color : "#555", boxShadow: r.id === selectedRoute ? `0 0 4px ${r.color}` : "none" }} />
              <span style={{ color: r.id === selectedRoute ? "#fff" : "#aaa", fontSize: 9 }}>{r.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Route cards */}
      <div
        style={{
          background: "#F5F0E8",
          borderTop: "2.5px solid #0A0A0A",
          padding: "14px 14px 14px",
          overflowY: "auto",
          maxHeight: 280,
        }}
      >
        <p style={{ fontFamily: "Space Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", margin: "0 0 10px", color: "#0A0A0A" }}>
          ALL POSSIBLE ROUTES — CONFIDENCE SCORES
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {routes.map(route => {
            const isActive = route.id === selectedRoute;
            return (
              <div
                key={route.id}
                className={isActive ? "route-card-active" : "route-card-inactive"}
                style={{ padding: "12px 14px", cursor: "pointer" }}
                onClick={() => setSelectedRoute(route.id)}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{route.mode}</span>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, margin: 0, color: "#0A0A0A" }}>{route.name}</p>
                      <p style={{ fontSize: 11, margin: 0, color: "#555", fontFamily: "Space Mono, monospace" }}>
                        {route.eta} MIN · ₹{route.cost}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        margin: 0,
                        color: route.confidence >= 80 ? "#007A30" : route.confidence >= 65 ? "#7A5500" : "#B31412",
                        fontFamily: "Space Mono, monospace",
                      }}
                    >
                      {route.confidence}%
                    </p>
                    <p style={{ fontSize: 9, margin: 0, fontFamily: "Space Mono, monospace", color: "#666" }}>CONFIDENCE</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <ConfBar value={route.confidence} color={route.color} />
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      background: route.color,
                      border: "2px solid #0A0A0A",
                      flexShrink: 0,
                    }}
                  />
                </div>

                <p style={{ fontSize: 11, color: "#444", margin: 0, fontFamily: "Space Mono, monospace", lineHeight: 1.5 }}>
                  {route.description}
                </p>

                {route.issues.length > 0 && (
                  <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {route.issues.map((issue, i) => (
                      <span
                        key={i}
                        className="nb-tag"
                        style={{ background: "#FF1744", color: "#fff", fontSize: 10 }}
                      >
                        {issue}
                      </span>
                    ))}
                  </div>
                )}

                {isActive && (
                  <div
                    style={{
                      marginTop: 10,
                      background: "#0A0A0A",
                      padding: "6px 10px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: "#FFE135", fontSize: 10, fontFamily: "Space Mono, monospace", fontWeight: 700 }}>
                      ◈ SELECTED ROUTE
                    </span>
                    <span style={{ color: "#aaa", fontSize: 10, fontFamily: "Space Mono, monospace" }}>
                      DEPART {departTime}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
