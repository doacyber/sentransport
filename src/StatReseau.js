import './StatReseau.css';

function StatReseau({ lignes }) {
  const totalLignes = lignes.length;
  const totalArrets = lignes.reduce((acc, ligne) => acc + ligne.arrets, 0);
  const ligneMax = lignes.reduce((max, ligne) => ligne.arrets > max.arrets ? ligne : max, lignes[0]);

  return (
    <div className="stat-reseau">
      <div className="stat-item">
        <span className="stat-nombre">{totalLignes}</span>
        <span className="stat-label">Lignes</span>
      </div>
      <div className="stat-item">
        <span className="stat-nombre">{totalArrets}</span>
        <span className="stat-label">Arrêts au total</span>
      </div>
      <div className="stat-item">
        <span className="stat-nombre">{ligneMax.numero}</span>
        <span className="stat-label">Ligne la plus longue</span>
      </div>
    </div>
  );
}

export default StatReseau;
