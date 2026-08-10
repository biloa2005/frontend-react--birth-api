import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBirthById, updateBirth } from "../../api/birthApi";

const EditBirth = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getBirthById(id);
        const payload = data?.data ?? data;
        setFormData(payload);
      } catch (err) {
        console.error(err);
        setError("Naissance introuvable");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    // Bloquer si statut APPROVED
    if (formData.status === "APPROVED") {
      setError("Une naissance validée ne peut plus être modifiée");
      setSaving(false);
      return;
    }

    try {
      const res = await updateBirth(id, formData);
      const success = res?.success ?? true;
      const msg = res?.message ?? "Naissance modifiée avec succès";

      if (success) {
        setMessage(msg);
        // rediriger vers la liste
        setTimeout(() => navigate('/tout'), 800);
      } else {
        setError(msg || "Échec de la modification");
      }
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;
      if (status === 400) {
        setError(err.response?.data?.message || "Refus de modification : acte validé");
      } else if (status === 404) {
        setError(err.response?.data?.message || "naissance introuvable");
      } else {
        setError(err?.message || "Erreur interne du serveur");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="container">
      <h1 className="mb-4">Modifier une naissance</h1>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Prénom</label>
            <input className="form-control" name="childFirstname" value={formData.childFirstname || ''} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Nom</label>
            <input className="form-control" name="childLastname" value={formData.childLastname || ''} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Date de naissance</label>
            <input type="date" className="form-control" name="birthDate" value={formData.birthDate ? formData.birthDate.split('T')[0] : ''} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Lieu</label>
            <input className="form-control" name="birthPlace" value={formData.birthPlace || ''} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Sexe</label>
            <select className="form-select" name="sex" value={formData.sex || ''} onChange={handleChange}>
              <option value="">Sélectionner</option>
              <option value="MALE">Masculin</option>
              <option value="FEMALE">Féminin</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Centre</label>
            <input className="form-control" name="centerId" value={formData.centerId || ''} onChange={handleChange} />
          </div>

        </div>

        <h4 className="mt-4 mb-3">Parents</h4>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Nom du père</label>
            <input className="form-control" name="fatherName" value={formData.fatherName || ''} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Nom de la mère</label>
            <input className="form-control" name="motherName" value={formData.motherName || ''} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Profession du père</label>
            <input className="form-control" name="fatherJob" value={formData.fatherJob || ''} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Profession de la mère</label>
            <input className="form-control" name="motherJob" value={formData.motherJob || ''} onChange={handleChange} />
          </div>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
          <button className="btn btn-secondary" type="button" onClick={() => navigate('/tout')}>Annuler</button>
        </div>
      </form>
    </div>
  );
};

export default EditBirth;
