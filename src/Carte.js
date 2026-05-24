import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Carte.css';

// Icone bleue par defaut
const iconeNormale = new L.Icon({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Icone orange pour l'arret le plus proche
const iconeProche = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function calculerDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) *
    Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Exercice 2 - bouton centrer
function BoutonCentrer({ position }) {
  const map = useMap();
  if (!position) return null;
  return (
    <button className="btn-centrer" onClick={() => map.setView(position, 15)}>
      📍 Centrer sur ma position
    </button>
  );
}

function Carte() {
  const [arrets, setArrets] = useState([]);
  const [positionUtilisateur, setPositionUtilisateur] = useState(null);
  const [arretProche, setArretProche] = useState(null);
  const [top3, setTop3] = useState([]);

  const DAKAR = [14.6928, -17.4467];

  useEffect(() => {
    fetch("http://localhost:5000/arrets")
      .then(r => r.json())
      .then(data => setArrets(data))
      .catch(err => console.error("Erreur arrets:", err));
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setPositionUtilisateur([pos.coords.latitude, pos.coords.longitude]),
        () => console.log("Geolocation refusee")
      );
    }
  }, []);

  useEffect(() => {
    if (positionUtilisateur && arrets.length > 0) {
      const avecDistance = arrets.map(a => ({
        ...a,
        distance: calculerDistance(positionUtilisateur[0], positionUtilisateur[1], a.lat, a.lon)
      }));
      avecDistance.sort((a, b) => a.distance - b.distance);
      setArretProche(avecDistance[0]);
      setTop3(avecDistance.slice(0, 3));
    }
  }, [positionUtilisateur, arrets]);

  return (
    <div className="carte-container">
      <h2 className="carte-titre">Carte des arrets</h2>

      {top3.length > 0 && (
        <div className="top3-container">
          <h4 className="top3-titre">3 arrets les plus proches :</h4>
          <ul className="top3-liste">
            {top3.map((a, i) => (
              <li key={a.id} className="top3-item">
                <span className="top3-rang">{i + 1}</span>
                <strong>{a.nom}</strong> — {a.distance.toFixed(1)} km
              </li>
            ))}
          </ul>
        </div>
      )}

      {arretProche && (
        <p className="arret-proche">
          Arret le plus proche : <strong>{arretProche.nom}</strong>
          {" "}({arretProche.distance.toFixed(1)} km)
        </p>
      )}

      <div style={{position: 'relative'}}>
        <MapContainer center={DAKAR} zoom={13} className="carte">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap"
          />
          {arrets.map(a => (
            <Marker
              key={a.id}
              position={[a.lat, a.lon]}
              icon={arretProche && arretProche.id === a.id ? iconeProche : iconeNormale}
            >
              <Popup>
                <strong>{a.nom}</strong><br />
                Lignes : {a.lignes.join(", ")}
                {arretProche && arretProche.id === a.id && <><br /><em>⭐ Arret le plus proche</em></>}
              </Popup>
            </Marker>
          ))}
          {positionUtilisateur && (
            <Marker position={positionUtilisateur} icon={iconeNormale}>
              <Popup>Vous etes ici</Popup>
            </Marker>
          )}
          <BoutonCentrer position={positionUtilisateur} />
        </MapContainer>
      </div>
    </div>
  );
}

export default Carte;
