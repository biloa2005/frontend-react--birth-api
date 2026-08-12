import React, { useEffect, useState } from "react";
import { getAllBirths, validateBirth } from "../../api/birthApi";

const ValidateBirth = () => {
  const [identifier, setIdentifier] = useState("");
  const [births, setBirths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  const loadBirths = async () => {
    try {
      const data = await getAllBirths();
      // Attente que l'API retourne un tableau. Adapter suivant le shape réel.
      const list = data?.allBirth ?? data?.births ?? data ?? [];
      // On garde les naissances non approuvées
      setBirths(list.filter((b) => b.status !== "APPROVED"));
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les naissances.");
    }
  };

  useEffect(() => {
    loadBirths();
  }, []);

  const handleValidate = async (e) => {
    e.preventDefault();

    if (!identifier.trim()) {
      setError("Veuillez saisir l'identifiant de la naissance.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await validateBirth(identifier.trim());

      // Res expected: { success: true, message: 'Acte validé avec succès', data: { id, status }}
      const success = res?.success ?? true;
      const msg = res?.message ?? "Acte validé avec succès";

      if (success) {
        setMessage(msg);
        // Mettre à jour la liste locale : retirer ou marquer comme APPROVED
        setBirths((prev) => prev.filter((b) => b.id !== (res?.data?.id ?? identifier.trim())));
      } else {
        setError(msg || "Échec de la validation.");
      }

    } catch (err) {
      console.error(err);

      const status = err?.response?.status;

      if (status === 400) {
        setError(err.response?.data?.message || "Cette naissance est déjà validée");
      } else if (status === 404) {
        setError(err.response?.data?.message || "Naissance introuvable");
      } else if (status === 500) {
        setError("Erreur interne du serveur");
      } else {
        setError(err.message || "Erreur réseau");
      }

    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (id) => {
    if (!id) return;
    try {
      await navigator.clipboard.writeText(String(id));
      setCopyMessage(`ID ${id} copié dans le presse-papiers`);
      setTimeout(() => setCopyMessage(""), 3000);
    } catch (err) {
      console.error('Copy failed', err);
      setCopyMessage("Impossible de copier l'ID");
      setTimeout(() => setCopyMessage(""), 3000);
    }
  };

  return (
    <div className="container">

      <h1 className="mb-4">Valider une naissance</h1>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {copyMessage && <div className="alert alert-info">{copyMessage}</div>}

      <form onSubmit={handleValidate} className="mb-4">
        <div className="row g-2 align-items-end">
          <div className="col-md-8">
            <label className="form-label">Identifiant de la naissance</label>
            <input
              className="form-control"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Ex: clhb123456"
            />
          </div>

          <div className="col-md-4 d-flex gap-2">
            <button className="btn btn-success w-100" type="submit" disabled={loading}>
              {loading ? "Validation..." : "Valider"}
            </button>
          </div>
        </div>
      </form>

      <h5 className="mb-3">Naissances en attente</h5>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Enfant</th>
              <th>Date</th>
              <th>Lieu</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {births.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">Aucune naissance à valider</td>
              </tr>
            ) : (
              births.map((b) => {
                const rowId = b.id ?? b._id ?? b.actNumber;
                return (
                  <tr key={rowId}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span>{rowId}</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => handleCopy(rowId)}
                          title="Copier l'ID"
                          aria-label={`Copier l'ID ${rowId}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M10 1.5H4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5zM4 0h6a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1z"/>
                            <path d="M9 3.5H3a.5.5 0 0 0-.5.5V13a1 1 0 0 0 1 1h7.5a.5.5 0 0 0 .5-.5V4a.5.5 0 0 0-.5-.5H9z"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td>{b.childFirstname} {b.childLastname}</td>
                    <td>{b.birthDate ? new Date(b.birthDate).toLocaleDateString('fr-FR') : ''}</td>
                    <td>{b.birthPlace}</td>
                    <td>{b.status}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ValidateBirth;