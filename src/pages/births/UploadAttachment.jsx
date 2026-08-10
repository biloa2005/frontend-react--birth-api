import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { uploadBirthAttachment } from "../../api/birthApi";

const UploadAttachment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!file) {
      setError("Veuillez sélectionner un fichier.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await uploadBirthAttachment(id, formData);
      setMessage(response?.message ?? "Pièce jointe ajoutée avec succès");
      setTimeout(() => navigate("/tout"), 1200);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.message || "Erreur lors de l'upload";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="mb-4">Ajouter une pièce jointe</h1>

      <div className="mb-3">
        <strong>ID de naissance :</strong> {id}
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Fichier</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-success" type="submit" disabled={loading}>
            {loading ? "Téléversement..." : "Ajouter la pièce jointe"}
          </button>
          <button className="btn btn-secondary" type="button" onClick={() => navigate("/tout")}>Retour</button>
        </div>
      </form>
    </div>
  );
};

export default UploadAttachment;
