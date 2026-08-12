import React, { useState } from "react";
import { createBirth } from "../../api/birthApi";

import {
  Baby,
  UserRound,
  MapPin,
  CalendarDays,
  VenusAndMars,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  AlertCircle,
  Save,
  User,
} from "lucide-react";

const CreateBirth = () => {
  const [formData, setFormData] = useState({
    childFirstname: "",
    childLastname: "",
    birthDate: "",
    birthPlace: "",
    sex: "",
    centerId: "",

    fatherName: "",
    motherName: "",
    fatherJob: "",
    motherJob: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ===============================
  // MODIFICATION DU FORMULAIRE
  // ===============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ===============================
  // SOUMISSION
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await createBirth(formData);

      const data = response?.data ?? response;

      console.log(data);

      const actNumber = data?.actNumber ?? data?.id ?? "N/A";

      setMessage(
        `Naissance enregistrée avec succès. Numéro d'acte : ${actNumber}`
      );

      // Réinitialiser
      setFormData({
        childFirstname: "",
        childLastname: "",
        birthDate: "",
        birthPlace: "",
        sex: "",
        centerId: "",

        fatherName: "",
        motherName: "",
        fatherJob: "",
        motherJob: "",
      });
    } catch (error) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Une erreur est survenue lors de l'enregistrement."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">

        <div>
          <div className="d-flex align-items-center gap-3 mb-2">
            <div
              className="d-flex align-items-center justify-content-center rounded-3"
              style={{
                width: "50px",
                height: "50px",
                background: "#198754",
                color: "white",
              }}
            >
              <Baby size={28} />
            </div>

            <div>
              <h1 className="fw-bold mb-0">
                Enregistrer une naissance
              </h1>

              <p className="text-muted mb-0">
                Création d'un nouvel acte de naissance
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 mt-md-0">
          <span
            className="badge rounded-pill px-3 py-2"
            style={{
              background: "#fff3cd",
              color: "#856404",
              border: "1px solid #ffe69c",
            }}
          >
            <span className="me-2">●</span>
            Nouveau dossier
          </span>
        </div>
      </div>

      {/* ================================================= */}
      {/* ALERT SUCCESS */}
      {/* ================================================= */}

      {message && (
        <div
          className="alert d-flex align-items-start gap-3 shadow-sm border-0 rounded-3"
          style={{
            background: "#d1e7dd",
            color: "#0f5132",
          }}
        >
          <CheckCircle2 size={24} className="flex-shrink-0" />

          <div>
            <strong>Enregistrement réussi</strong>

            <div className="small mt-1">
              {message}
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* ALERT ERROR */}
      {/* ================================================= */}

      {error && (
        <div
          className="alert d-flex align-items-start gap-3 shadow-sm border-0 rounded-3"
          style={{
            background: "#f8d7da",
            color: "#842029",
          }}
        >
          <AlertCircle size={24} className="flex-shrink-0" />

          <div>
            <strong>Erreur</strong>

            <div className="small mt-1">
              {error}
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* FORM */}
      {/* ================================================= */}

      <form onSubmit={handleSubmit}>

        {/* ================================================= */}
        {/* INFORMATIONS ENFANT */}
        {/* ================================================= */}

        <div className="card border-0 shadow-sm rounded-4 mb-4">

          <div
            className="card-header border-0 py-3 px-4"
            style={{
              background: "linear-gradient(90deg, #198754, #157347)",
              color: "white",
              borderRadius: "16px 16px 0 0",
            }}
          >

            <div className="d-flex align-items-center gap-3">

              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "42px",
                  height: "42px",
                  background: "rgba(255,255,255,0.15)",
                }}
              >
                <Baby size={23} />
              </div>

              <div>
                <h5 className="mb-0 fw-bold">
                  Informations de l'enfant
                </h5>

                <small className="opacity-75">
                  Informations personnelles du nouveau-né
                </small>
              </div>

            </div>

          </div>

          <div className="card-body p-4">

            <div className="row g-4">

              {/* Prénom */}

              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Prénom
                </label>

                <div className="input-group">

                  <span className="input-group-text bg-light border-end-0">
                    <UserRound size={18} />
                  </span>

                  <input
                    type="text"
                    name="childFirstname"
                    value={formData.childFirstname}
                    onChange={handleChange}
                    className="form-control border-start-0"
                    placeholder="Ex : Jean"
                    required
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
                    <UserRound size={18} />
                  </span>

                  <input
                    type="text"
                    name="childLastname"
                    value={formData.childLastname}
                    onChange={handleChange}
                    className="form-control border-start-0"
                    placeholder="Ex : Dupont"
                    required
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
                    <CalendarDays size={18} />
                  </span>

                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="form-control border-start-0"
                    required
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
                    <MapPin size={18} />
                  </span>

                  <input
                    type="text"
                    name="birthPlace"
                    value={formData.birthPlace}
                    onChange={handleChange}
                    className="form-control border-start-0"
                    placeholder="Ex : Hôpital Central de Yaoundé"
                    required
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
                    <VenusAndMars size={18} />
                  </span>

                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className="form-select border-start-0"
                    required
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
                    <Building2 size={18} />
                  </span>

                  <input
                    type="text"
                    name="centerId"
                    value={formData.centerId}
                    onChange={handleChange}
                    className="form-control border-start-0"
                    placeholder="Identifiant du centre"
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* INFORMATIONS PARENTS */}
        {/* ================================================= */}

        <div className="card border-0 shadow-sm rounded-4 mb-4">

          <div
            className="card-header border-0 py-3 px-4"
            style={{
              background: "linear-gradient(90deg, #ffc107, #ffca2c)",
              color: "#212529",
              borderRadius: "16px 16px 0 0",
            }}
          >

            <div className="d-flex align-items-center gap-3">

              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "42px",
                  height: "42px",
                  background: "rgba(0,0,0,0.08)",
                }}
              >
                <User size={23} />
              </div>

              <div>

                <h5 className="mb-0 fw-bold">
                  Informations des parents
                </h5>

                <small>
                  Identité et profession des parents
                </small>

              </div>

            </div>

          </div>

          <div className="card-body p-4">

            <div className="row g-4">

              {/* ================= PERE ================= */}

              <div className="col-md-6">

                <div
                  className="p-4 rounded-4 h-100"
                  style={{
                    background: "#f8f9fa",
                    borderLeft: "4px solid #198754",
                  }}
                >

                  <div className="d-flex align-items-center gap-2 mb-4">

                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: "40px",
                        height: "40px",
                        background: "#d1e7dd",
                        color: "#198754",
                      }}
                    >
                      <UserRound size={20} />
                    </div>

                    <h6 className="mb-0 fw-bold">
                      Père
                    </h6>

                  </div>

                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Nom complet
                    </label>

                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Nom et prénom du père"
                      required
                    />

                  </div>

                  <div>

                    <label className="form-label fw-semibold">
                      Profession
                    </label>

                    <div className="input-group">

                      <span className="input-group-text">
                        <BriefcaseBusiness size={17} />
                      </span>

                      <input
                        type="text"
                        name="fatherJob"
                        value={formData.fatherJob}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Ex : Ingénieur"
                      />

                    </div>

                  </div>

                </div>

              </div>

              {/* ================= MERE ================= */}

              <div className="col-md-6">

                <div
                  className="p-4 rounded-4 h-100"
                  style={{
                    background: "#f8f9fa",
                    borderLeft: "4px solid #dc3545",
                  }}
                >

                  <div className="d-flex align-items-center gap-2 mb-4">

                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: "40px",
                        height: "40px",
                        background: "#f8d7da",
                        color: "#dc3545",
                      }}
                    >
                      <UserRound size={20} />
                    </div>

                    <h6 className="mb-0 fw-bold">
                      Mère
                    </h6>

                  </div>

                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Nom complet
                    </label>

                    <input
                      type="text"
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Nom et prénom de la mère"
                      required
                    />

                  </div>

                  <div>

                    <label className="form-label fw-semibold">
                      Profession
                    </label>

                    <div className="input-group">

                      <span className="input-group-text">
                        <BriefcaseBusiness size={17} />
                      </span>

                      <input
                        type="text"
                        name="motherJob"
                        value={formData.motherJob}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Ex : Enseignante"
                      />

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* FOOTER / ACTION */}
        {/* ================================================= */}

        <div className="card border-0 shadow-sm rounded-4">

          <div className="card-body p-4">

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

              <div>

                <div className="d-flex align-items-center gap-2">

                  <CheckCircle2
                    size={20}
                    className="text-success"
                  />

                  <strong>
                    Vérifiez les informations avant validation
                  </strong>

                </div>

                <small className="text-muted">
                  L'acte sera créé avec le statut « en attente ».
                </small>

              </div>

              <button
                type="submit"
                className="btn btn-success px-4 py-3 rounded-3 fw-semibold"
                disabled={loading}
                style={{
                  minWidth: "240px",
                }}
              >

                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />

                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save
                      size={19}
                      className="me-2"
                    />

                    Enregistrer la naissance
                  </>
                )}

              </button>

            </div>

          </div>

        </div>

      </form>

    </div>
  );
};

export default CreateBirth;