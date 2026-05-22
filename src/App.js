import { useState, useEffect, useCallback } from 'react';
import './App.css';
import './DetailLigne.css';
import Header from './Header';
import Recherche from './Recherche';
import LigneBus from './LigneBus';
import Footer from './Footer';

function App() {
  const [recherche, setRecherche] = useState("");
  const [ligneSelectionnee, setLigneSelectionnee] = useState(null);
  const [nbRecherches, setNbRecherches] = useState(0);
  const [lignes, setLignes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  const chargerLignes = useCallback(() => {
    setChargement(true);
    setErreur(null);
    fetch("http://localhost:5000/lignes")
      .then(response => {
        if (!response.ok) throw new Error("Erreur serveur : " + response.status);
        return response.json();
      })
      .then(data => { setLignes(data); setChargement(false); })
      .catch(error => { setErreur(error.message); setChargement(false); });
  }, []);

  useEffect(() => { chargerLignes(); }, [chargerLignes]);

  const lignesFiltrees = lignes.filter(l =>
    l.depart.toLowerCase().includes(recherche.toLowerCase()) ||
    l.arrivee.toLowerCase().includes(recherche.toLowerCase()) ||
    l.numero.includes(recherche)
  );

  function handleRecherche(valeur) {
    setRecherche(valeur);
    setNbRecherches(n => n + 1);
  }

  function handleClickLigne(ligne) {
    if (ligneSelectionnee && ligneSelectionnee.id === ligne.id) {
      setLigneSelectionnee(null);
    } else {
      fetch("http://localhost:5000/lignes/" + ligne.id)
        .then(response => response.json())
        .then(data => setLigneSelectionnee(data));
    }
  }

  if (chargement) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <p className="message-chargement">Chargement des lignes...</p>
        </main>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <div className="message-erreur">
            <p>Impossible de charger les lignes.</p>
            <p className="erreur-detail">{erreur}</p>
            <p>Verifiez que le serveur Flask est lance (python api/app.py).</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <p className="compteur-recherche">Vous avez effectue {nbRecherches} recherche{nbRecherches > 1 ? 's' : ''}</p>
        <button className="btn-recharger" onClick={chargerLignes}>Recharger</button>
        <Recherche valeur={recherche} onChange={handleRecherche} />
        <p className="resultat-recherche">
          {lignesFiltrees.length} ligne{lignesFiltrees.length > 1 ? 's' : ''} trouvee{lignesFiltrees.length > 1 ? 's' : ''}
        </p>
        {lignesFiltrees.length === 0 && (
          <p className="aucun-resultat">Aucune ligne trouvee pour cette recherche.</p>
        )}
        {lignesFiltrees.map(ligne => (
          <LigneBus
            key={ligne.id}
            numero={ligne.numero}
            depart={ligne.depart}
            arrivee={ligne.arrivee}
            arrets={ligne.arrets}
            estSelectionnee={ligneSelectionnee && ligneSelectionnee.id === ligne.id}
            onClick={() => handleClickLigne(ligne)}
          />
        ))}
        {ligneSelectionnee && (
          <div className="detail-ligne">
            <h3 className="detail-titre">
              Ligne {ligneSelectionnee.numero} : {ligneSelectionnee.depart} → {ligneSelectionnee.arrivee}
            </h3>
            <p className="detail-info">{ligneSelectionnee.arrets} arrets sur ce trajet</p>
            <div className="detail-arrets">
              <h4>Arrets principaux :</h4>
              <ul className="detail-liste">
                {ligneSelectionnee.listeArrets.map((arret, index) => (
                  <li key={index} className="detail-arret">
                    <span className="arret-numero">{index + 1}</span>
                    <span className="arret-nom">{arret}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
