import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBirth } from "../../api/birthApi";

import {
  Baby,
  UserRound,
  MapPin,
  CalendarDays,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  AlertCircle,
  Save,
  Printer,
  Sparkles,
  Eye,
  RefreshCw,
  User,
} from "lucide-react";

const CreateBirth = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    childFirstname: "",
    childLastname: "",
    birthDate: "",
    birthPlace: "",
    sex: "MALE", // Enum Prisma: MALE ou FEMALE
    centerId: "1",
    fatherName: "",
    motherName: "",
    fatherJob: "",
    motherJob: "",
  });

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessData(null);
    setSuccessMessage("");

    // Validations client
    if (!formData.childFirstname.trim() || !formData.childLastname.trim()) {
      setError("Veuillez renseigner le nom et le prénom de l'enfant.");
      setLoading(false);
      return;
    }

    if (!formData.birthDate) {
      setError("Veuillez renseigner la date de naissance.");
      setLoading(false);
      return;
    }

    if (!formData.birthPlace.trim()) {
      setError("Veuillez renseigner le lieu de naissance.");
      setLoading(false);
      return;
    }

    try {
      // Normalisation du sexe selon l'Enum Prisma (MALE / FEMALE)
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
        sex: normalizedSex, // Envoi strict de "MALE" ou "FEMALE"
        centerId: formData.centerId ? String(formData.centerId).trim() : "1",
        fatherName: formData.fatherName ? formData.fatherName.trim() : "",
        motherName: formData.motherName ? formData.motherName.trim() : "",
        fatherJob: formData.fatherJob ? formData.fatherJob.trim() : "",
        motherJob: formData.motherJob ? formData.motherJob.trim() : "",
      };

      const res = await createBirth(payload);
      const data = res?.data ?? res;

      const actNo = data?.actNumber ?? data?.id ?? "Enregistré";
      setSuccessMessage(`Naissance enregistrée avec succès. Numéro d'acte : ${actNo}`);
      setSuccessData(data || { ...payload, id: Date.now(), actNumber: actNo });

      // Réinitialisation du formulaire après succès
      setFormData({
        childFirstname: "",
        childLastname: "",
        birthDate: "",
        birthPlace: "",
        sex: "MALE",
        centerId: "1",
        fatherName: "",
        motherName: "",
        fatherJob: "",
        motherJob: "",
      });
    } catch (err) {
      console.error("Erreur création naissance:", err);

      const serverError =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Une erreur est survenue lors de l'enregistrement de l'acte.";

      setError(serverError);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      childFirstname: "",
      childLastname: "",
      birthDate: "",
      birthPlace: "",
      sex: "MALE",
      centerId: "1",
      fatherName: "",
      motherName: "",
      fatherJob: "",
      motherJob: "",
    });
    setSuccessData(null);
    setSuccessMessage("");
    setError("");
  };

  return (
    <div className="fb-create-page">
      {/* ================= HEADER ================= */}
      <div className="fb-card fb-create-header-card mb-4">
        <div className="cameroon-flag-bar">
          <span className="flag-green"></span>
          <span className="flag-red"></span>
          <span className="flag-yellow"></span>
        </div>

        <div className="fb-create-header-content">
          <div className="d-flex align-items-center gap-3">
            <div className="fb-create-icon-box">
              <Baby size={24} className="text-green" />
            </div>
            <div>
              <h1 className="fb-page-title">Déclaration & Enregistrement d'un Acte</h1>
              <p className="fb-page-desc">
                Saisie officielle des informations du nouveau-né et de la filiation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MESSAGE DE SUCCÈS ================= */}
      {successMessage && (
        <div className="fb-card fb-success-banner mb-4">
          <div className="fb-success-top">
            <div className="fb-success-badge">
              <CheckCircle2 size={24} className="text-green" />
            </div>
            <div>
              <h4 className="mb-1 text-green fw-bold">Acte de naissance enregistré avec succès !</h4>
              <p className="mb-0 text-muted">{successMessage}</p>
            </div>
          </div>

          <div className="d-flex gap-2 mt-3 flex-wrap">
            {successData?.id && (
              <button
                type="button"
                className="fb-btn fb-btn-red"
                onClick={() => navigate(`/births/${successData.id}/print`)}
              >
                <Printer size={16} />
                <span>Imprimer le certificat</span>
              </button>
            )}

            <button
              type="button"
              className="fb-btn fb-btn-green"
              onClick={() => navigate("/tout")}
            >
              <Eye size={16} />
              <span>Voir dans le registre</span>
            </button>

            <button
              type="button"
              className="fb-btn fb-btn-secondary"
              onClick={resetForm}
            >
              <RefreshCw size={16} />
              <span>Nouvel enregistrement</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= MESSAGE D'ERREUR ================= */}
      {error && (
        <div className="fb-card fb-error-banner mb-4">
          <AlertCircle size={22} className="text-red flex-shrink-0" />
          <div>
            <strong>Erreur lors de l'enregistrement :</strong>
            <p className="mb-0 small">{error}</p>
          </div>
        </div>
      )}

      {/* ================= FORMULAIRE & APERÇU ================= */}
      <div className="row g-4">
        {/* Colonne Formulaire (Gauche) */}
        <div className="col-12 col-lg-7">
          <form onSubmit={handleSubmit}>
            {/* 1. Informations Enfant */}
            <div className="fb-card fb-form-section mb-4">
              <div className="fb-form-section-title">
                <Baby size={18} className="text-green" />
                <span>1. IDENTITÉ DU NOUVEAU-NÉ</span>
              </div>

              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <label className="fb-form-label">
                    Prénom(s) de l'enfant <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    className="fb-input"
                    name="childFirstname"
                    placeholder="Ex: Noah Junior"
                    value={formData.childFirstname}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 col-sm-6">
                  <label className="fb-form-label">
                    Nom(s) de famille <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    className="fb-input"
                    name="childLastname"
                    placeholder="Ex: KAMGANG"
                    value={formData.childLastname}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 col-sm-6">
                  <label className="fb-form-label">
                    Sexe de l'enfant <span className="text-red">*</span>
                  </label>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className={`fb-sex-btn ${
                        formData.sex === "MALE" || formData.sex === "M" ? "active-m" : ""
                      }`}
                      onClick={() => setFormData((p) => ({ ...p, sex: "MALE" }))}
                    >
                      <span>♂ Masculin (Garçon)</span>
                    </button>
                    <button
                      type="button"
                      className={`fb-sex-btn ${
                        formData.sex === "FEMALE" || formData.sex === "F" ? "active-f" : ""
                      }`}
                      onClick={() => setFormData((p) => ({ ...p, sex: "FEMALE" }))}
                    >
                      <span>♀ Féminin (Fille)</span>
                    </button>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <label className="fb-form-label">
                    Date de naissance <span className="text-red">*</span>
                  </label>
                  <input
                    type="date"
                    className="fb-input"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 col-sm-8">
                  <label className="fb-form-label">
                    Lieu précis de naissance <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    className="fb-input"
                    name="birthPlace"
                    placeholder="Ex: Hôpital Central de Yaoundé"
                    value={formData.birthPlace}
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
                    placeholder="Ex: 1"
                    value={formData.centerId}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* 2. Filiation Parents */}
            <div className="fb-card fb-form-section mb-4">
              <div className="fb-form-section-title">
                <UserRound size={18} className="text-yellow" />
                <span>2. FILIATION & PARENTS</span>
              </div>

              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <label className="fb-form-label">Nom complet du Père</label>
                  <input
                    type="text"
                    className="fb-input"
                    name="fatherName"
                    placeholder="Ex: KAMGANG Michel"
                    value={formData.fatherName}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12 col-sm-6">
                  <label className="fb-form-label">Profession du Père</label>
                  <input
                    type="text"
                    className="fb-input"
                    name="fatherJob"
                    placeholder="Ex: Ingénieur Télécoms"
                    value={formData.fatherJob}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12 col-sm-6">
                  <label className="fb-form-label">Nom complet de la Mère</label>
                  <input
                    type="text"
                    className="fb-input"
                    name="motherName"
                    placeholder="Ex: BEKONO Chantal"
                    value={formData.motherName}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12 col-sm-6">
                  <label className="fb-form-label">Profession de la Mère</label>
                  <input
                    type="text"
                    className="fb-input"
                    name="motherJob"
                    placeholder="Ex: Enseignante"
                    value={formData.motherJob}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Boutons de soumission */}
            <div className="d-flex gap-2 justify-content-end mb-4">
              <button
                type="button"
                className="fb-btn fb-btn-secondary"
                onClick={resetForm}
              >
                Réinitialiser
              </button>

              <button
                type="submit"
                className="fb-btn fb-btn-green"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="spin" />
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Enregistrer la naissance</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Colonne Aperçu en Temps Réel (Droite) */}
        <div className="col-12 col-lg-5">
          <div className="fb-card fb-preview-sticky">
            <div className="cameroon-flag-bar">
              <span className="flag-green"></span>
              <span className="flag-red"></span>
              <span className="flag-yellow"></span>
            </div>

            <div className="p-3">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                  <Sparkles size={16} className="text-yellow" />
                  <strong className="small text-uppercase">Aperçu en direct</strong>
                </div>
                <span className="fb-badge fb-badge-yellow">Projet d'acte</span>
              </div>

              {/* Fiche Officielle Simulée */}
              <div className="fb-preview-cert">
                <div className="text-center mb-3">
                  <span className="fb-preview-rep">RÉPUBLIQUE DU CAMEROUN</span>
                  <div className="small text-muted">Paix — Travail — Patrie</div>
                  <div className="fb-preview-divider"></div>
                  <h6 className="fw-bold mb-0 text-green">ACTE DE NAISSANCE</h6>
                </div>

                <div className="fb-preview-body">
                  <div className="fb-preview-row">
                    <span className="text-muted">Nom de l'enfant :</span>
                    <strong>
                      {formData.childFirstname || formData.childLastname
                        ? `${formData.childFirstname} ${formData.childLastname}`
                        : "—"}
                    </strong>
                  </div>

                  <div className="fb-preview-row">
                    <span className="text-muted">Sexe :</span>
                    <strong>
                      {formData.sex === "MALE" || formData.sex === "M"
                        ? "Masculin (Garçon)"
                        : "Féminin (Fille)"}
                    </strong>
                  </div>

                  <div className="fb-preview-row">
                    <span className="text-muted">Date de naissance :</span>
                    <strong>
                      {formData.birthDate
                        ? new Date(formData.birthDate).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "—"}
                    </strong>
                  </div>

                  <div className="fb-preview-row">
                    <span className="text-muted">Lieu :</span>
                    <span>{formData.birthPlace || "—"}</span>
                  </div>

                  <div className="fb-preview-divider"></div>

                  <div className="fb-preview-row">
                    <span className="text-muted">Père :</span>
                    <span>{formData.fatherName || "—"}</span>
                  </div>

                  <div className="fb-preview-row">
                    <span className="text-muted">Mère :</span>
                    <span>{formData.motherName || "—"}</span>
                  </div>

                  <div className="fb-preview-divider"></div>

                  <div className="small text-muted text-center">
                    Centre N° {formData.centerId || "1"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        .fb-create-page {
          max-width: 1100px;
          margin: 0 auto;
        }

        .fb-create-header-card {
          background: #ffffff;
          overflow: hidden;
        }

        .fb-create-header-content {
          padding: 18px 24px;
        }

        .fb-create-icon-box {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          background: var(--sivec-green-light);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .fb-success-banner {
          background: #f0fdf4;
          border: 1px solid var(--sivec-green-border);
          padding: 18px 22px;
        }

        .fb-success-top {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .fb-success-badge {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--sivec-green-light);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .fb-error-banner {
          background: var(--sivec-red-light);
          border: 1px solid var(--sivec-red-border);
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--sivec-red);
          border-radius: 10px;
        }

        .fb-form-section {
          padding: 18px 22px;
          background: #ffffff;
        }

        .fb-form-section-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--fb-text-secondary);
          letter-spacing: 0.6px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--fb-border);
        }

        .fb-form-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: var(--fb-text-primary);
          margin-bottom: 6px;
        }

        .fb-input {
          width: 100%;
          padding: 9px 14px;
          border-radius: 8px;
          border: 1px solid var(--fb-border);
          background: var(--fb-hover);
          font-size: 14px;
          color: var(--fb-text-primary);
          outline: none;
          transition: all 0.18s ease;
        }

        .fb-input:focus {
          background: #ffffff;
          border-color: var(--sivec-green);
          box-shadow: 0 0 0 3px var(--sivec-green-glow);
        }

        .fb-sex-btn {
          flex: 1;
          padding: 9px 12px;
          border-radius: 8px;
          border: 1px solid var(--fb-border);
          background: var(--fb-hover);
          font-size: 13px;
          font-weight: 600;
          color: var(--fb-text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .fb-sex-btn.active-m {
          background: var(--sivec-green-light);
          border-color: var(--sivec-green);
          color: var(--sivec-green);
        }

        .fb-sex-btn.active-f {
          background: var(--sivec-yellow-light);
          border-color: var(--sivec-yellow);
          color: var(--sivec-yellow-hover);
        }

        /* Sticky Preview Card */
        .fb-preview-sticky {
          position: sticky;
          top: 20px;
          background: #ffffff;
          overflow: hidden;
        }

        .fb-preview-cert {
          background: #fcfdfe;
          border: 1px solid #dbe2ea;
          border-radius: 8px;
          padding: 16px;
        }

        .fb-preview-rep {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          color: var(--fb-text-secondary);
        }

        .fb-preview-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 8px 0;
        }

        .fb-preview-row {
          display: flex;
          justify-content: space-between;
          font-size: 12.5px;
          margin-bottom: 5px;
        }
      `}</style>
    </div>
  );
};

export default CreateBirth;