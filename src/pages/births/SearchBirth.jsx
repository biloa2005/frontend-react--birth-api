import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchBirthByActNumber, validateBirth, deleteBirth, printBirth } from "../../api/birthApi";

const SearchBirth = () => {
  const navigate = useNavigate();
  const [actNumber, setActNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setActionMessage("");
    setActionError("");

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

  const handleValidate = async () => {
    if (!result?.id) return;
    setActionLoading(true);
    setActionMessage("");
    setActionError("");

    try {
      const res = await validateBirth(result.id);
      if (res?.success) {
        setResult((prev) => ({ ...prev, status: "APPROVED" }));
        setActionMessage(res.message || "Acte validé avec succès.");
      } else {
        setActionError(res?.message || "Impossible de valider l'acte.");
      }
    } catch (err) {
      console.error(err);
      setActionError(err?.response?.data?.message || err.message || "Erreur lors de la validation.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!result?.id) return;
    if (!window.confirm("Confirmer la suppression de cet acte non validé ?")) return;

    setActionLoading(true);
    setActionMessage("");
    setActionError("");

    try {
      const res = await deleteBirth(result.id);
      if (res?.success) {
        setResult(null);
        setActionMessage(res.message || "Acte supprimé avec succès.");
      } else {
        setActionError(res?.message || "Impossible de supprimer l'acte.");
      }
    } catch (err) {
      console.error(err);
      setActionError(err?.response?.data?.message || err.message || "Erreur lors de la suppression.");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePrint = async () => {
    if (!result?.id) return;
    setActionLoading(true);
    setActionMessage("");
    setActionError("");

    try {
      const blobData = await printBirth(result.id);
      const blob = new Blob([blobData], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${result.actNumber || result.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setActionMessage("Téléchargement du PDF lancé.");
    } catch (err) {
      console.error(err);
      setActionError(err?.response?.data?.message || err.message || "Erreur lors de l'impression.");
    } finally {
      setActionLoading(false);
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

            <div className="mt-3 d-flex flex-wrap gap-2">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => navigate(`/births/${result.id}/edit`)}
                disabled={actionLoading}
              >
                Modifier
              </button>

              {result.status === "PENDING" && (
                <button
                  className="btn btn-sm btn-danger"
                  onClick={handleDelete}
                  disabled={actionLoading}
                >
                  Supprimer
                </button>
              )}

              {result.status !== "APPROVED" && (
                <button
                  className="btn btn-sm btn-success"
                  onClick={handleValidate}
                  disabled={actionLoading}
                >
                  Valider
                </button>
              )}

              <button
                className="btn btn-sm btn-secondary"
                onClick={handlePrint}
                disabled={actionLoading}
              >
                Imprimer
              </button>
            </div>

            {(actionMessage || actionError) && (
              <div className="mt-3">
                {actionMessage && <div className="alert alert-success">{actionMessage}</div>}
                {actionError && <div className="alert alert-danger">{actionError}</div>}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default SearchBirth;
