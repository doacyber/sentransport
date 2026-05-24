import { useState, useEffect } from 'react';
import './Previsions.css';

function Previsions() {
  const [jours, setJours] = useState([]);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    const API_KEY = process.env.REACT_APP_OWM_KEY;
    if (!API_KEY) { setErreur("Cle API manquante"); return; }

    fetch('https://api.openweathermap.org/data/2.5/forecast'
      + '?q=Dakar&appid=' + API_KEY + '&units=metric&lang=fr&cnt=24')
      .then(r => { if (!r.ok) throw new Error("Erreur " + r.status); return r.json(); })
      .then(data => {
        // Un point par jour (toutes les 8 entrees = 24h)
        const filtres = data.list.filter((_, i) => i % 8 === 0).slice(0, 3);
        setJours(filtres.map(item => ({
          date: new Date(item.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }),
          temp: Math.round(item.main.temp),
          description: item.weather[0].description,
          icone: item.weather[0].icon,
        })));
      })
      .catch(err => setErreur(err.message));
  }, []);

  if (erreur) return null;
  if (jours.length === 0) return null;

  return (
    <div className="previsions">
      <h3 className="prev-titre">Previsions 3 prochains jours</h3>
      <div className="prev-liste">
        {jours.map((j, i) => (
          <div key={i} className="prev-item">
            <span className="prev-date">{j.date}</span>
            <img src={'https://openweathermap.org/img/wn/' + j.icone + '.png'} alt={j.description} />
            <span className="prev-temp">{j.temp}°C</span>
            <span className="prev-desc">{j.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Previsions;
