import HeatmapLayer from "./HeatmapLayer";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";

function Map({ clients }) {
  const center = [41.26151215293726, 28.742727519870783];
  const zoom = 16;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{
        height: "100%",
      }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <HeatmapLayer clients={clients} />
    </MapContainer>
  );
}

export default Map;
