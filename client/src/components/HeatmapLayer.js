import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";

function HeatmapLayer({ clients }) {
  const map = useMap();

  useEffect(() => {
    const points = clients?.length ? clients.map((client) => [client.POSITION.X, client.POSITION.Y]) : [];

    const heatLayer = L.heatLayer(points, {
      // minOpacity: 0.5,
      // maxZoom: 16,
      // max: 0.5,
      // radius: 5,
      // blur: 7,
      // gradient: { 0.1: 'blue', 0.3: 'lime', 0.6: 'yellow', 0.6: 'orange', 0.9: 'red' },
      radius: 5,
      blur: 7,
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [clients, map]);
}

export default HeatmapLayer;
