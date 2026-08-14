import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Baby,
  UserRound,
  Building2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { getBirthById, updateBirth } from "../../api/birthApi";

const EditBirth = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    childFirstname: "",
    childLastname: "",
    birthDate: "",
    birthPlace: "",
    sex: "MALE", // Enum: MALE / FEMALE
    centerId: "1",
    fatherName: "",
    motherName: "",
    fatherJob: "",
    motherJob: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getBirthById(id);
        const payload = data?.data || data;
        if (payload) {
          const parents = Array.isArray(payload.parents) ? payload.parents[0] : {};
          const normalizedSex =
            payload.sex === "M" || payload.sex === "MALE"
              ? "MALE"
              : payload.sex === "F" || payload.sex === "FEMALE"
              ? "FEMALE"
              : "MALE";

          setFormData({
            ...payload,
            sex: normalizedSex,
            birthDate: payload.birthDate ? payload.birthDate.substring(0, 10) : "",
            centerId: payload.centerId || "1",
            fatherName: parents?.fatherName || payload.fatherName || "",
            motherName: parents?.motherName || payload.motherName || "",
            fatherJob: parents?.fatherJob || payload.fatherJob || "",
            motherJob: parents?.motherJob || payload.motherJob || "",
          });
        }
      } catch (err) {
        console.warn("API indisponible, pré-remplissage local", err);
        setFormData({
          childFirstname: "Noah Junior",
          childLastname: "KAMGANG",
          birthDate: "2026-08-14",
          birthPlace: "Yaoundé (Hôpital Central)",
          sex: "MALE",
          centerId: "1",
          fatherName: "KAMGANG Michel",
          motherName: "BEKONO Chantal",
          fatherJob: "Ingénieur Télécoms",
          motherJob: "Enseignante",
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const normalizedSex =
        formData.sex === "M" || formData.sex === "MALE"
          ? "MALE"
          : formData.sex === "F" || formData.sex === "FEMALE"
          ? "FEMALE"
          : "MALE";

      const payload = {
        childFirstname: formData.childFirstname.trim(),
        childLastname: formData.childLastname.trim(),
        birthDate: formData.birthDate,
        birthPlace: formData.birthPlace.trim(),
        sex: normalizedSex, // Envoi MALE / FEMALE strict
        centerId: formData.centerId ? String(formData.centerId).trim() : "1",
        fatherName: formData.fatherName ? formData.fatherName.trim() : "",
        motherName: formData.motherName ? formData.motherName.trim() : "",
        fatherJob: formData.fatherJob ? formData.fatherJob.trim() : "",
        motherJob: formData.motherJob ? formData.motherJob.trim() : "",
      };

      await updateBirth(id, payload);
      setMessage("L'acte de naissance a été mis à jour avec succès.");
    } catch (err) {
      console.error("Erreur mise à jour:", err);
      const serverError =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Une erreur est survenue lors de la mise à jour.";
      setError(serverError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fb-edit-page">
      {/* ================= HEADER ================= */}
      <div className="fb-card fb-edit-header-card mb-4">
        <div className="cameroon-flag-bar">
          <span className="flag-green"></span>
          <span className="flag-red"></span>
          <span className="flag-yellow"></span>
        </div>

        <div className="fb-edit-header-content">
          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className="fb-btn fb-btn-secondary p-2"
              onClick={() => navigate(-1)}
              title="Retour"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="fb-page-title">Modifier l'Acte de Naissance</h1>
              <p className="fb-page-desc">
                Modification des données d'état civil (Acte N° {formData.actNumber || `ACT-${id}`})
              </p>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className="fb-card fb-success-banner mb-4 p-3 d-flex align-items-center gap-2">
          <CheckCircle2 size={18} className="text-green" />
          <span className="fw-semibold text-green">{message}</span>
        </div>
      )}

      {error && (
        <div className="fb-card fb-error-banner mb-4 p-3 d-flex align-items-center gap-2">
          <AlertCircle size={18} className="text-red" />
          <span className="fw-semibold text-red">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Informations Enfant */}
        <div className="fb-card p-4 mb-4">
          <div className="fb-form-section-title">
            <Baby size={18} className="text-green" />
            <span>IDENTITÉ DE L'ENFANT</span>
          </div>

          <div className="row g-3">
            <div className="col-12 col-sm-6">
              <label className="fb-form-label">
                Prénom(s) <span className="text-red">*</span>
              </label>
              <input
                type="text"
                className="fb-input"
                name="childFirstname"
                value={formData.childFirstname || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-sm-6">
              <label className="fb-form-label">
                Nom(s) <span className="text-red">*</span>
              </label>
              <input
                type="text"
                className="fb-input"
                name="childLastname"
                value={formData.childLastname || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-sm-6">
              <label className="fb-form-label">
                Sexe <span className="text-red">*</span>
              </label>
              <select
                className="fb-input"
                name="sex"
                value={formData.sex || "MALE"}
                onChange={handleChange}
              >
                <option value="MALE">Masculin (Garçon)</option>
                <option value="FEMALE">Féminin (Fille)</option>
              </select>
            </div>

            <div className="col-12 col-sm-6">
              <label className="fb-form-label">
                Date de naissance <span className="text-red">*</span>
              </label>
              <input
                type="date"
                className="fb-input"
                name="birthDate"
                value={formData.birthDate ? formData.birthDate.substring(0, 10) : ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-sm-8">
              <label className="fb-form-label">
                Lieu de Naissance <span className="text-red">*</span>
              </label>
              <input
                type="text"
                className="fb-input"
                name="birthPlace"
                value={formData.birthPlace || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-sm-4">
              <label className="fb-form-label">Identifiant Centre</label>
              <input
                type="text"
                className="fb-input"
                name="centerId"
                value={formData.centerId || "1"}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Filiation */}
        <div className="fb-card p-4 mb-4">
          <div className="fb-form-section-title">
            <UserRound size={18} className="text-yellow" />
            <span>PARENTS & FILIATION</span>
          </div>

          <div className="row g-3">
            <div className="col-12 col-sm-6">
              <label className="fb-form-label">Nom du Père</label>
              <input
                type="text"
                className="fb-input"
                name="fatherName"
                value={formData.fatherName || ""}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-sm-6">
              <label className="fb-form-label">Profession du Père</label>
              <input
                type="text"
                className="fb-input"
                name="fatherJob"
                value={formData.fatherJob || ""}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-sm-6">
              <label className="fb-form-label">Nom de la Mère</label>
              <input
                type="text"
                className="fb-input"
                name="motherName"
                value={formData.motherName || ""}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-sm-6">
              <label className="fb-form-label">Profession de la Mère</label>
              <input
                type="text"
                className="fb-input"
                name="motherJob"
                value={formData.motherJob || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="d-flex gap-2 justify-content-end mb-4">
          <button
            type="button"
            className="fb-btn fb-btn-secondary"
            onClick={() => navigate(-1)}
          >
            Annuler
          </button>

          <button
            type="submit"
            className="fb-btn fb-btn-green"
            disabled={saving}
          >
            {saving ? (
              <>
                <RefreshCw size={16} className="spin" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Mettre à jour l'acte</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* ================= STYLES ================= */}
      <style>{`
        .fb-edit-page {
          max-width: 860px;
          margin: 0 auto;
        }

        .fb-edit-header-card {
          background: #ffffff;
          overflow: hidden;
        }

        .fb-edit-header-content {
          padding: 18px 24px;
        }
      `}</style>
    </div>
  );
};

export default EditBirth;