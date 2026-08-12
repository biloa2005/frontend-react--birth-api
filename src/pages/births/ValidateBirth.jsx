import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clipboard,
  Clock3,
  FileCheck2,
  Hash,
  MapPin,
  CalendarDays,
  UserRound,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Search,
  Copy,
  RefreshCw,
  Users,
} from "lucide-react";

import {
  getAllBirths,
  validateBirth,
} from "../../api/birthApi";

const ValidateBirth = () => {
  const [identifier, setIdentifier] = useState("");
  const [births, setBirths] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingBirths, setLoadingBirths] =
    useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  // Pour savoir quelle ligne est en cours de validation
  const [validatingId, setValidatingId] =
    useState(null);

  // ================================
  // CHARGER LES NAISSANCES
  // ================================

  const loadBirths = async () => {
    setLoadingBirths(true);
    setError("");

    try {
      const data = await getAllBirths();

      const list =
        data?.allBirth ??
        data?.births ??
        data?.data ??
        data ??
        [];

      const validList = Array.isArray(list)
        ? list
        : [];

      // Uniquement les actes non validés
      setBirths(
        validList.filter(
          (b) => b.status !== "APPROVED"
        )
      );
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Impossible de charger les naissances."
      );
    } finally {
      setLoadingBirths(false);
    }
  };

  useEffect(() => {
    loadBirths();
  }, []);

  // ================================
  // VALIDATION PAR IDENTIFIANT
  // ================================

  const handleValidate = async (e) => {
    e.preventDefault();

    if (!identifier.trim()) {
      setError(
        "Veuillez saisir l'identifiant de la naissance."
      );
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await validateBirth(
        identifier.trim()
      );

      const success = res?.success ?? true;

      const msg =
        res?.message ??
        "Acte validé avec succès.";

      if (success) {
        setMessage(msg);

        const validatedId =
          res?.data?.id ??
          identifier.trim();

        setBirths((prev) =>
          prev.filter(
            (b) => b.id !== validatedId
          )
        );

        setIdentifier("");
      } else {
        setError(
          msg ||
            "Échec de la validation."
        );
      }
    } catch (err) {
      console.error(err);

      const status =
        err?.response?.status;

      if (status === 400) {
        setError(
          err.response?.data?.message ||
            "Cette naissance est déjà validée."
        );
      } else if (status === 404) {
        setError(
          err.response?.data?.message ||
            "Naissance introuvable."
        );
      } else if (status === 500) {
        setError(
          "Erreur interne du serveur."
        );
      } else {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Erreur réseau."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // VALIDATION DIRECTE D'UNE LIGNE
  // ================================

  const handleValidateRow = async (birth) => {
    const id =
      birth?.id ??
      birth?._id ??
      birth?.actNumber;

    if (!id) return;

    setValidatingId(id);
    setMessage("");
    setError("");

    try {
      const res = await validateBirth(id);

      const success = res?.success ?? true;

      if (success) {
        setMessage(
          res?.message ||
            "Acte validé avec succès."
        );

        setBirths((prev) =>
          prev.filter(
            (b) =>
              (b.id ??
                b._id ??
                b.actNumber) !== id
          )
        );
      } else {
        setError(
          res?.message ||
            "Impossible de valider cet acte."
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Erreur lors de la validation."
      );
    } finally {
      setValidatingId(null);
    }
  };

  // ================================
  // COPIER ID
  // ================================

  const handleCopy = async (id) => {
    if (!id) return;

    try {
      await navigator.clipboard.writeText(
        String(id)
      );

      setCopyMessage(
        `ID ${id} copié dans le presse-papiers.`
      );

      setTimeout(
        () => setCopyMessage(""),
        3000
      );
    } catch (err) {
      console.error(
        "Copy failed",
        err
      );

      setCopyMessage(
        "Impossible de copier l'ID."
      );

      setTimeout(
        () => setCopyMessage(""),
        3000
      );
    }
  };

  // ================================
  // STATUT
  // ================================

  const getStatusBadge = (status) => {
    if (status === "APPROVED") {
      return (
        <span className="badge rounded-pill bg-success px-3 py-2">
          <CheckCircle2
            size={14}
            className="me-1"
          />
          Validé
        </span>
      );
    }

    if (status === "PENDING") {
      return (
        <span
          className="badge rounded-pill px-3 py-2"
          style={{
            background: "#fff3cd",
            color: "#856404",
          }}
        >
          <Clock3
            size={14}
            className="me-1"
          />
          En attente
        </span>
      );
    }

    if (status === "REJECTED") {
      return (
        <span className="badge rounded-pill bg-danger px-3 py-2">
          <AlertCircle
            size={14}
            className="me-1"
          />
          Rejeté
        </span>
      );
    }

    return (
      <span className="badge rounded-pill bg-secondary px-3 py-2">
        {status || "Inconnu"}
      </span>
    );
  };

  return (
    <div className="container-fluid py-4">

      {/* ============================================
          HEADER
      ============================================ */}

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

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

            <div className="d-flex align-items-center gap-3">

              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "58px",
                  height: "58px",
                  borderRadius: "16px",
                  background: "#e8f5ee",
                  color: "#198754",
                }}
              >
                <FileCheck2 size={30} />
              </div>

              <div>

                <h2
                  className="fw-bold mb-1"
                  style={{
                    color: "#173b2b",
                  }}
                >
                  Valider une naissance
                </h2>

                <p className="text-muted mb-0">
                  Vérifiez et validez les actes de
                  naissance en attente.
                </p>

              </div>

            </div>

            <button
              type="button"
              className="btn btn-light border d-flex align-items-center gap-2"
              onClick={loadBirths}
              disabled={loadingBirths}
            >
              <RefreshCw
                size={18}
                className={
                  loadingBirths
                    ? "spin"
                    : ""
                }
              />

              Actualiser
            </button>

          </div>

        </div>
      </div>

      {/* ============================================
          STATISTIQUES
      ============================================ */}

      <div className="row g-3 mb-4">

        {/* EN ATTENTE */}

        <div className="col-md-4">

          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderRadius: "16px",
              borderLeft:
                "5px solid #ffc107",
            }}
          >

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <small className="text-muted">
                    Actes en attente
                  </small>

                  <h2
                    className="fw-bold mb-0 mt-1"
                    style={{
                      color: "#856404",
                    }}
                  >
                    {births.length}
                  </h2>

                </div>

                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "14px",
                    background:
                      "#fff3cd",
                    color: "#d39e00",
                  }}
                >
                  <Clock3 size={25} />
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* VALIDATION */}

        <div className="col-md-4">

          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderRadius: "16px",
              borderLeft:
                "5px solid #198754",
            }}
          >

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <small className="text-muted">
                    État du service
                  </small>

                  <h5 className="fw-bold text-success mb-0 mt-2">
                    Prêt à valider
                  </h5>

                </div>

                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "14px",
                    background:
                      "#e8f5ee",
                    color: "#198754",
                  }}
                >
                  <ShieldCheck
                    size={25}
                  />
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* TOTAL */}

        <div className="col-md-4">

          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderRadius: "16px",
              borderLeft:
                "5px solid #dc3545",
            }}
          >

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <small className="text-muted">
                    Contrôle administratif
                  </small>

                  <h5 className="fw-bold mb-0 mt-2">
                    Vérification requise
                  </h5>

                </div>

                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "14px",
                    background:
                      "#fdecec",
                    color: "#dc3545",
                  }}
                >
                  <Clipboard
                    size={25}
                  />
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ============================================
          VALIDATION PAR IDENTIFIANT
      ============================================ */}

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
              "linear-gradient(90deg, #198754 0%, #198754 50%, #ffc107 50%, #ffc107 100%)",
          }}
        />

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
              <Hash size={23} />
            </div>

            <div>

              <h5
                className="fw-bold mb-1"
                style={{
                  color: "#173b2b",
                }}
              >
                Validation par identifiant
              </h5>

              <small className="text-muted">
                Saisissez directement l'identifiant
                de la naissance à valider.
              </small>

            </div>

          </div>

          <form
            onSubmit={handleValidate}
          >

            <div className="row g-3">

              <div className="col-lg-9">

                <div className="input-group input-group-lg">

                  <span className="input-group-text bg-light border-end-0">
                    <Search
                      size={20}
                      className="text-success"
                    />
                  </span>

                  <input
                    className="form-control border-start-0"
                    value={identifier}
                    onChange={(e) =>
                      setIdentifier(
                        e.target.value
                      )
                    }
                    placeholder="Ex : clhb123456"
                  />

                </div>

              </div>

              <div className="col-lg-3">

                <button
                  className="btn btn-success btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                  type="submit"
                  disabled={loading}
                >

                  {loading ? (
                    <>
                      <Loader2
                        size={20}
                        className="spin"
                      />
                      Validation...
                    </>
                  ) : (
                    <>
                      <CheckCircle2
                        size={20}
                      />
                      Valider l'acte
                    </>
                  )}

                </button>

              </div>

            </div>

          </form>

        </div>
      </div>

      {/* ============================================
          ALERTES
      ============================================ */}

      {message && (
        <div
          className="alert border-0 shadow-sm d-flex align-items-center gap-3 mb-4"
          style={{
            background: "#e9f7ef",
            color: "#146c43",
            borderRadius: "14px",
          }}
        >

          <CheckCircle2 size={23} />

          <div>

            <strong>
              Validation réussie
            </strong>

            <div className="small">
              {message}
            </div>

          </div>

        </div>
      )}

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

            <strong>
              Une erreur est survenue
            </strong>

            <div className="small">
              {error}
            </div>

          </div>

        </div>
      )}

      {copyMessage && (
        <div
          className="alert border-0 shadow-sm d-flex align-items-center gap-3 mb-4"
          style={{
            background: "#fff8df",
            color: "#856404",
            borderRadius: "14px",
          }}
        >

          <Copy size={21} />

          <div>
            {copyMessage}
          </div>

        </div>
      )}

      {/* ============================================
          LISTE
      ============================================ */}

      <div
        className="card border-0 shadow-sm overflow-hidden"
        style={{
          borderRadius: "18px",
        }}
      >

        <div className="card-body p-0">

          {/* HEADER TABLE */}

          <div className="p-4 border-bottom">

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">

              <div className="d-flex align-items-center gap-3">

                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "12px",
                    background:
                      "#fff4d6",
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
                    Naissances en attente
                  </h5>

                  <small className="text-muted">
                    {births.length} acte
                    {births.length > 1
                      ? "s"
                      : ""}{" "}
                    à traiter
                  </small>

                </div>

              </div>

              <span
                className="badge rounded-pill px-3 py-2"
                style={{
                  background:
                    "#fff3cd",
                  color: "#856404",
                }}
              >
                <Clock3
                  size={14}
                  className="me-1"
                />
                En attente
              </span>

            </div>

          </div>

          {/* TABLE */}

          <div className="table-responsive">

            <table className="table table-hover align-middle mb-0">

              <thead
                style={{
                  background: "#f8faf9",
                }}
              >

                <tr>

                  <th className="px-4 py-3">
                    Identifiant
                  </th>

                  <th className="py-3">
                    Enfant
                  </th>

                  <th className="py-3">
                    Date
                  </th>

                  <th className="py-3">
                    Lieu
                  </th>

                  <th className="py-3">
                    Statut
                  </th>

                  <th className="py-3 text-end px-4">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {loadingBirths ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="text-center py-5"
                    >

                      <Loader2
                        size={32}
                        className="text-success spin mb-2"
                      />

                      <div className="text-muted">
                        Chargement des
                        naissances...
                      </div>

                    </td>

                  </tr>

                ) : births.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="text-center py-5"
                    >

                      <div
                        className="d-flex align-items-center justify-content-center mx-auto mb-3"
                        style={{
                          width: "65px",
                          height: "65px",
                          borderRadius:
                            "18px",
                          background:
                            "#e8f5ee",
                          color:
                            "#198754",
                        }}
                      >
                        <CheckCircle2
                          size={32}
                        />
                      </div>

                      <h6 className="fw-bold">
                        Aucune naissance à
                        valider
                      </h6>

                      <p className="text-muted mb-0">
                        Tous les actes ont
                        été traités.
                      </p>

                    </td>

                  </tr>

                ) : (

                  births.map((b) => {

                    const rowId =
                      b.id ??
                      b._id ??
                      b.actNumber;

                    const isValidating =
                      validatingId ===
                      rowId;

                    return (
                      <tr
                        key={rowId}
                      >

                        {/* ID */}

                        <td className="px-4">

                          <div className="d-flex align-items-center gap-2">

                            <div
                              className="d-flex align-items-center justify-content-center flex-shrink-0"
                              style={{
                                width:
                                  "36px",
                                height:
                                  "36px",
                                borderRadius:
                                  "9px",
                                background:
                                  "#e8f5ee",
                                color:
                                  "#198754",
                              }}
                            >
                              <Hash
                                size={17}
                              />
                            </div>

                            <div>

                              <strong
                                className="d-block text-break"
                                style={{
                                  fontSize:
                                    "0.9rem",
                                  color:
                                    "#173b2b",
                                }}
                              >
                                {rowId}
                              </strong>

                              <button
                                type="button"
                                className="btn btn-link btn-sm p-0 text-muted d-flex align-items-center gap-1"
                                onClick={() =>
                                  handleCopy(
                                    rowId
                                  )
                                }
                              >
                                <Copy
                                  size={13}
                                />
                                Copier
                              </button>

                            </div>

                          </div>

                        </td>

                        {/* ENFANT */}

                        <td>

                          <div className="d-flex align-items-center gap-2">

                            <UserRound
                              size={18}
                              className="text-success"
                            />

                            <div>

                              <strong>
                                {b.childFirstname ||
                                  "—"}{" "}
                                {b.childLastname ||
                                  ""}
                              </strong>

                            </div>

                          </div>

                        </td>

                        {/* DATE */}

                        <td>

                          <div className="d-flex align-items-center gap-2">

                            <CalendarDays
                              size={17}
                              className="text-danger"
                            />

                            <span>
                              {b.birthDate
                                ? new Date(
                                    b.birthDate
                                  ).toLocaleDateString(
                                    "fr-FR"
                                  )
                                : "—"}
                            </span>

                          </div>

                        </td>

                        {/* LIEU */}

                        <td>

                          <div className="d-flex align-items-center gap-2">

                            <MapPin
                              size={17}
                              className="text-danger"
                            />

                            <span>
                              {b.birthPlace ||
                                "—"}
                            </span>

                          </div>

                        </td>

                        {/* STATUT */}

                        <td>
                          {getStatusBadge(
                            b.status
                          )}
                        </td>

                        {/* ACTION */}

                        <td className="text-end px-4">

                          <button
                            type="button"
                            className="btn btn-success d-inline-flex align-items-center gap-2"
                            onClick={() =>
                              handleValidateRow(
                                b
                              )
                            }
                            disabled={
                              loading ||
                              isValidating
                            }
                          >

                            {isValidating ? (
                              <>
                                <Loader2
                                  size={
                                    16
                                  }
                                  className="spin"
                                />

                                Validation...
                              </>
                            ) : (
                              <>
                                <CheckCircle2
                                  size={
                                    16
                                  }
                                />

                                Valider
                              </>
                            )}

                          </button>

                        </td>

                      </tr>
                    );
                  })

                )}

              </tbody>

            </table>

          </div>

        </div>
      </div>

      {/* ============================================
          INFORMATION
      ============================================ */}

      <div
        className="card border-0 shadow-sm mt-4"
        style={{
          borderRadius: "16px",
          background: "#fffdf5",
        }}
      >

        <div className="card-body p-4">

          <div className="d-flex align-items-start gap-3">

            <div
              className="d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "11px",
                background: "#fff3cd",
                color: "#d39e00",
              }}
            >
              <ShieldCheck size={21} />
            </div>

            <div>

              <h6 className="fw-bold mb-1">
                Contrôle avant validation
              </h6>

              <p className="text-muted small mb-0">
                Vérifiez attentivement les
                informations de l'enfant et les
                documents associés avant de valider
                définitivement l'acte de naissance.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ============================================
          STYLE
      ============================================ */}

      <style>
        {`
          .table tbody tr {
            transition: background 0.2s ease;
          }

          .table tbody tr:hover {
            background: #f8faf9;
          }

          .btn {
            transition: all 0.2s ease;
          }

          .btn:hover:not(:disabled) {
            transform: translateY(-1px);
          }

          .form-control:focus {
            border-color: #198754;
            box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.12);
          }

          .spin {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          @media (max-width: 768px) {
            .table {
              min-width: 900px;
            }
          }
        `}
      </style>

    </div>
  );
};

export default ValidateBirth;