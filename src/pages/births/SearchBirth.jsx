import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  FileText,
  UserRound,
  Users,
  Paperclip,
  Pencil,
  Trash2,
  CheckCircle2,
  Printer,
  AlertCircle,
  Loader2,
  Hash,
  CalendarDays,
  MapPin,
  VenusAndMars,
  BriefcaseBusiness,
  X,
  ShieldCheck,
} from "lucide-react";

import {
  searchBirthByActNumber,
  validateBirth,
  deleteBirth,
  printBirth,
} from "../../api/birthApi";

const SearchBirth = () => {
  const navigate = useNavigate();

  const [actNumber, setActNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // =========================
  // RECHERCHE
  // =========================

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
      const res = await searchBirthByActNumber(
        actNumber.trim()
      );

      if (res?.success) {
        setResult(res.data ?? null);
      } else {
        setError(
          res?.message || "Aucun acte trouvé."
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Erreur lors de la recherche."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VALIDATION
  // =========================

  const handleValidate = async () => {
    if (!result?.id) return;

    setActionLoading(true);
    setActionMessage("");
    setActionError("");

    try {
      const res = await validateBirth(result.id);

      if (res?.success) {
        setResult((prev) => ({
          ...prev,
          status: "APPROVED",
        }));

        setActionMessage(
          res.message ||
            "Acte validé avec succès."
        );
      } else {
        setActionError(
          res?.message ||
            "Impossible de valider l'acte."
        );
      }
    } catch (err) {
      console.error(err);

      setActionError(
        err?.response?.data?.message ||
          err?.message ||
          "Erreur lors de la validation."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // SUPPRESSION
  // =========================

  const handleDelete = async () => {
    if (!result?.id) return;

    const confirmed = window.confirm(
      "Confirmer la suppression de cet acte non validé ?"
    );

    if (!confirmed) return;

    setActionLoading(true);
    setActionMessage("");
    setActionError("");

    try {
      const res = await deleteBirth(result.id);

      if (res?.success) {
        setResult(null);

        setActionMessage(
          res.message ||
            "Acte supprimé avec succès."
        );
      } else {
        setActionError(
          res?.message ||
            "Impossible de supprimer l'acte."
        );
      }
    } catch (err) {
      console.error(err);

      setActionError(
        err?.response?.data?.message ||
          err?.message ||
          "Erreur lors de la suppression."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // IMPRESSION / PDF
  // =========================

  const handlePrint = async () => {
    if (!result?.id) return;

    setActionLoading(true);
    setActionMessage("");
    setActionError("");

    try {
      const blobData = await printBirth(result.id);

      const blob = new Blob([blobData], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `${
        result.actNumber || result.id
      }.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);

      setActionMessage(
        "Téléchargement du PDF lancé."
      );
    } catch (err) {
      console.error(err);

      setActionError(
        err?.response?.data?.message ||
          err?.message ||
          "Erreur lors de l'impression."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // STATUT
  // =========================

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="badge rounded-pill bg-success px-3 py-2">
            <CheckCircle2
              size={14}
              className="me-1"
            />
            Validé
          </span>
        );

      case "PENDING":
        return (
          <span
            className="badge rounded-pill px-3 py-2"
            style={{
              background: "#fff3cd",
              color: "#856404",
            }}
          >
            <AlertCircle
              size={14}
              className="me-1"
            />
            En attente
          </span>
        );

      case "REJECTED":
        return (
          <span className="badge rounded-pill bg-danger px-3 py-2">
            <X
              size={14}
              className="me-1"
            />
            Rejeté
          </span>
        );

      default:
        return (
          <span className="badge rounded-pill bg-secondary px-3 py-2">
            {status || "Inconnu"}
          </span>
        );
    }
  };

  return (
    <div className="container-fluid py-4">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="card border-0 shadow-sm mb-4 overflow-hidden"
        style={{
          borderRadius: "18px",
        }}
      >

        <div
          style={{
            height: "6px",
            background:
              "linear-gradient(90deg, #198754 0%, #198754 33%, #dc3545 33%, #dc3545 66%, #ffc107 66%, #ffc107 100%)",
          }}
        />

        <div className="card-body p-4">

          <div className="d-flex align-items-center gap-3">

            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "15px",
                background: "#e8f5ee",
                color: "#198754",
              }}
            >
              <Search size={28} />
            </div>

            <div>
              <h2
                className="fw-bold mb-1"
                style={{
                  color: "#173b2b",
                }}
              >
                Rechercher une naissance
              </h2>

              <p className="text-muted mb-0">
                Recherchez un acte à partir de son
                numéro d'acte.
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* =====================================================
          BARRE DE RECHERCHE
      ===================================================== */}

      <div
        className="card border-0 shadow-sm mb-4"
        style={{
          borderRadius: "18px",
        }}
      >

        <div className="card-body p-4">

          <form onSubmit={handleSearch}>

            <label className="form-label fw-semibold">
              Numéro d'acte
            </label>

            <div className="row g-3">

              <div className="col-lg-9">

                <div className="input-group input-group-lg">

                  <span
                    className="input-group-text bg-light border-end-0"
                  >
                    <Hash
                      size={20}
                      className="text-success"
                    />
                  </span>

                  <input
                    type="text"
                    className="form-control border-start-0"
                    value={actNumber}
                    onChange={(e) =>
                      setActNumber(e.target.value)
                    }
                    placeholder="Ex : YAO05-2026-000001"
                  />

                  {actNumber && (
                    <button
                      type="button"
                      className="btn bg-light border border-start-0"
                      onClick={() =>
                        setActNumber("")
                      }
                    >
                      <X size={18} />
                    </button>
                  )}

                </div>

              </div>

              <div className="col-lg-3">

                <button
                  className="btn btn-success btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                  type="submit"
                  disabled={loading}
                  style={{
                    borderRadius: "10px",
                  }}
                >

                  {loading ? (
                    <>
                      <Loader2
                        size={20}
                        style={{
                          animation:
                            "spin 1s linear infinite",
                        }}
                      />

                      Recherche...
                    </>
                  ) : (
                    <>
                      <Search size={20} />
                      Rechercher
                    </>
                  )}

                </button>

              </div>

            </div>

          </form>

        </div>
      </div>

      {/* =====================================================
          ERREUR RECHERCHE
      ===================================================== */}

      {error && (
        <div
          className="alert border-0 shadow-sm d-flex align-items-center gap-3 mb-4"
          style={{
            background: "#fdecec",
            color: "#b02a37",
            borderRadius: "14px",
          }}
        >
          <AlertCircle size={23} />

          <div>
            <strong>Recherche impossible</strong>

            <div className="small mt-1">
              {error}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          RESULTAT
      ===================================================== */}

      {result && (
        <div>

          {/* EN-TÊTE RESULTAT */}

          <div
            className="card border-0 shadow-sm mb-4 overflow-hidden"
            style={{
              borderRadius: "18px",
            }}
          >

            <div
              style={{
                height: "5px",
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
                      width: "50px",
                      height: "50px",
                      borderRadius: "14px",
                      background: "#e8f5ee",
                      color: "#198754",
                    }}
                  >
                    <FileText size={26} />
                  </div>

                  <div>

                    <small className="text-muted">
                      Acte trouvé
                    </small>

                    <h4
                      className="fw-bold mb-0"
                      style={{
                        color: "#173b2b",
                      }}
                    >
                      {result.actNumber ||
                        result.id}
                    </h4>

                  </div>

                </div>

                <div>
                  {getStatusBadge(
                    result.status
                  )}
                </div>

              </div>

            </div>

          </div>

          <div className="row g-4">

            {/* =================================================
                INFORMATIONS ENFANT
            ================================================= */}

            <div className="col-lg-7">

              <div
                className="card border-0 shadow-sm h-100"
                style={{
                  borderRadius: "18px",
                }}
              >

                <div className="card-body p-4">

                  <div className="d-flex align-items-center gap-3 mb-4">

                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "12px",
                        background: "#e8f5ee",
                        color: "#198754",
                      }}
                    >
                      <UserRound size={23} />
                    </div>

                    <div>
                      <h5
                        className="fw-bold mb-1"
                        style={{
                          color: "#173b2b",
                        }}
                      >
                        Informations de l'enfant
                      </h5>

                      <small className="text-muted">
                        Données principales de l'acte
                      </small>
                    </div>

                  </div>

                  <div className="row g-3">

                    {/* Prénom */}

                    <div className="col-md-6">

                      <div className="info-box">
                        <small>
                          Prénom
                        </small>

                        <strong>
                          {result.childFirstname ||
                            "Non renseigné"}
                        </strong>
                      </div>

                    </div>

                    {/* Nom */}

                    <div className="col-md-6">

                      <div className="info-box">
                        <small>
                          Nom
                        </small>

                        <strong>
                          {result.childLastname ||
                            "Non renseigné"}
                        </strong>
                      </div>

                    </div>

                    {/* Date */}

                    <div className="col-md-6">

                      <div className="info-box">

                        <div className="d-flex align-items-center gap-2">
                          <CalendarDays
                            size={16}
                            className="text-success"
                          />

                          <small>
                            Date de naissance
                          </small>
                        </div>

                        <strong>
                          {result.birthDate
                            ? new Date(
                                result.birthDate
                              ).toLocaleDateString(
                                "fr-FR"
                              )
                            : "Non renseignée"}
                        </strong>

                      </div>

                    </div>

                    {/* Lieu */}

                    <div className="col-md-6">

                      <div className="info-box">

                        <div className="d-flex align-items-center gap-2">
                          <MapPin
                            size={16}
                            className="text-danger"
                          />

                          <small>
                            Lieu de naissance
                          </small>
                        </div>

                        <strong>
                          {result.birthPlace ||
                            "Non renseigné"}
                        </strong>

                      </div>

                    </div>

                    {/* Sexe */}

                    <div className="col-md-6">

                      <div className="info-box">

                        <div className="d-flex align-items-center gap-2">
                          <VenusAndMars
                            size={16}
                            className="text-danger"
                          />

                          <small>
                            Sexe
                          </small>
                        </div>

                        <strong>
                          {result.sex === "MALE"
                            ? "Masculin"
                            : result.sex === "FEMALE"
                            ? "Féminin"
                            : "Non renseigné"}
                        </strong>

                      </div>

                    </div>

                    {/* ID */}

                    <div className="col-md-6">

                      <div className="info-box">

                        <small>
                          Identifiant
                        </small>

                        <strong
                          className="text-break"
                          style={{
                            fontSize: "0.85rem",
                          }}
                        >
                          {result.id ||
                            "Non renseigné"}
                        </strong>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                PARENTS
            ================================================= */}

            <div className="col-lg-5">

              <div
                className="card border-0 shadow-sm h-100"
                style={{
                  borderRadius: "18px",
                }}
              >

                <div className="card-body p-4">

                  <div className="d-flex align-items-center gap-3 mb-4">

                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "12px",
                        background: "#fff4d6",
                        color: "#d39e00",
                      }}
                    >
                      <Users size={23} />
                    </div>

                    <div>
                      <h5
                        className="fw-bold mb-1"
                        style={{
                          color: "#173b2b",
                        }}
                      >
                        Parents
                      </h5>

                      <small className="text-muted">
                        Informations déclarées
                      </small>
                    </div>

                  </div>

                  {Array.isArray(
                    result.parents
                  ) &&
                  result.parents.length > 0 ? (

                    <div className="d-flex flex-column gap-3">

                      {result.parents.map(
                        (p, i) => {

                          const name =
                            p.firstname ||
                            p.name
                              ? `${
                                  p.firstname ??
                                  p.name
                                }${
                                  p.lastname
                                    ? " " +
                                      p.lastname
                                    : ""
                                }`
                              : `Parent ${
                                  i + 1
                                }`;

                          const profession =
                            p.job ??
                            p.occupation ??
                            p.profession ??
                            p.metier ??
                            null;

                          const isFather =
                            p.relation ===
                              "FATHER" ||
                            p.type === "FATHER";

                          return (
                            <div
                              key={i}
                              className="p-3"
                              style={{
                                background:
                                  "#f8faf9",
                                borderRadius:
                                  "12px",
                                borderLeft:
                                  `4px solid ${
                                    isFather
                                      ? "#198754"
                                      : "#dc3545"
                                  }`,
                              }}
                            >

                              <div className="d-flex align-items-start gap-3">

                                <UserRound
                                  size={20}
                                  className={
                                    isFather
                                      ? "text-success"
                                      : "text-danger"
                                  }
                                />

                                <div>

                                  <small className="text-muted d-block">
                                    {isFather
                                      ? "Père"
                                      : i === 1
                                      ? "Mère"
                                      : `Parent ${
                                          i +
                                          1
                                        }`}
                                  </small>

                                  <strong>
                                    {name}
                                  </strong>

                                  {profession && (
                                    <div className="small text-muted mt-1 d-flex align-items-center gap-1">
                                      <BriefcaseBusiness
                                        size={14}
                                      />

                                      {profession}
                                    </div>
                                  )}

                                </div>

                              </div>

                            </div>
                          );
                        }
                      )}

                    </div>

                  ) : (

                    <div
                      className="text-center py-4"
                      style={{
                        background:
                          "#f8faf9",
                        borderRadius:
                          "12px",
                      }}
                    >
                      <Users
                        size={32}
                        className="text-muted mb-2"
                      />

                      <p className="text-muted mb-0">
                        Aucun parent renseigné
                      </p>
                    </div>

                  )}

                </div>

              </div>

            </div>

            {/* =================================================
                PIECES JOINTES
            ================================================= */}

            <div className="col-12">

              <div
                className="card border-0 shadow-sm"
                style={{
                  borderRadius: "18px",
                }}
              >

                <div className="card-body p-4">

                  <div className="d-flex align-items-center gap-3 mb-4">

                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "12px",
                        background: "#fdecec",
                        color: "#dc3545",
                      }}
                    >
                      <Paperclip size={23} />
                    </div>

                    <div>
                      <h5
                        className="fw-bold mb-1"
                        style={{
                          color: "#173b2b",
                        }}
                      >
                        Pièces jointes
                      </h5>

                      <small className="text-muted">
                        Documents associés à l'acte
                      </small>
                    </div>

                  </div>

                  {Array.isArray(
                    result.attachments
                  ) &&
                  result.attachments.length > 0 ? (

                    <div className="row g-3">

                      {result.attachments.map(
                        (a, i) => (

                          <div
                            className="col-md-6 col-lg-4"
                            key={i}
                          >

                            <div
                              className="p-3 d-flex align-items-center gap-3"
                              style={{
                                background:
                                  "#f8faf9",
                                borderRadius:
                                  "12px",
                              }}
                            >

                              <FileText
                                size={22}
                                className="text-danger"
                              />

                              <span className="text-break">
                                {a.filename ??
                                  a.name ??
                                  `Fichier ${
                                    i + 1
                                  }`}
                              </span>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  ) : (

                    <div
                      className="text-center py-4"
                      style={{
                        background:
                          "#f8faf9",
                        borderRadius:
                          "12px",
                      }}
                    >

                      <Paperclip
                        size={32}
                        className="text-muted mb-2"
                      />

                      <p className="text-muted mb-0">
                        Aucune pièce jointe
                      </p>

                    </div>

                  )}

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              MESSAGES ACTION
          ================================================= */}

          {(actionMessage ||
            actionError) && (

            <div className="mt-4">

              {actionMessage && (
                <div
                  className="alert border-0 shadow-sm d-flex align-items-center gap-3"
                  style={{
                    background:
                      "#e9f7ef",
                    color: "#146c43",
                    borderRadius:
                      "14px",
                  }}
                >
                  <CheckCircle2
                    size={22}
                  />

                  <div>
                    <strong>
                      Opération réussie
                    </strong>

                    <div className="small">
                      {actionMessage}
                    </div>
                  </div>
                </div>
              )}

              {actionError && (
                <div
                  className="alert border-0 shadow-sm d-flex align-items-center gap-3"
                  style={{
                    background:
                      "#fdecec",
                    color: "#b02a37",
                    borderRadius:
                      "14px",
                  }}
                >
                  <AlertCircle
                    size={22}
                  />

                  <div>
                    <strong>
                      Opération impossible
                    </strong>

                    <div className="small">
                      {actionError}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div
            className="card border-0 shadow-sm mt-4"
            style={{
              borderRadius: "18px",
            }}
          >

            <div className="card-body p-4">

              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

                <div>

                  <small className="text-muted d-block">
                    Actions sur l'acte
                  </small>

                  <strong>
                    {result.actNumber ||
                      result.id}
                  </strong>

                </div>

                <div className="d-flex flex-wrap gap-2">

                  {/* MODIFIER */}

                  <button
                    className="btn btn-outline-success d-flex align-items-center gap-2"
                    onClick={() =>
                      navigate(
                        `/births/${result.id}/edit`
                      )
                    }
                    disabled={actionLoading}
                  >
                    <Pencil size={17} />
                    Modifier
                  </button>

                  {/* SUPPRIMER */}

                  {result.status ===
                    "PENDING" && (
                    <button
                      className="btn btn-outline-danger d-flex align-items-center gap-2"
                      onClick={
                        handleDelete
                      }
                      disabled={
                        actionLoading
                      }
                    >
                      <Trash2 size={17} />
                      Supprimer
                    </button>
                  )}

                  {/* VALIDER */}

                  {result.status !==
                    "APPROVED" && (
                    <button
                      className="btn btn-success d-flex align-items-center gap-2"
                      onClick={
                        handleValidate
                      }
                      disabled={
                        actionLoading
                      }
                    >
                      {actionLoading ? (
                        <Loader2
                          size={17}
                          style={{
                            animation:
                              "spin 1s linear infinite",
                          }}
                        />
                      ) : (
                        <CheckCircle2
                          size={17}
                        />
                      )}

                      Valider
                    </button>
                  )}

                  {/* IMPRIMER */}

                  <button
                    className="btn btn-dark d-flex align-items-center gap-2"
                    onClick={handlePrint}
                    disabled={actionLoading}
                  >
                    <Printer size={17} />
                    Imprimer
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          AUCUN RESULTAT
      ===================================================== */}

      {!loading &&
        !error &&
        !result && (
          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: "18px",
            }}
          >

            <div className="card-body text-center py-5">

              <div
                className="d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{
                  width: "75px",
                  height: "75px",
                  borderRadius: "20px",
                  background: "#f8faf9",
                  color: "#198754",
                }}
              >
                <Search size={34} />
              </div>

              <h5
                className="fw-bold"
                style={{
                  color: "#173b2b",
                }}
              >
                Recherchez un acte
              </h5>

              <p className="text-muted mb-0">
                Saisissez le numéro d'acte ci-dessus
                pour afficher les informations de la
                naissance.
              </p>

            </div>

          </div>
        )}

      {/* =====================================================
          STYLE
      ===================================================== */}

      <style>
        {`
          .info-box {
            padding: 15px;
            background: #f8faf9;
            border-radius: 12px;
            height: 100%;
          }

          .info-box small {
            display: block;
            color: #6c757d;
            margin-bottom: 5px;
          }

          .info-box strong {
            color: #173b2b;
            display: block;
            word-break: break-word;
          }

          .form-control:focus {
            border-color: #198754;
            box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.12);
          }

          .btn {
            transition: all 0.2s ease;
          }

          .btn:hover:not(:disabled) {
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

export default SearchBirth;