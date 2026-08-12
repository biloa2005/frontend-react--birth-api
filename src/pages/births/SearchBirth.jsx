import React, { useState } from "react";
import { searchBirthByActNumber } from "../../api/birthApi";

const SearchBirth = () => {
  const [actNumber, setActNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!actNumber.trim()) {
      setError("Veuillez saisir un numéro d'acte.");
      return;
    }

    setLoading(true);
    try {
      const res = await searchBirthByActNumber(actNumber.trim());
      if (res?.success) {
        setResult(res.data ?? null);
      } else {
        setError(res?.message || "Aucun acte trouvé.");
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || "Erreur lors de la recherche.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="mb-4">Rechercher une naissance</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSearch} className="mb-4">
        <div className="row g-2 align-items-end">
          <div className="col-md-8">
            <label className="form-label">Numéro d'acte</label>
            <input
              className="form-control"
              value={actNumber}
              onChange={(e) => setActNumber(e.target.value)}
              placeholder="Ex: YAO05-2026-000001"
            />
          </div>
          <div className="col-md-4 d-flex gap-2">
            <button className="btn btn-primary w-100" type="submit" disabled={loading}>
              {loading ? 'Recherche...' : 'Rechercher'}
            </button>
          </div>
        </div>
      </form>

      {result && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Acte trouvé</h5>
            <p><strong>ID :</strong> {result.id}</p>
            <p><strong>Numéro d'acte :</strong> {result.actNumber}</p>

            <div>
              <strong>Parents :</strong>
              {Array.isArray(result.parents) && result.parents.length > 0 ? (
                <ul>
                  {result.parents.map((p, i) => {
                    const name = p.firstname || p.name
                      ? `${p.firstname ?? p.name}${p.lastname ? ' ' + p.lastname : ''}`
                      : `Parent ${i+1}`;
                    const profession = p.job ?? p.occupation ?? p.profession ?? p.metier ?? null;
                    return <li key={i}>{name}{profession ? ` — ${profession}` : ''}</li>;
                  })}
                </ul>
              ) : (
                <div>Aucun parent renseigné</div>
              )}
            </div>

            <div>
              <strong>Pièces jointes :</strong>
              {Array.isArray(result.attachments) && result.attachments.length > 0 ? (
                <ul>
                  {result.attachments.map((a, i) => (
                    <li key={i}>{a.filename ?? a.name ?? `Fichier ${i+1}`}</li>
                  ))}
                </ul>
              ) : (
                <div>Aucune pièce jointe</div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SearchBirth;
