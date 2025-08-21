const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // raio da Terra em metros

  // converter graus para radianos
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  const deltaLat = (lat2 - lat1) * Math.PI / 180;
  const deltaLon = (lon2 - lon1) * Math.PI / 180;

  // fórmula de Haversine
  const a = Math.sin(deltaLat / 2) ** 2 +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(deltaLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; 
}

// Endpoint para buscar estações próximas
app.get("/stations-nearby", async (req, res) => {
  const { lat, lon, radius = 1000 } = req.query;

  if (!lat || !lon) return res.status(400).json({ error: "Missing lat/lon" });

  try {
    // Pega feed GBFS do Bike Itaú RJ
    const root = "https://riodejaneiro.publicbikesystem.net/customer/gbfs/v2/gbfs.json";
    const { data } = await axios.get(root);
    const feeds = data.data.en.feeds; // pt ou en
    const infoUrl = feeds.find(f => f.name === "station_information").url;
    const statusUrl = feeds.find(f => f.name === "station_status").url;

    const [infoRes, statusRes] = await Promise.all([
      axios.get(infoUrl),
      axios.get(statusUrl)
    ]);

    const stations = infoRes.data.data.stations;
    const statuses = statusRes.data.data.stations;

    // Merge info + status + calcula distância
    const merged = stations.map(station => {
      const status = statuses.find(s => s.station_id === station.station_id);
      const distance = getDistance(parseFloat(lat), parseFloat(lon), station.lat, station.lon);

      return {
        id: station.station_id,
        name: station.name,
        lat: station.lat,
        lon: station.lon,
        capacity: station.capacity,
        bikes_available: status?.num_bikes_available || 0,
        docks_available: status?.num_docks_available || 0,
        status: status?.status || "UNKNOWN",
        distance
      };
    });

    // Filtra por raio e ordena por proximidade
    const nearby = merged
      .filter(s => s.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    res.json({ nearby });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar estações" });
  }
});

app.get("/geocode", async (req, res) => {
  const { q } = req.query;

  if (!q) return res.status(400).json({ error: "Missing query parameter 'q'" });

  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: { q, format: "json" },
      headers: { "User-Agent": "OndeTemBikeApp/1.0" } 
    });

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro na busca por bairro" });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server rodando na porta ${PORT}`);
});
