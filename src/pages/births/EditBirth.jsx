import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  UserRound,
  Baby,
  MapPin,
  CalendarDays,
  VenusAndMars,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

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
      setError("");

      try {
        const data = await getBirthById(id);
        const payload = data?.data ?? data;

        setFormData(payload || {});
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

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    // Une naissance APPROVED ne peut plus être modifiée
    if (formData.status === "APPROVED") {
      setError("Une naissance validée ne peut plus être modifiée.");
      setSaving(false);
      return;
    }

    try {
      const res = await updateBirth(id, formData);

      const success = res?.success ?? true;
      const msg =
        res?.message || "Naissance modifiée avec succès.";

      if (success) {
        setMessage(msg);

        setTimeout(() => {
          navigate("/tout");
        }, 1000);
      } else {
        setError(msg || "Échec de la modification.");
      }
    } catch (err) {
      console.error(err);

      const status = err?.response?.status;

      if (status === 400) {
        setError(
          err.response?.data?.message ||
            "Refus de modification : acte validé."
        );
      } else if (status === 404) {
        setError(
          err.response?.data?.message ||
            "Naissance introuvable."
        );
      } else {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Erreur interne du serveur."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "70vh" }}
      >
        <Loader2
          size={42}
          className="text-success mb-3"
          style={{ animation: "spin 1s linear infinite" }}
        />

        <p className="text-muted mb-0">
          Chargement des informations...
        </p>

        <style>
          {`
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">

      {/* ================= HEADER ================= */}
      <div
        className="card border-0 shadow-sm mb-4 overflow-hidden"
        style={{ borderRadius: "18px" }}
      >
        <div
          style={{
            height: "6px",
            background:
              "linear-gradient(90deg, #198754 0%, #198754 33%, #dc3545 33%, #dc3545 66%, #ffc107 66%, #ffc107 100%)",
          }}
        />

        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: "#e8f5ee",
                  color: "#198754",
                }}
              >
                <Baby size={27} />
              </div>

              <div>
                <h2
                  className="fw-bold mb-1"
                  style={{ color: "#173b2b" }}
                >
                  Modifier une naissance
                </h2>

                <p className="text-muted mb-0">
                  Modifier les informations de l'acte de naissance
                </p>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-light border d-flex align-items-center gap-2"
              onClick={() => navigate("/tout")}
            >
              <ArrowLeft size={18} />
              Retour
            </button>
          </div>
        </div>
      </div>

      {/* ================= ALERTES ================= */}

      {message && (
        <div
          className="alert border-0 shadow-sm d-flex align-items-center gap-3"
          style={{
            background: "#e9f7ef",
            color: "#146c43",
            borderRadius: "12px",
          }}
        >
          <CheckCircle2 size={22} />
          <div>
            <strong>Modification réussie</strong>
            <div>{message}</div>
          </div>
        </div>
      )}

      {error && (
        <div
          className="alert border-0 shadow-sm d-flex align-items-center gap-3"
          style={{
            background: "#fdecec",
            color: "#b02a37",
            borderRadius: "12px",
          }}
        >
          <AlertCircle size={22} />
          <div>
            <strong>Erreur</strong>
            <div>{error}</div>
          </div>
        </div>
      )}

      {/* ================= FORMULAIRE ================= */}

      <form onSubmit={handleSubmit}>

        {/* INFORMATIONS ENFANT */}
        <div
          className="card border-0 shadow-sm mb-4"
          style={{ borderRadius: "18px" }}
        >
          <div className="card-header bg-white border-0 p-4">
            <div className="d-flex align-items-center gap-3">

              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "#e8f5ee",
                  color: "#198754",
                }}
              >
                <Baby size={23} />
              </div>

              <div>
                <h5
                  className="fw-bold mb-1"
                  style={{ color: "#173b2b" }}
                >
                  Informations de l'enfant
                </h5>

                <small className="text-muted">
                  Informations personnelles de l'enfant
                </small>
              </div>
            </div>
          </div>

          <div className="card-body px-4 pb-4">

            <div className="row g-4">

              {/* Prénom */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Prénom
                </label>

                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <UserRound size={18} className="text-success" />
                  </span>

                  <input
                    type="text"
                    className="form-control border-start-0"
                    name="childFirstname"
                    value={formData.childFirstname || ""}
                    onChange={handleChange}
                    placeholder="Prénom de l'enfant"
                  />
                </div>
              </div>

              {/* Nom */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Nom
                </label>

                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <UserRound size={18} className="text-success" />
                  </span>

                  <input
                    type="text"
                    className="form-control border-start-0"
                    name="childLastname"
                    value={formData.childLastname || ""}
                    onChange={handleChange}
                    placeholder="Nom de l'enfant"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Date de naissance
                </label>

                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <CalendarDays size={18} className="text-success" />
                  </span>

                  <input
                    type="date"
                    className="form-control border-start-0"
                    name="birthDate"
                    value={
                      formData.birthDate
                        ? formData.birthDate.split("T")[0]
                        : ""
                    }
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Lieu */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Lieu de naissance
                </label>

                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <MapPin size={18} className="text-danger" />
                  </span>

                  <input
                    type="text"
                    className="form-control border-start-0"
                    name="birthPlace"
                    value={formData.birthPlace || ""}
                    onChange={handleChange}
                    placeholder="Lieu de naissance"
                  />
                </div>
              </div>

              {/* Sexe */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Sexe
                </label>

                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <VenusAndMars size={18} className="text-danger" />
                  </span>

                  <select
                    className="form-select border-start-0"
                    name="sex"
                    value={formData.sex || ""}
                    onChange={handleChange}
                  >
                    <option value="">
                      Sélectionner le sexe
                    </option>
                    <option value="MALE">
                      Masculin
                    </option>
                    <option value="FEMALE">
                      Féminin
                    </option>
                  </select>
                </div>
              </div>

              {/* Centre */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Centre d'état civil
                </label>

                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Building2 size={18} className="text-warning" />
                  </span>

                  <input
                    type="text"
                    className="form-control border-start-0"
                    name="centerId"
                    value={formData.centerId || ""}
                    onChange={handleChange}
                    placeholder="Identifiant du centre"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PARENTS ================= */}

        <div
          className="card border-0 shadow-sm mb-4"
          style={{ borderRadius: "18px" }}
        >
          <div className="card-header bg-white border-0 p-4">
            <div className="d-flex align-items-center gap-3">

              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "#fff4d6",
                  color: "#d39e00",
                }}
              >
                <UserRound size={23} />
              </div>

              <div>
                <h5
                  className="fw-bold mb-1"
                  style={{ color: "#173b2b" }}
                >
                  Informations des parents
                </h5>

                <small className="text-muted">
                  Identité et profession des parents
                </small>
              </div>

            </div>
          </div>

          <div className="card-body px-4 pb-4">

            <div className="row g-4">

              {/* Père */}
              <div className="col-md-6">
                <div
                  className="p-4 h-100"
                  style={{
                    background: "#f8faf9",
                    borderRadius: "14px",
                    borderLeft: "4px solid #198754",
                  }}
                >
                  <h6 className="fw-bold text-success mb-3">
                    Père
                  </h6>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Nom du père
                    </label>

                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <UserRound size={17} />
                      </span>

                      <input
                        type="text"
                        className="form-control border-start-0"
                        name="fatherName"
                        value={formData.fatherName || ""}
                        onChange={handleChange}
                        placeholder="Nom complet du père"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label fw-semibold">
                      Profession du père
                    </label>

                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <BriefcaseBusiness size={17} />
                      </span>

                      <input
                        type="text"
                        className="form-control border-start-0"
                        name="fatherJob"
                        value={formData.fatherJob || ""}
                        onChange={handleChange}
                        placeholder="Profession"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mère */}
              <div className="col-md-6">
                <div
                  className="p-4 h-100"
                  style={{
                    background: "#f8faf9",
                    borderRadius: "14px",
                    borderLeft: "4px solid #dc3545",
                  }}
                >
                  <h6 className="fw-bold text-danger mb-3">
                    Mère
                  </h6>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Nom de la mère
                    </label>

                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <UserRound size={17} />
                      </span>

                      <input
                        type="text"
                        className="form-control border-start-0"
                        name="motherName"
                        value={formData.motherName || ""}
                        onChange={handleChange}
                        placeholder="Nom complet de la mère"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label fw-semibold">
                      Profession de la mère
                    </label>

                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <BriefcaseBusiness size={17} />
                      </span>

                      <input
                        type="text"
                        className="form-control border-start-0"
                        name="motherJob"
                        value={formData.motherJob || ""}
                        onChange={handleChange}
                        placeholder="Profession"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ================= STATUT ================= */}

        <div
          className="card border-0 shadow-sm mb-4"
          style={{ borderRadius: "18px" }}
        >
          <div className="card-body p-4">

            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">

              <div>
                <small className="text-muted d-block">
                  Statut actuel de l'acte
                </small>

                <span
                  className={`badge mt-2 px-3 py-2 ${
                    formData.status === "APPROVED"
                      ? "bg-success"
                      : formData.status === "PENDING"
                      ? "bg-warning text-dark"
                      : formData.status === "REJECTED"
                      ? "bg-danger"
                      : "bg-secondary"
                  }`}
                  style={{ fontSize: "0.85rem" }}
                >
                  {formData.status || "INCONNU"}
                </span>
              </div>

              {formData.status === "APPROVED" && (
                <div className="text-danger small">
                  <AlertCircle size={16} className="me-1" />
                  Cet acte est validé et ne peut plus être modifié.
                </div>
              )}

            </div>
          </div>
        </div>

        {/* ================= ACTIONS ================= */}

        <div
          className="card border-0 shadow-sm"
          style={{ borderRadius: "18px" }}
        >
          <div className="card-body p-4">

            <div className="d-flex flex-column flex-sm-row justify-content-end gap-3">

              <button
                type="button"
                className="btn btn-light border px-4 py-2 d-flex align-items-center justify-content-center gap-2"
                onClick={() => navigate("/tout")}
                disabled={saving}
              >
                <ArrowLeft size={18} />
                Annuler
              </button>

              <button
                type="submit"
                className="btn px-4 py-2 d-flex align-items-center justify-content-center gap-2 text-white"
                disabled={saving || formData.status === "APPROVED"}
                style={{
                  background: "#198754",
                  borderColor: "#198754",
                }}
              >
                {saving ? (
                  <>
                    <Loader2
                      size={18}
                      style={{
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Enregistrer les modifications
                  </>
                )}
              </button>

            </div>
          </div>
        </div>

      </form>

      <style>
        {`
          .form-control,
          .form-select {
            min-height: 44px;
          }

          .form-control:focus,
          .form-select:focus {
            border-color: #198754;
            box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.12);
          }

          .input-group-text {
            min-width: 45px;
            justify-content: center;
          }

          .btn {
            transition: all 0.2s ease;
          }

          .btn:hover {
            transform: translateY(-1px);
          }

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default EditBirth;