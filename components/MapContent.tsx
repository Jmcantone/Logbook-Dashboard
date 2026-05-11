"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Aerodrome {
  code: string;
  name: string;
  lat: number;
  lng: number;
  visits: number;
}

interface MapContentProps {
  aerodromes: Aerodrome[];
}

export default function MapContent({ aerodromes }: MapContentProps) {
  // Center on eastern Spain
  const center: [number, number] = [40.1, -0.3];

  return (
    <MapContainer
      center={center}
      zoom={7}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
      />
      {aerodromes.map((ad) => {
        const radius = Math.min(15, 6 + ad.visits * 0.5);
        return (
          <CircleMarker
            key={ad.code}
            center={[ad.lat, ad.lng]}
            radius={radius}
            pathOptions={{
              color: "#3b82f6",
              fillColor: "#3b82f6",
              fillOpacity: 0.6,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-center">
                <strong className="text-sm">{ad.code}</strong>
                <br />
                <span className="text-xs text-gray-600">{ad.name}</span>
                <br />
                <span className="text-xs font-medium">{ad.visits} visits</span>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
