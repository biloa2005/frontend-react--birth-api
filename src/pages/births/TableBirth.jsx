import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllBirths,
  getBirthDetailsByPost,
  getBirthHistory,
  deleteBirth,
} from "../../api/birthApi";

import {
  Baby,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Paperclip,
  Printer,
  MapPin,
  CalendarDays,
  UserRound,
  BriefcaseBusiness,
  FileText,
  Clock3,
  CheckCircle2,
  XCircle,
  Archive,
  Search,
  X,
  History,
  RefreshCw,
  AlertCircle,
  VenusAndMars,
} from "lucide-react";

const BirthTable = () => {
  const navigate = useNavigate();

  const [births, setBirths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // =========================================================
  // CHARGEMENT
  // =========================================================

  const loadBirths = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllBirths();

      setBirths(response.allBirth ?? []);
    } catch (error) {
      console.error(error);

      setError(
        "Impossible de récupérer les naissances."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBirths();
  }, []);

  // =========================================================
  // DETAILS
  // =========================================================

  const handleShowDetails = async (id) => {
    if (!id) return;

    setDetailError("");
    setSelectedDetails(null);
    setShowDetails(true);
    setDetailLoading(true);

    try {
      const res = await getBirthDetailsByPost(id);

      if (res?.success) {
        const details = res.data ?? null;

        setSelectedDetails(details);

        let hist =
          details?.history ??
          details?.histories ??
          null;

        if (!hist) {
          try {
            const hres = await getBirthHistory(id);

            hist =
              hres?.data ??
              hres ??
              null;
          } catch (hErr) {
            console.warn(
              "Impossible de récupérer l'historique",
              hErr
            );
          }
        }

        if (hist) {
          setSelectedDetails((prev) => ({
            ...(prev ?? {}),
            history: hist,
          }));
        }
      } else {
        setDetailError(
          res?.message ||
            "Aucun acte trouvé."
        );
      }
    } catch (err) {
      console.error(err);

      setDetailError(
        err?.response?.data?.message ||
          err.message ||
          "Erreur lors de la récupération des détails."
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedDetails(null);
    setDetailError("");
  };

  // =========================================================
  // SUPPRESSION
  // =========================================================

  const handleDeleteBirth = async (id) => {
    if (!id) return;

    if (
      !window.confirm(
        "Confirmer la suppression de cette naissance non validée ?"
      )
    ) {
      return;
    }

    setDeleteLoading(true);
    setError("");

    try {
      const res = await deleteBirth(id);

      if (res?.success) {
        setBirths((prev) =>
          prev.filter(
            (birth) =>
              (birth.id ||
                birth._id ||
                birth.actNumber) !== id
          )
        );
      } else {
        setError(
          res?.message ||
            "Impossible de supprimer la naissance."
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Erreur lors de la suppression."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // =========================================================
  // STATUT
  // =========================================================

  const getStatusConfig = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return {
          label: "Validée",
          className: "status-approved",
          icon: <CheckCircle2 size={14} />,
        };

      case "PENDING":
        return {
          label: "En attente",
          className: "status-pending",
          icon: <Clock3 size={14} />,
        };

      case "REJECTED":
        return {
          label: "Rejetée",
          className: "status-rejected",
          icon: <XCircle size={14} />,
        };

      case "ARCHIVED":
        return {
          label: "Archivée",
          className: "status-archived",
          icon: <Archive size={14} />,
        };

      default:
        return {
          label: status || "Inconnu",
          className: "status-default",
          icon: <FileText size={14} />,
        };
    }
  };

  // =========================================================
  // FILTRAGE
  // =========================================================

  const filteredBirths = births.filter((birth) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      !search ||
      birth.actNumber
        ?.toLowerCase()
        .includes(search) ||
      birth.childFirstname
        ?.toLowerCase()
        .includes(search) ||
      birth.childLastname
        ?.toLowerCase()
        .includes(search) ||
      birth.birthPlace
        ?.toLowerCase()
        .includes(search);

    const matchesStatus =
      statusFilter === "ALL" ||
      birth.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="birth-page">
        <div className="loading-container">
          <div className="loader"></div>

          <h3>
            Chargement des naissances
          </h3>

          <p>
            Récupération des actes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="birth-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="page-header">

        <div className="page-title-wrapper">

          <div className="page-icon">
            <Baby size={30} />
          </div>

          <div>
            <h1>
              Gestion des naissances
            </h1>

            <p>
              Consultez et gérez les actes
              de naissance enregistrés.
            </p>
          </div>

        </div>

        <div className="header-actions">

          <button
            className="refresh-btn"
            onClick={loadBirths}
          >
            <RefreshCw size={17} />
            Actualiser
          </button>

          <button
            className="create-btn"
            onClick={() =>
              navigate("/births/create")
            }
          >
            <Plus size={18} />
            Nouvelle naissance
          </button>

        </div>

      </div>

      {/* =====================================================
          TRICOLORE
      ===================================================== */}

      <div className="cameroon-line">
        <span className="green"></span>
        <span className="red"></span>
        <span className="yellow"></span>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="error-alert">

          <AlertCircle size={20} />

          <span>{error}</span>

          <button
            onClick={() => setError("")}
          >
            <X size={16} />
          </button>

        </div>
      )}

      {/* =====================================================
          STATISTICS RAPIDES
      ===================================================== */}

      <div className="quick-stats">

        <div className="quick-card">
          <div className="quick-icon green-icon">
            <FileText size={19} />
          </div>

          <div>
            <span>Total</span>
            <strong>{births.length}</strong>
          </div>
        </div>

        <div className="quick-card">
          <div className="quick-icon yellow-icon">
            <Clock3 size={19} />
          </div>

          <div>
            <span>En attente</span>
            <strong>
              {
                births.filter(
                  (b) => b.status === "PENDING"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="quick-card">
          <div className="quick-icon approved-icon">
            <CheckCircle2 size={19} />
          </div>

          <div>
            <span>Validées</span>
            <strong>
              {
                births.filter(
                  (b) => b.status === "APPROVED"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="quick-card">
          <div className="quick-icon red-icon">
            <XCircle size={19} />
          </div>

          <div>
            <span>Rejetées</span>
            <strong>
              {
                births.filter(
                  (b) => b.status === "REJECTED"
                ).length
              }
            </strong>
          </div>
        </div>

      </div>

      {/* =====================================================
          TABLE CARD
      ===================================================== */}

      <div className="birth-card">

        {/* TABLE HEADER */}

        <div className="table-header">

          <div>
            <h2>
              Liste des actes
            </h2>

            <p>
              {filteredBirths.length} acte(s)
              trouvé(s)
            </p>
          </div>

          <div className="filters">

            {/* RECHERCHE */}

            <div className="search-box">

              <Search size={17} />

              <input
                type="text"
                placeholder="Rechercher un acte, un enfant..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
              />

              {searchTerm && (
                <button
                  onClick={() =>
                    setSearchTerm("")
                  }
                >
                  <X size={14} />
                </button>
              )}

            </div>

            {/* FILTRE */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="status-select"
            >
              <option value="ALL">
                Tous les statuts
              </option>

              <option value="PENDING">
                En attente
              </option>

              <option value="APPROVED">
                Validées
              </option>

              <option value="REJECTED">
                Rejetées
              </option>

              <option value="ARCHIVED">
                Archivées
              </option>
            </select>

          </div>

        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="table-wrapper">

          <table className="birth-table">

            <thead>

              <tr>

                <th>ACTE</th>

                <th>ENFANT</th>

                <th>NAISSANCE</th>

                <th>LIEU</th>

                <th>SEXE</th>

                <th>STATUT</th>

                <th className="actions-column">
                  ACTIONS
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredBirths.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="empty-cell"
                  >

                    <div className="empty-state">

                      <div className="empty-icon">
                        <Baby size={30} />
                      </div>

                      <h3>
                        Aucune naissance trouvée
                      </h3>

                      <p>
                        Aucun acte ne correspond
                        à votre recherche.
                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

                filteredBirths.map((birth) => {

                  const birthId =
                    birth.id ||
                    birth._id ||
                    birth.actNumber;

                  const status =
                    getStatusConfig(
                      birth.status
                    );

                  return (

                    <tr key={birthId}>

                      {/* ACTE */}

                      <td>

                        <div className="act-info">

                          <div className="act-icon">
                            <FileText size={17} />
                          </div>

                          <div>
                            <strong>
                              {birth.actNumber ??
                                birth.id}
                            </strong>

                            <small>
                              Numéro d'acte
                            </small>
                          </div>

                        </div>

                      </td>

                      {/* ENFANT */}

                      <td>

                        <div className="child-info">

                          <div className="child-avatar">
                            <Baby size={19} />
                          </div>

                          <div>

                            <strong>
                              {birth.childFirstname}{" "}
                              {birth.childLastname}
                            </strong>

                            <small>
                              Enfant
                            </small>

                          </div>

                        </div>

                      </td>

                      {/* DATE */}

                      <td>

                        <div className="birth-date">

                          <CalendarDays
                            size={16}
                          />

                          <span>
                            {birth.birthDate
                              ? new Date(
                                  birth.birthDate
                                ).toLocaleDateString(
                                  "fr-FR"
                                )
                              : "—"}
                          </span>

                        </div>

                      </td>

                      {/* LIEU */}

                      <td>

                        <div className="place-info">

                          <MapPin size={16} />

                          <span>
                            {birth.birthPlace ||
                              "Non renseigné"}
                          </span>

                        </div>

                      </td>

                      {/* SEXE */}

                      <td>

                        <div className="sex-info">

                          <VenusAndMars
                            size={16}
                          />

                          <span>
                            {birth.sex === "MALE"
                              ? "Masculin"
                              : birth.sex ===
                                "FEMALE"
                              ? "Féminin"
                              : birth.sex ||
                                "—"}
                          </span>

                        </div>

                      </td>

                      {/* STATUT */}

                      <td>

                        <span
                          className={`status-badge ${status.className}`}
                        >
                          {status.icon}
                          {status.label}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="action-buttons">

                          {/* DETAILS */}

                          <button
                            className="action-btn details"
                            title="Voir les détails"
                            onClick={() =>
                              handleShowDetails(
                                birthId
                              )
                            }
                          >
                            <Eye size={16} />
                          </button>

                          {/* MODIFIER */}

                          {birth.status !==
                            "APPROVED" && (
                            <button
                              className="action-btn edit"
                              title="Modifier"
                              onClick={() =>
                                navigate(
                                  `/births/${birthId}/edit`
                                )
                              }
                            >
                              <Pencil size={16} />
                            </button>
                          )}

                          {/* PIECE JOINTE */}

                          {birth.status !==
                            "APPROVED" && (
                            <button
                              className="action-btn attachment"
                              title="Pièces jointes"
                              onClick={() =>
                                navigate(
                                  `/births/${birthId}/attachments`
                                )
                              }
                            >
                              <Paperclip
                                size={16}
                              />
                            </button>
                          )}

                          {/* IMPRIMER */}

                          {birth.status ===
                            "APPROVED" && (
                            <button
                              className="action-btn print"
                              title="Imprimer"
                              onClick={() =>
                                navigate(
                                  `/births/${birthId}/print`
                                )
                              }
                            >
                              <Printer size={16} />
                            </button>
                          )}

                          {/* SUPPRIMER */}

                          {birth.status ===
                            "PENDING" && (
                            <button
                              className="action-btn delete"
                              title="Supprimer"
                              disabled={
                                deleteLoading
                              }
                              onClick={() =>
                                handleDeleteBirth(
                                  birthId
                                )
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                          )}

                        </div>

                      </td>

                    </tr>

                  );
                })

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =====================================================
          MODAL DETAILS
      ===================================================== */}

      {showDetails && (
        <>

          <div
            className="details-overlay"
            onClick={closeDetails}
          ></div>

          <div className="details-modal">

            {/* HEADER */}

            <div className="modal-header-custom">

              <div className="modal-title-wrapper">

                <div className="modal-icon">
                  <FileText size={22} />
                </div>

                <div>

                  <h2>
                    Détails de la naissance
                  </h2>

                  <p>
                    Informations complètes
                    de l'acte
                  </p>

                </div>

              </div>

              <button
                className="modal-close"
                onClick={closeDetails}
              >
                <X size={20} />
              </button>

            </div>

            {/* BODY */}

            <div className="modal-body-custom">

              {detailLoading ? (

                <div className="modal-loading">

                  <div className="loader"></div>

                  <p>
                    Chargement des détails...
                  </p>

                </div>

              ) : detailError ? (

                <div className="modal-error">

                  <AlertCircle size={22} />

                  <span>
                    {detailError}
                  </span>

                </div>

              ) : selectedDetails ? (

                <>

                  {/* INFORMATIONS ENFANT */}

                  <div className="detail-section">

                    <div className="detail-section-title">

                      <div className="section-title-icon green-bg">
                        <Baby size={18} />
                      </div>

                      <div>
                        <h3>
                          Informations de l'enfant
                        </h3>

                        <p>
                          Informations principales
                        </p>
                      </div>

                    </div>

                    <div className="details-grid">

                      <DetailItem
                        icon={<FileText size={16} />}
                        label="Numéro d'acte"
                        value={
                          selectedDetails.actNumber
                        }
                      />

                      <DetailItem
                        icon={<UserRound size={16} />}
                        label="Nom complet"
                        value={`${selectedDetails.childFirstname ?? ""} ${
                          selectedDetails.childLastname ?? ""
                        }`}
                      />

                      <DetailItem
                        icon={
                          <CalendarDays size={16} />
                        }
                        label="Date de naissance"
                        value={
                          selectedDetails.birthDate
                            ? new Date(
                                selectedDetails.birthDate
                              ).toLocaleDateString(
                                "fr-FR"
                              )
                            : "Non renseignée"
                        }
                      />

                      <DetailItem
                        icon={<MapPin size={16} />}
                        label="Lieu de naissance"
                        value={
                          selectedDetails.birthPlace ||
                          "Non renseigné"
                        }
                      />

                      <DetailItem
                        icon={
                          <VenusAndMars size={16} />
                        }
                        label="Sexe"
                        value={
                          selectedDetails.sex ===
                          "MALE"
                            ? "Masculin"
                            : selectedDetails.sex ===
                              "FEMALE"
                            ? "Féminin"
                            : selectedDetails.sex ||
                              "Non renseigné"
                        }
                      />

                    </div>

                  </div>

                  {/* PARENTS */}

                  <div className="detail-section">

                    <div className="detail-section-title">

                      <div className="section-title-icon red-bg">
                        <UserRound size={18} />
                      </div>

                      <div>
                        <h3>
                          Parents
                        </h3>

                        <p>
                          Informations sur les parents
                        </p>
                      </div>

                    </div>

                    {selectedDetails.parents &&
                    Array.isArray(
                      selectedDetails.parents
                    ) &&
                    selectedDetails.parents.length >
                      0 ? (

                      <div className="parents-grid">

                        {selectedDetails.parents.map(
                          (parent, index) => (

                            <div
                              key={
                                parent.id ??
                                index
                              }
                              className="parent-card"
                            >

                              {/* PERE */}

                              <div className="parent-detail">

                                <div className="parent-avatar father-avatar">
                                  <UserRound
                                    size={18}
                                  />
                                </div>

                                <div>

                                  <span>
                                    Père
                                  </span>

                                  <strong>
                                    {parent.fatherName ||
                                      "Non renseigné"}
                                  </strong>

                                  <small>
                                    <BriefcaseBusiness
                                      size={12}
                                    />

                                    {parent.fatherJob ||
                                      "Métier non renseigné"}
                                  </small>

                                </div>

                              </div>

                              <div className="parent-divider"></div>

                              {/* MERE */}

                              <div className="parent-detail">

                                <div className="parent-avatar mother-avatar">
                                  <UserRound
                                    size={18}
                                  />
                                </div>

                                <div>

                                  <span>
                                    Mère
                                  </span>

                                  <strong>
                                    {parent.motherName ||
                                      "Non renseigné"}
                                  </strong>

                                  <small>
                                    <BriefcaseBusiness
                                      size={12}
                                    />

                                    {parent.motherJob ||
                                      "Métier non renseigné"}
                                  </small>

                                </div>

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    ) : (

                      <div className="no-data">
                        <UserRound size={20} />
                        <span>
                          Aucun parent renseigné
                        </span>
                      </div>

                    )}

                  </div>

                  {/* HISTORIQUE */}

                  {selectedDetails.history &&
                    Array.isArray(
                      selectedDetails.history
                    ) &&
                    selectedDetails.history.length >
                      0 && (

                      <div className="detail-section">

                        <div className="detail-section-title">

                          <div className="section-title-icon yellow-bg">
                            <History size={18} />
                          </div>

                          <div>
                            <h3>
                              Historique
                            </h3>

                            <p>
                              Historique des actions
                            </p>
                          </div>

                        </div>

                        <div className="history-list">

                          {selectedDetails.history.map(
                            (h, i) => {

                              const actor =
                                h.userId ??
                                h.by ??
                                h.user ??
                                "";

                              const date =
                                h.createdAt ??
                                h.date ??
                                h.ts ??
                                null;

                              return (

                                <div
                                  key={
                                    h.id ?? i
                                  }
                                  className="history-item"
                                >

                                  <div className="history-dot">
                                    <History
                                      size={14}
                                    />
                                  </div>

                                  <div>

                                    <strong>
                                      {h.action ??
                                        h.type ??
                                        "ACTION"}
                                    </strong>

                                    <p>
                                      {actor &&
                                        `Par ${actor}`}

                                      {date &&
                                        ` — ${new Date(
                                          date
                                        ).toLocaleString(
                                          "fr-FR"
                                        )}`}
                                    </p>

                                  </div>

                                </div>

                              );
                            }
                          )}

                        </div>

                      </div>

                    )}

                </>

              ) : (

                <div className="no-data">
                  Aucun détail disponible.
                </div>

              )}

            </div>

            {/* FOOTER */}

            <div className="modal-footer-custom">

              <button
                className="close-modal-btn"
                onClick={closeDetails}
              >
                Fermer
              </button>

            </div>

          </div>

        </>
      )}

      {/* =====================================================
          CSS
      ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .birth-page {
          min-height: 100vh;
          background: #f6f8f7;
          padding: 28px;
          color: #202b25;
        }

        /* ================= HEADER ================= */

        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 18px;
        }

        .page-title-wrapper {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .page-icon {
          width: 58px;
          height: 58px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            135deg,
            #007a3d,
            #0ba653
          );
          color: white;
          box-shadow: 0 8px 22px rgba(
            0,
            122,
            61,
            .22
          );
        }

        .page-header h1 {
          margin: 0;
          font-size: 27px;
          font-weight: 800;
        }

        .page-header p {
          margin: 5px 0 0;
          color: #7b8781;
          font-size: 13px;
        }

        .header-actions {
          display: flex;
          gap: 9px;
        }

        .refresh-btn,
        .create-btn {
          border: none;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 16px;
          border-radius: 10px;
          font-weight: 650;
          cursor: pointer;
          transition: .2s;
        }

        .refresh-btn {
          background: white;
          color: #007a3d;
          border: 1px solid #e3eae6;
        }

        .create-btn {
          background: #007a3d;
          color: white;
          box-shadow: 0 6px 16px rgba(
            0,
            122,
            61,
            .2
          );
        }

        .refresh-btn:hover,
        .create-btn:hover {
          transform: translateY(-2px);
        }

        /* ================= TRICOLORE ================= */

        .cameroon-line {
          height: 5px;
          display: flex;
          overflow: hidden;
          border-radius: 10px;
          margin-bottom: 24px;
        }

        .cameroon-line span {
          flex: 1;
        }

        .green {
          background: #007a3d;
        }

        .red {
          background: #ce1126;
        }

        .yellow {
          background: #fcd116;
        }

        /* ================= ERROR ================= */

        .error-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fff0f2;
          color: #b20e24;
          border: 1px solid #ffd1d8;
          border-radius: 12px;
          padding: 13px 15px;
          margin-bottom: 20px;
          font-size: 13px;
        }

        .error-alert button {
          margin-left: auto;
          border: none;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        /* ================= QUICK STATS ================= */

        .quick-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 22px;
        }

        .quick-card {
          background: white;
          border-radius: 14px;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 4px 18px rgba(
            0,
            0,
            0,
            .045
          );
        }

        .quick-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .green-icon {
          background: #e5f5ec;
          color: #007a3d;
        }

        .yellow-icon {
          background: #fff5d4;
          color: #a17600;
        }

        .approved-icon {
          background: #e5f7ec;
          color: #087f3e;
        }

        .red-icon {
          background: #fde8eb;
          color: #ce1126;
        }

        .quick-card span {
          display: block;
          color: #8b9690;
          font-size: 11px;
        }

        .quick-card strong {
          display: block;
          margin-top: 2px;
          font-size: 21px;
        }

        /* ================= TABLE CARD ================= */

        .birth-card {
          background: white;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 5px 24px rgba(
            0,
            0,
            0,
            .055
          );
        }

        .table-header {
          padding: 21px 23px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          border-bottom: 1px solid #edf1ef;
        }

        .table-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 780;
        }

        .table-header p {
          margin: 4px 0 0;
          color: #929c97;
          font-size: 11px;
        }

        .filters {
          display: flex;
          gap: 9px;
        }

        .search-box {
          width: 280px;
          height: 40px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 11px;
          border: 1px solid #e1e7e4;
          border-radius: 9px;
          color: #849089;
        }

        .search-box input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 12px;
        }

        .search-box button {
          border: none;
          background: transparent;
          color: #89938e;
          cursor: pointer;
        }

        .status-select {
          height: 40px;
          border: 1px solid #e1e7e4;
          border-radius: 9px;
          padding: 0 11px;
          outline: none;
          color: #59655f;
          background: white;
          font-size: 12px;
        }

        /* ================= TABLE ================= */

        .table-wrapper {
          overflow-x: auto;
        }

        .birth-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1050px;
        }

        .birth-table thead {
          background: #f8faf9;
        }

        .birth-table th {
          padding: 13px 19px;
          text-align: left;
          color: #7d8983;
          font-size: 10px;
          letter-spacing: .5px;
          font-weight: 800;
          border-bottom: 1px solid #edf1ef;
        }

        .birth-table td {
          padding: 15px 19px;
          border-bottom: 1px solid #f0f2f1;
          vertical-align: middle;
        }

        .birth-table tbody tr {
          transition: .15s;
        }

        .birth-table tbody tr:hover {
          background: #f9fcfa;
        }

        /* ================= ACT ================= */

        .act-info,
        .child-info {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .act-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: #fff4cf;
          color: #a37900;
        }

        .act-info strong,
        .child-info strong {
          display: block;
          font-size: 12px;
        }

        .act-info small,
        .child-info small {
          display: block;
          margin-top: 3px;
          color: #9aa39e;
          font-size: 9px;
        }

        .child-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e5f5ec;
          color: #007a3d;
        }

        /* ================= OTHER COLUMNS ================= */

        .birth-date,
        .place-info,
        .sex-info {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #68736d;
          font-size: 11px;
          white-space: nowrap;
        }

        .birth-date svg {
          color: #007a3d;
        }

        .place-info svg {
          color: #ce1126;
        }

        .sex-info svg {
          color: #a17600;
        }

        /* ================= STATUS ================= */

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 750;
          white-space: nowrap;
        }

        .status-approved {
          background: #e5f7ec;
          color: #087f3e;
        }

        .status-pending {
          background: #fff5d4;
          color: #967000;
        }

        .status-rejected {
          background: #fde8eb;
          color: #b20e24;
        }

        .status-archived {
          background: #eef0f1;
          color: #5f6863;
        }

        .status-default {
          background: #f0f2f1;
          color: #68736d;
        }

        /* ================= ACTIONS ================= */

        .actions-column {
          text-align: center !important;
        }

        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 5px;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: .18s;
        }

        .action-btn:hover {
          transform: translateY(-2px);
        }

        .details {
          background: #e7f3ff;
          color: #1768a8;
        }

        .edit {
          background: #e8f5ee;
          color: #007a3d;
        }

        .attachment {
          background: #fff5d5;
          color: #9a7100;
        }

        .print {
          background: #e5f7ec;
          color: #087f3e;
        }

        .delete {
          background: #fde8eb;
          color: #ce1126;
        }

        .action-btn:disabled {
          opacity: .45;
          cursor: not-allowed;
        }

        /* ================= EMPTY ================= */

        .empty-cell {
          padding: 0 !important;
        }

        .empty-state {
          padding: 60px 20px;
          text-align: center;
        }

        .empty-icon {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: auto;
          background: #eef5f1;
          color: #007a3d;
        }

        .empty-state h3 {
          margin: 13px 0 5px;
          font-size: 15px;
        }

        .empty-state p {
          margin: 0;
          color: #929c97;
          font-size: 12px;
        }

        /* ================= MODAL ================= */

        .details-overlay {
          position: fixed;
          inset: 0;
          background: rgba(
            10,
            22,
            16,
            .58
          );
          backdrop-filter: blur(3px);
          z-index: 1000;
        }

        .details-modal {
          position: fixed;
          z-index: 1001;
          width: min(
            850px,
            calc(100% - 30px)
          );
          max-height: calc(100vh - 40px);
          overflow-y: auto;
          left: 50%;
          top: 50%;
          transform: translate(
            -50%,
            -50%
          );
          background: white;
          border-radius: 18px;
          box-shadow: 0 25px 70px rgba(
            0,
            0,
            0,
            .25
          );
        }

        .modal-header-custom {
          padding: 20px 23px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #edf1ef;
          position: sticky;
          top: 0;
          background: white;
          z-index: 2;
        }

        .modal-title-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-icon {
          width: 43px;
          height: 43px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: #e7f4ed;
          color: #007a3d;
        }

        .modal-header-custom h2 {
          margin: 0;
          font-size: 18px;
        }

        .modal-header-custom p {
          margin: 3px 0 0;
          color: #8b9690;
          font-size: 11px;
        }

        .modal-close {
          width: 35px;
          height: 35px;
          border: none;
          border-radius: 9px;
          background: #f2f4f3;
          color: #64706a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .modal-body-custom {
          padding: 22px;
        }

        /* ================= DETAIL SECTION ================= */

        .detail-section {
          margin-bottom: 25px;
        }

        .detail-section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }

        .section-title-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .green-bg {
          background: #e5f5ec;
          color: #007a3d;
        }

        .red-bg {
          background: #fde8eb;
          color: #ce1126;
        }

        .yellow-bg {
          background: #fff5d4;
          color: #a17600;
        }

        .detail-section-title h3 {
          margin: 0;
          font-size: 14px;
        }

        .detail-section-title p {
          margin: 3px 0 0;
          font-size: 10px;
          color: #929c97;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(
            2,
            1fr
          );
          gap: 10px;
        }

        .detail-item {
          padding: 13px;
          border: 1px solid #edf1ef;
          border-radius: 11px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .detail-item-icon {
          width: 33px;
          height: 33px;
          border-radius: 8px;
          background: #f1f6f3;
          color: #007a3d;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .detail-item span {
          display: block;
          color: #8d9892;
          font-size: 9px;
        }

        .detail-item strong {
          display: block;
          margin-top: 3px;
          font-size: 12px;
        }

        /* ================= PARENTS ================= */

        .parents-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        .parent-card {
          border: 1px solid #edf1ef;
          border-radius: 12px;
          padding: 15px;
        }

        .parent-detail {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .parent-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .father-avatar {
          background: #e8f1ff;
          color: #2464b5;
        }

        .mother-avatar {
          background: #fff0f2;
          color: #c2354b;
        }

        .parent-detail span {
          display: block;
          color: #919b96;
          font-size: 9px;
        }

        .parent-detail strong {
          display: block;
          font-size: 12px;
          margin-top: 2px;
        }

        .parent-detail small {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 3px;
          color: #89938e;
          font-size: 10px;
        }

        .parent-divider {
          height: 1px;
          background: #edf1ef;
          margin: 13px 0;
        }

        /* ================= HISTORY ================= */

        .history-list {
          display: flex;
          flex-direction: column;
        }

        .history-item {
          display: flex;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid #edf1ef;
        }

        .history-dot {
          width: 30px;
          height: 30px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #fff5d4;
          color: #a17600;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .history-item strong {
          font-size: 11px;
        }

        .history-item p {
          margin: 3px 0 0;
          color: #8b9690;
          font-size: 10px;
        }

        /* ================= NO DATA ================= */

        .no-data {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 20px;
          border-radius: 10px;
          background: #f7f9f8;
          color: #89938e;
          font-size: 12px;
        }

        /* ================= MODAL FOOTER ================= */

        .modal-footer-custom {
          padding: 15px 22px;
          border-top: 1px solid #edf1ef;
          display: flex;
          justify-content: flex-end;
        }

        .close-modal-btn {
          border: none;
          padding: 9px 17px;
          border-radius: 9px;
          background: #007a3d;
          color: white;
          font-weight: 650;
          cursor: pointer;
        }

        /* ================= LOADING ================= */

        .loading-container {
          min-height: 70vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .loading-container h3 {
          margin: 12px 0 3px;
          font-size: 16px;
        }

        .loading-container p {
          margin: 0;
          color: #8d9892;
          font-size: 12px;
        }

        .loader {
          width: 42px;
          height: 42px;
          border: 4px solid #e4eee8;
          border-top-color: #007a3d;
          border-radius: 50%;
          animation: spin .8s linear infinite;
        }

        .modal-loading {
          padding: 50px;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #87918c;
        }

        .modal-loading .loader {
          width: 35px;
          height: 35px;
        }

        .modal-error {
          padding: 18px;
          background: #fff0f2;
          color: #b20e24;
          border-radius: 10px;
          display: flex;
          gap: 8px;
          align-items: center;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 1100px) {

          .quick-stats {
            grid-template-columns:
              repeat(2, 1fr);
          }

        }

        @media (max-width: 800px) {

          .birth-page {
            padding: 16px;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-actions {
            width: 100%;
          }

          .refresh-btn,
          .create-btn {
            flex: 1;
            justify-content: center;
          }

          .table-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .filters {
            width: 100%;
            flex-direction: column;
          }

          .search-box {
            width: 100%;
          }

          .status-select {
            width: 100%;
          }

        }

        @media (max-width: 550px) {

          .quick-stats {
            grid-template-columns: 1fr;
          }

          .page-title-wrapper {
            align-items: flex-start;
          }

          .page-header h1 {
            font-size: 22px;
          }

          .page-icon {
            width: 48px;
            height: 48px;
          }

          .header-actions {
            flex-direction: column;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          .details-modal {
            width: calc(100% - 20px);
            max-height: calc(100vh - 20px);
          }

          .modal-body-custom {
            padding: 16px;
          }

        }

      `}</style>
    </div>
  );
};

// =========================================================
// COMPOSANT DETAIL ITEM
// =========================================================

const DetailItem = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="detail-item">

      <div className="detail-item-icon">
        {icon}
      </div>

      <div>

        <span>
          {label}
        </span>

        <strong>
          {value || "Non renseigné"}
        </strong>

      </div>

    </div>
  );
};

export default BirthTable;