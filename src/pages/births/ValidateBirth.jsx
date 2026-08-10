import React, { useEffect, useState } from "react";
import { getAllBirths, validateBirth } from "../../api/birthApi";

const ValidateBirth = () => {
  const [identifier, setIdentifier] = useState("");
  const [births, setBirths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

  return (
    <div className="container">

      <h1 className="mb-4">Valider une naissance</h1>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

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
              births.map((b) => (
                <tr key={b.id || b._id || b.actNumber}>
                  <td>{b.id ?? b._id ?? b.actNumber}</td>
                  <td>{b.childFirstname} {b.childLastname}</td>
                  <td>{b.birthDate ? new Date(b.birthDate).toLocaleDateString('fr-FR') : ''}</td>
                  <td>{b.birthPlace}</td>
                  <td>{b.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ValidateBirth;