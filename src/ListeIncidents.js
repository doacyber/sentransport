import { useState, useEffect } from 'react';
import './ListeIncidents.css';

function ListeIncidents() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/incidents")
      .then(r => r.json())
      .then(data => setIncidents(data))
      .catch(err => console.error("Erreur incidents:", err));
  }, []);

  if (incidents.length === 0) {
    return (
      <div className="liste-incidents">
        <h2 className="liste-titre">Incidents signales</h2>
        <p className="liste-vide">Aucun incident signale pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="liste-incidents">
      <h2 className="liste-titre">Incidents signales ({incidents.length})</h2>
      <ul className="liste-ul">
        {incidents.map(i => (
          <li key={i.id} className="liste-item">
            <span className="liste-ligne">Ligne {i.ligne}</span>
            <span className="liste-lieu">{i.lieu}</span>
            <span className="liste-desc">{i.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListeIncidents;
