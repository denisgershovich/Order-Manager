import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Map = ({ lat, lng }: { lat: number; lng: number }) => {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        key={`${lat}-${lng}`}
        center={[lat, lng]}
        zoom={13}
        style={{ height: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>Your order</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
