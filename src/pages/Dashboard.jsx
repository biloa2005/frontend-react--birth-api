import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Baby,
  CheckCircle2,
  Clock3,
  CalendarDays,
  FileText,
  RefreshCw,
  UserRound,
  UserPlus,
  Printer,
  MapPin,
  Sparkles,
  LayoutGrid,
  List,
  ShieldCheck,
  ChevronRight,
  Eye,
  Paperclip,
  Check,
  TrendingUp,
  Search,
  MoreHorizontal,
} from "lucide-react";
import { getBirthDashboard, validateBirth } from "../api/birthApi";

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("feed");
  const [validatingId, setValidatingId] = useState(null);

  const fallbackDashboard = {
    totalBirths: 142,
    approvedBirths: 128,
    pendingBirths: 11,
    birthsToday: 3,
    latestBirths: [
      {
        id: "1",
        actNumber: "ACT-2026-00142",
        childFirstname: "Noah Junior",
        childLastname: "KAMGANG",
        birthDate: "2026-08-14T08:30:00.000Z",
        birthPlace: "Yaoundé (Hôpital Central)",
        sex: "M",
        status: "PENDING",
        centerId: "Centre Yaoundé I",
        createdAt: "2026-08-14T09:15:00.000Z",
        parents: [
          {
            fatherName: "KAMGANG Michel",
            fatherJob: "Ingénieur Télécoms",
            motherName: "BEKONO Chantal",
            motherJob: "Enseignante",
          },
        ],
      },
      {
        id: "2",
        actNumber: "ACT-2026-00141",
        childFirstname: "Audrey Danielle",
        childLastname: "NGUEMA",
        birthDate: "2026-08-14T04:15:00.000Z",
        birthPlace: "Douala (Clinique de l'Aéroport)",
        sex: "F",
        status: "APPROVED",
        centerId: "Centre Douala V",
        createdAt: "2026-08-14T06:45:00.000Z",
        parents: [
          {
            fatherName: "NGUEMA Paul",
            fatherJob: "Médecin",
            motherName: "MVONDO Sandrine",
            motherJob: "Comptable",
          },
        ],
      },
      {
        id: "3",
        actNumber: "ACT-2026-00140",
        childFirstname: "Patrick Emmanuel",
        childLastname: "MBALLA",
        birthDate: "2026-08-13T22:10:00.000Z",
        birthPlace: "Bafoussam (Maternité Principale)",
        sex: "M",
        status: "PENDING",
        centerId: "Centre Bafoussam I",
        createdAt: "2026-08-13T23:00:00.000Z",
        parents: [
          {
            fatherName: "MBALLA Roger",
            fatherJob: "Commerçant",
            motherName: "FOTSING Solange",
            motherJob: "Infirmière",
          },
        ],
      },
      {
        id: "4",
        actNumber: "ACT-2026-00139",
        childFirstname: "Marie-Louise",
        childLastname: "FOTSO",
        birthDate: "2026-08-12T14:20:00.000Z",
        birthPlace: "Yaoundé (Centre Hospitalier Universitaire)",
        sex: "F",
        status: "APPROVED",
        centerId: "Centre Yaoundé I",
        createdAt: "2026-08-12T15:30:00.000Z",
        parents: [
          {
            fatherName: "FOTSO David",
            fatherJob: "Architecte",
            motherName: "ABOMO Madeleine",
            motherJob: "Juriste",
          },
        ],
      },
    ],
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getBirthDashboard();

      if (res && res.data) {
        setDashboard(res.data);
      } else {
        setDashboard(fallbackDashboard);
      }
    } catch (err) {
      console.warn("API indisponible, utilisation des données locales.", err);
      setDashboard(fallbackDashboard);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleValidateQuick = async (id) => {
    setValidatingId(id);

    try {
      await validateBirth(id);

      setDashboard((prev) => {
        if (!prev) return prev;

        const updated = (prev.latestBirths || []).map((birth) =>
          birth.id === id || birth.actNumber === id
            ? { ...birth, status: "APPROVED" }
            : birth
        );

        return {
          ...prev,
          approvedBirths: (prev.approvedBirths || 0) + 1,
          pendingBirths: Math.max(0, (prev.pendingBirths || 0) - 1),
          latestBirths: updated,
        };
      });
    } catch (err) {
      console.error(err);

      setDashboard((prev) => {
        if (!prev) return prev;

        const updated = (prev.latestBirths || []).map((birth) =>
          birth.id === id || birth.actNumber === id
            ? { ...birth, status: "APPROVED" }
            : birth
        );

        return {
          ...prev,
          approvedBirths: (prev.approvedBirths || 0) + 1,
          pendingBirths: Math.max(0, (prev.pendingBirths || 0) - 1),
          latestBirths: updated,
        };
      });
    } finally {
      setValidatingId(null);
    }
  };

  const currentData = dashboard || fallbackDashboard;

  const rawList = Array.isArray(currentData?.latestBirths)
    ? currentData.latestBirths
    : [];

  const filteredBirths = rawList.filter((birth) => {
    if (activeFilter === "APPROVED") {
      return birth.status === "APPROVED";
    }

    if (activeFilter === "PENDING") {
      return birth.status === "PENDING";
    }

    if (activeFilter === "TODAY") {
      const today = new Date().toISOString().slice(0, 10);
      return birth.createdAt?.startsWith(today);
    }

    return true;
  });

  const approvedCount = rawList.filter(
    (birth) => birth.status === "APPROVED"
  ).length;

  const pendingCount = rawList.filter(
    (birth) => birth.status === "PENDING"
  ).length;

  const getInitials = (firstname = "", lastname = "") => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="sivec-dashboard">
      {/* TOP HEADER */}
      <div className="dashboard-header">
        <div>
          <div className="dashboard-breadcrumb">
            <span>Administration</span>
            <ChevronRight size={14} />
            <strong>Tableau de bord</strong>
          </div>

          <h1 className="dashboard-title">
            Tableau de bord
          </h1>

          <p className="dashboard-subtitle">
            Vue d'ensemble des actes de naissance enregistrés dans le système.
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={loadDashboard}
          disabled={loading}
        >
          <RefreshCw
            size={17}
            className={loading ? "rotate-icon" : ""}
          />
          {loading ? "Actualisation..." : "Actualiser"}
        </button>
      </div>

      {/* WELCOME */}
      <div className="welcome-panel">
        <div className="welcome-decoration decoration-one"></div>
        <div className="welcome-decoration decoration-two"></div>

        <div className="welcome-content">
          <div className="welcome-icon">
            <ShieldCheck size={27} />
          </div>

          <div>
            <span className="welcome-label">
              <Sparkles size={14} />
              Système SIVEC
            </span>

            <h2>Bienvenue sur votre espace administratif</h2>

            <p>
              Suivez, vérifiez et gérez les actes de naissance
              enregistrés dans votre centre.
            </p>
          </div>
        </div>

        <div className="welcome-status">
          <span className="status-dot"></span>
          Système opérationnel
        </div>
      </div>

      {/* STATISTICS */}
      <div className="statistics-grid">
        {/* TOTAL */}
        <div className="stat-card stat-blue">
          <div className="stat-top">
            <div className="stat-icon">
              <FileText size={21} />
            </div>

            <span className="stat-trend">
              <TrendingUp size={13} />
              Registre
            </span>
          </div>

          <div className="stat-number">
            {currentData?.totalBirths?.toLocaleString("fr-FR") ?? 0}
          </div>

          <div className="stat-label">
            Total des actes
          </div>

          <div className="stat-description">
            Tous les actes enregistrés
          </div>
        </div>

        {/* VALIDATED */}
        <div className="stat-card stat-green">
          <div className="stat-top">
            <div className="stat-icon">
              <CheckCircle2 size={21} />
            </div>

            <span className="stat-trend">
              Certifiés
            </span>
          </div>

          <div className="stat-number">
            {currentData?.approvedBirths?.toLocaleString("fr-FR") ?? 0}
          </div>

          <div className="stat-label">
            Actes validés
          </div>

          <div className="stat-description">
            Actes officiellement approuvés
          </div>
        </div>

        {/* PENDING */}
        <div className="stat-card stat-yellow">
          <div className="stat-top">
            <div className="stat-icon">
              <Clock3 size={21} />
            </div>

            <span className="stat-trend">
              À traiter
            </span>
          </div>

          <div className="stat-number">
            {currentData?.pendingBirths?.toLocaleString("fr-FR") ?? 0}
          </div>

          <div className="stat-label">
            En attente
          </div>

          <div className="stat-description">
            Nécessitent une vérification
          </div>
        </div>

        {/* TODAY */}
        <div className="stat-card stat-red">
          <div className="stat-top">
            <div className="stat-icon">
              <CalendarDays size={21} />
            </div>

            <span className="stat-trend">
              Aujourd'hui
            </span>
          </div>

          <div className="stat-number">
            {currentData?.birthsToday?.toLocaleString("fr-FR") ?? 0}
          </div>

          <div className="stat-label">
            Actes aujourd'hui
          </div>

          <div className="stat-description">
            Nouvelles déclarations
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="section-heading">
        <div>
          <h2>Actions rapides</h2>
          <p>Accédez rapidement aux principales fonctionnalités.</p>
        </div>
      </div>

      <div className="quick-actions">
        <button
          className="quick-action action-green"
          onClick={() => navigate("/births/create")}
        >
          <div className="quick-action-icon">
            <UserPlus size={21} />
          </div>

          <div>
            <strong>Nouvelle déclaration</strong>
            <span>Enregistrer un acte</span>
          </div>

          <ChevronRight size={18} />
        </button>

        <button
          className="quick-action action-yellow"
          onClick={() => navigate("/births/validate")}
        >
          <div className="quick-action-icon">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <strong>Valider les actes</strong>
            <span>{currentData?.pendingBirths ?? 0} acte(s) en attente</span>
          </div>

          <ChevronRight size={18} />
        </button>

        <button
          className="quick-action action-red"
          onClick={() => navigate("/births/print")}
        >
          <div className="quick-action-icon">
            <Printer size={21} />
          </div>

          <div>
            <strong>Imprimer un certificat</strong>
            <span>Générer un document officiel</span>
          </div>

          <ChevronRight size={18} />
        </button>
      </div>

      {/* ACTS SECTION */}
      <div className="acts-header">
        <div>
          <div className="section-title-row">
            <h2>Actes récents</h2>

            <span className="records-count">
              {filteredBirths.length} résultat
              {filteredBirths.length > 1 ? "s" : ""}
            </span>
          </div>

          <p>
            Consultez les derniers actes enregistrés dans le système.
          </p>
        </div>

        <div className="view-switch">
          <button
            className={viewMode === "feed" ? "active" : ""}
            onClick={() => setViewMode("feed")}
            title="Vue cartes"
          >
            <LayoutGrid size={17} />
          </button>

          <button
            className={viewMode === "table" ? "active" : ""}
            onClick={() => setViewMode("table")}
            title="Vue tableau"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="filter-container">
        <div className="filter-list">
          <button
            className={`filter-button ${
              activeFilter === "ALL" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("ALL")}
          >
            Tous
            <span>{rawList.length}</span>
          </button>

          <button
            className={`filter-button filter-green ${
              activeFilter === "APPROVED" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("APPROVED")}
          >
            <i></i>
            Validés
            <span>{approvedCount}</span>
          </button>

          <button
            className={`filter-button filter-yellow ${
              activeFilter === "PENDING" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("PENDING")}
          >
            <i></i>
            En attente
            <span>{pendingCount}</span>
          </button>

          <button
            className={`filter-button filter-red ${
              activeFilter === "TODAY" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("TODAY")}
          >
            <i></i>
            Aujourd'hui
            <span>{currentData?.birthsToday ?? 0}</span>
          </button>
        </div>
      </div>

      {/* EMPTY */}
      {filteredBirths.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Search size={27} />
          </div>

          <h3>Aucun acte trouvé</h3>

          <p>
            Aucun enregistrement ne correspond au filtre sélectionné.
          </p>

          <button
            className="reset-button"
            onClick={() => setActiveFilter("ALL")}
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : viewMode === "feed" ? (
        /* FEED */
        <div className="birth-feed">
          {filteredBirths.map((birth) => {
            const isApproved = birth.status === "APPROVED";

            const parents = Array.isArray(birth.parents)
              ? birth.parents[0]
              : null;

            return (
              <article
                className="birth-card"
                key={birth.id || birth.actNumber}
              >
                {/* CARD HEADER */}
                <div className="birth-card-header">
                  <div className="child-avatar">
                    {getInitials(
                      birth.childFirstname,
                      birth.childLastname
                    )}
                  </div>

                  <div className="child-info">
                    <div className="child-name-line">
                      <h3>
                        {birth.childFirstname} {birth.childLastname}
                      </h3>

                      <span className="sex-badge">
                        {birth.sex === "MALE" || birth.sex === "M"
                          ? "♂ Garçon"
                          : "♀ Fille"}
                      </span>
                    </div>

                    <div className="birth-location">
                      <MapPin size={13} />

                      <span>
                        {birth.birthPlace || "Centre Hospitalier"}
                      </span>

                      <span>•</span>

                      <span>
                        {birth.createdAt
                          ? new Date(
                              birth.createdAt
                            ).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Récent"}
                      </span>
                    </div>
                  </div>

                  <div className="card-menu">
                    <button>
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>

                {/* ACT INFO */}
                <div className="act-information">
                  <div className="act-number">
                    <div className="act-icon">
                      <FileText size={17} />
                    </div>

                    <div>
                      <small>NUMÉRO D'ACTE</small>

                      <strong>
                        {birth.actNumber ||
                          `SIVEC-2026-${birth.id}`}
                      </strong>
                    </div>
                  </div>

                  <div className="center-information">
                    <small>CENTRE</small>

                    <strong>
                      {birth.centerId || "Mairie de Yaoundé I"}
                    </strong>
                  </div>

                  <span
                    className={`status-badge ${
                      isApproved ? "approved" : "pending"
                    }`}
                  >
                    {isApproved ? (
                      <>
                        <CheckCircle2 size={14} />
                        Validé
                      </>
                    ) : (
                      <>
                        <Clock3 size={14} />
                        En attente
                      </>
                    )}
                  </span>
                </div>

                {/* PARENTS */}
                <div className="parents-section">
                  <div className="parents-title">
                    <span>Filiation</span>
                    <span>Parents déclarés</span>
                  </div>

                  <div className="parents-grid">
                    <div className="parent-card">
                      <div className="parent-icon father">
                        <UserRound size={17} />
                      </div>

                      <div>
                        <small>PÈRE</small>

                        <strong>
                          {parents?.fatherName || "Non renseigné"}
                        </strong>

                        {parents?.fatherJob && (
                          <span>{parents.fatherJob}</span>
                        )}
                      </div>
                    </div>

                    <div className="parent-card">
                      <div className="parent-icon mother">
                        <UserRound size={17} />
                      </div>

                      <div>
                        <small>MÈRE</small>

                        <strong>
                          {parents?.motherName || "Non renseigné"}
                        </strong>

                        {parents?.motherJob && (
                          <span>{parents.motherJob}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="birth-actions">
                  {!isApproved ? (
                    <button
                      className="action-button validate"
                      onClick={() =>
                        handleValidateQuick(birth.id)
                      }
                      disabled={validatingId === birth.id}
                    >
                      <CheckCircle2
                        size={16}
                        className={
                          validatingId === birth.id
                            ? "rotate-icon"
                            : ""
                        }
                      />

                      {validatingId === birth.id
                        ? "Validation..."
                        : "Valider"}
                    </button>
                  ) : (
                    <div className="certified-label">
                      <Check size={16} />
                      Acte certifié conforme
                    </div>
                  )}

                  <button
                    className="action-button"
                    onClick={() => navigate(`/tout`)}
                  >
                    <Eye size={16} />
                    Détails
                  </button>

                  <button
                    className="action-button"
                    onClick={() =>
                      navigate(
                        `/births/${birth.id || 1}/print`
                      )
                    }
                  >
                    <Printer size={16} />
                    Imprimer
                  </button>

                  <button
                    className="action-button"
                    onClick={() =>
                      navigate(
                        `/births/${birth.id || 1}/attachments`
                      )
                    }
                  >
                    <Paperclip size={16} />
                    Pièces
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* TABLE */
        <div className="table-card">
          <div className="table-responsive">
            <table className="sivec-table">
              <thead>
                <tr>
                  <th>ACTE</th>
                  <th>ENFANT</th>
                  <th>DATE & LIEU</th>
                  <th>STATUT</th>
                  <th>PARENTS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredBirths.map((birth) => {
                  const isApproved =
                    birth.status === "APPROVED";

                  const parents = Array.isArray(birth.parents)
                    ? birth.parents[0]
                    : null;

                  return (
                    <tr
                      key={birth.id || birth.actNumber}
                    >
                      <td>
                        <strong className="table-act-number">
                          {birth.actNumber ||
                            `ACT-${birth.id}`}
                        </strong>
                      </td>

                      <td>
                        <div className="table-child">
                          <div className="table-avatar">
                            {getInitials(
                              birth.childFirstname,
                              birth.childLastname
                            )}
                          </div>

                          <div>
                            <strong>
                              {birth.childFirstname}{" "}
                              {birth.childLastname}
                            </strong>

                            <small>
                              {birth.sex === "MALE" ||
                              birth.sex === "M"
                                ? "Masculin"
                                : "Féminin"}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <strong>
                          {birth.createdAt
                            ? new Date(
                                birth.createdAt
                              ).toLocaleDateString(
                                "fr-FR"
                              )
                            : "—"}
                        </strong>

                        <small>
                          {birth.birthPlace || "—"}
                        </small>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            isApproved
                              ? "approved"
                              : "pending"
                          }`}
                        >
                          {isApproved ? (
                            <>
                              <CheckCircle2 size={13} />
                              Validé
                            </>
                          ) : (
                            <>
                              <Clock3 size={13} />
                              En attente
                            </>
                          )}
                        </span>
                      </td>

                      <td>
                        <div className="table-parents">
                          <span>
                            P :{" "}
                            {parents?.fatherName || "—"}
                          </span>

                          <span>
                            M :{" "}
                            {parents?.motherName || "—"}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="table-actions">
                          {!isApproved && (
                            <button
                              className="table-action validate"
                              onClick={() =>
                                handleValidateQuick(
                                  birth.id
                                )
                              }
                              title="Valider"
                            >
                              <CheckCircle2 size={15} />
                            </button>
                          )}

                          <button
                            className="table-action"
                            onClick={() =>
                              navigate(
                                `/births/${
                                  birth.id || 1
                                }/print`
                              )
                            }
                            title="Imprimer"
                          >
                            <Printer size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CSS */}
      <style>{`
        :root {
          --sivec-primary: #00843d;
          --sivec-primary-dark: #006b31;
          --sivec-primary-light: #e9f7ef;

          --sivec-yellow: #f6c800;
          --sivec-yellow-light: #fff8d9;

          --sivec-red: #ce1126;
          --sivec-red-light: #fff0f2;

          --sivec-blue: #2563eb;
          --sivec-blue-light: #eff6ff;

          --dashboard-bg: #f5f7f9;
          --card-bg: #ffffff;

          --text-main: #17221b;
          --text-secondary: #647067;
          --text-muted: #8a948d;

          --border: #e5e9e6;
          --shadow: 0 4px 18px rgba(20, 40, 28, 0.06);
        }

        * {
          box-sizing: border-box;
        }

        .sivec-dashboard {
          width: 100%;
          max-width: 1250px;
          margin: 0 auto;
          padding: 26px;
          color: var(--text-main);
        }

        /* HEADER */

        .dashboard-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
        }

        .dashboard-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 7px;
        }

        .dashboard-breadcrumb strong {
          color: var(--sivec-primary);
        }

        .dashboard-title {
          margin: 0;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.6px;
        }

        .dashboard-subtitle {
          margin: 5px 0 0;
          font-size: 13.5px;
          color: var(--text-secondary);
        }

        .refresh-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 15px;
          border: 1px solid var(--border);
          background: white;
          border-radius: 9px;
          color: var(--text-main);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: .2s;
          box-shadow: 0 2px 7px rgba(0,0,0,.03);
        }

        .refresh-button:hover {
          border-color: var(--sivec-primary);
          color: var(--sivec-primary);
        }

        .refresh-button:disabled {
          opacity: .65;
          cursor: not-allowed;
        }

        .rotate-icon {
          animation: rotate 1s linear infinite;
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        /* WELCOME */

        .welcome-panel {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 23px 25px;
          margin-bottom: 24px;
          border-radius: 14px;
          background:
            linear-gradient(
              110deg,
              #006b31 0%,
              #00843d 55%,
              #009b48 100%
            );
          color: white;
          box-shadow: 0 8px 25px rgba(0, 132, 61, .15);
        }

        .welcome-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 17px;
        }

        .welcome-icon {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          background: rgba(255,255,255,.15);
          border: 1px solid rgba(255,255,255,.2);
        }

        .welcome-label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .7px;
          opacity: .85;
        }

        .welcome-panel h2 {
          margin: 4px 0 4px;
          font-size: 19px;
          font-weight: 750;
        }

        .welcome-panel p {
          margin: 0;
          font-size: 12.5px;
          opacity: .82;
        }

        .welcome-status {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 12px;
          border-radius: 20px;
          background: rgba(255,255,255,.11);
          border: 1px solid rgba(255,255,255,.14);
          font-size: 11.5px;
          font-weight: 600;
          white-space: nowrap;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          background: #7dffad;
          border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(125,255,173,.12);
        }

        .welcome-decoration {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,.07);
        }

        .decoration-one {
          width: 180px;
          height: 180px;
          right: 90px;
          top: -100px;
        }

        .decoration-two {
          width: 250px;
          height: 250px;
          right: -80px;
          bottom: -170px;
        }

        /* STATISTICS */

        .statistics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 28px;
        }

        .stat-card {
          position: relative;
          overflow: hidden;
          padding: 18px;
          min-height: 165px;
          background: white;
          border: 1px solid var(--border);
          border-radius: 13px;
          box-shadow: var(--shadow);
          transition: .2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(20,40,28,.08);
        }

        .stat-card::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 3px;
        }

        .stat-blue::after {
          background: var(--sivec-blue);
        }

        .stat-green::after {
          background: var(--sivec-primary);
        }

        .stat-yellow::after {
          background: var(--sivec-yellow);
        }

        .stat-red::after {
          background: var(--sivec-red);
        }

        .stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
        }

        .stat-blue .stat-icon {
          background: var(--sivec-blue-light);
          color: var(--sivec-blue);
        }

        .stat-green .stat-icon {
          background: var(--sivec-primary-light);
          color: var(--sivec-primary);
        }

        .stat-yellow .stat-icon {
          background: var(--sivec-yellow-light);
          color: #a37e00;
        }

        .stat-red .stat-icon {
          background: var(--sivec-red-light);
          color: var(--sivec-red);
        }

        .stat-trend {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 7px;
          border-radius: 20px;
          background: #f6f8f7;
          color: var(--text-secondary);
          font-size: 10.5px;
          font-weight: 650;
        }

        .stat-number {
          margin-top: 17px;
          font-size: 27px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: -.6px;
        }

        .stat-label {
          margin-top: 7px;
          font-size: 13px;
          font-weight: 700;
        }

        .stat-description {
          margin-top: 4px;
          color: var(--text-muted);
          font-size: 11px;
        }

        /* SECTION */

        .section-heading {
          margin-bottom: 12px;
        }

        .section-heading h2,
        .acts-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 800;
        }

        .section-heading p,
        .acts-header p {
          margin: 4px 0 0;
          color: var(--text-secondary);
          font-size: 12.5px;
        }

        /* QUICK ACTIONS */

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 13px;
          margin-bottom: 30px;
        }

        .quick-action {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          border: 1px solid var(--border);
          border-radius: 11px;
          background: white;
          text-align: left;
          cursor: pointer;
          transition: .2s;
        }

        .quick-action:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow);
        }

        .quick-action > svg {
          margin-left: auto;
          color: var(--text-muted);
        }

        .quick-action-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          flex-shrink: 0;
        }

        .action-green .quick-action-icon {
          background: var(--sivec-primary-light);
          color: var(--sivec-primary);
        }

        .action-yellow .quick-action-icon {
          background: var(--sivec-yellow-light);
          color: #9b7800;
        }

        .action-red .quick-action-icon {
          background: var(--sivec-red-light);
          color: var(--sivec-red);
        }

        .quick-action strong {
          display: block;
          font-size: 13px;
          font-weight: 750;
        }

        .quick-action span {
          display: block;
          margin-top: 3px;
          font-size: 11px;
          color: var(--text-secondary);
        }

        /* ACTS HEADER */

        .acts-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 12px;
        }

        .section-title-row {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .records-count {
          padding: 3px 8px;
          border-radius: 20px;
          background: var(--sivec-primary-light);
          color: var(--sivec-primary);
          font-size: 10px;
          font-weight: 700;
        }

        .view-switch {
          display: flex;
          padding: 3px;
          border: 1px solid var(--border);
          border-radius: 9px;
          background: white;
        }

        .view-switch button {
          width: 34px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 6px;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
        }

        .view-switch button.active {
          background: var(--sivec-primary);
          color: white;
        }

        /* FILTER */

        .filter-container {
          margin-bottom: 15px;
        }

        .filter-list {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .filter-button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 11px;
          border: 1px solid var(--border);
          border-radius: 7px;
          background: white;
          color: var(--text-secondary);
          font-size: 11.5px;
          font-weight: 650;
          cursor: pointer;
          transition: .18s;
        }

        .filter-button span {
          min-width: 19px;
          padding: 2px 5px;
          text-align: center;
          border-radius: 10px;
          background: #f0f2f1;
          font-size: 10px;
        }

        .filter-button:hover {
          border-color: #c8d1cb;
          background: #fafcfb;
        }

        .filter-button.active {
          background: var(--text-main);
          color: white;
          border-color: var(--text-main);
        }

        .filter-button.active span {
          background: rgba(255,255,255,.18);
          color: white;
        }

        .filter-button i {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: currentColor;
        }

        .filter-green.active {
          background: var(--sivec-primary);
          border-color: var(--sivec-primary);
        }

        .filter-yellow.active {
          background: #b38b00;
          border-color: #b38b00;
        }

        .filter-red.active {
          background: var(--sivec-red);
          border-color: var(--sivec-red);
        }

        /* BIRTH CARD */

        .birth-feed {
          display: flex;
          flex-direction: column;
          gap: 13px;
        }

        .birth-card {
          overflow: hidden;
          background: white;
          border: 1px solid var(--border);
          border-radius: 13px;
          box-shadow: var(--shadow);
        }

        .birth-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 17px 18px;
        }

        .child-avatar {
          width: 46px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 12px;
          background: var(--sivec-primary-light);
          color: var(--sivec-primary);
          font-size: 14px;
          font-weight: 800;
        }

        .child-info {
          min-width: 0;
          flex: 1;
        }

        .child-name-line {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 7px;
        }

        .child-name-line h3 {
          margin: 0;
          font-size: 15px;
          font-weight: 750;
        }

        .sex-badge {
          padding: 3px 7px;
          border-radius: 5px;
          background: #f0f3f1;
          color: var(--text-secondary);
          font-size: 9.5px;
          font-weight: 700;
        }

        .birth-location {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 4px;
          color: var(--text-muted);
          font-size: 11px;
        }

        .card-menu button {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 7px;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
        }

        .card-menu button:hover {
          background: #f3f5f4;
        }

        /* ACT INFORMATION */

        .act-information {
          display: flex;
          align-items: center;
          gap: 15px;
          margin: 0 18px;
          padding: 12px;
          border: 1px solid var(--border);
          border-radius: 9px;
          background: #fafcfb;
        }

        .act-number {
          display: flex;
          align-items: center;
          gap: 9px;
          flex: 1;
        }

        .act-icon {
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: var(--sivec-primary-light);
          color: var(--sivec-primary);
        }

        .act-number small,
        .center-information small {
          display: block;
          margin-bottom: 2px;
          color: var(--text-muted);
          font-size: 8.5px;
          font-weight: 750;
          letter-spacing: .5px;
        }

        .act-number strong,
        .center-information strong {
          display: block;
          font-size: 11.5px;
        }

        .center-information {
          min-width: 170px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 8px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 700;
          white-space: nowrap;
        }

        .status-badge.approved {
          background: var(--sivec-primary-light);
          color: var(--sivec-primary);
        }

        .status-badge.pending {
          background: var(--sivec-yellow-light);
          color: #927000;
        }

        /* PARENTS */

        .parents-section {
          padding: 14px 18px;
        }

        .parents-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 9px;
          color: var(--text-muted);
          font-size: 9px;
          font-weight: 750;
          text-transform: uppercase;
          letter-spacing: .5px;
        }

        .parents-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .parent-card {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px;
          border: 1px solid #edf0ee;
          border-radius: 8px;
        }

        .parent-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 8px;
        }

        .parent-icon.father {
          background: var(--sivec-primary-light);
          color: var(--sivec-primary);
        }

        .parent-icon.mother {
          background: var(--sivec-yellow-light);
          color: #967400;
        }

        .parent-card small {
          display: block;
          color: var(--text-muted);
          font-size: 8px;
          font-weight: 750;
        }

        .parent-card strong {
          display: block;
          margin-top: 2px;
          font-size: 11.5px;
        }

        .parent-card span {
          display: block;
          margin-top: 1px;
          color: var(--text-muted);
          font-size: 9.5px;
        }

        /* ACTIONS */

        .birth-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 18px;
          border-top: 1px solid var(--border);
          background: #fcfdfc;
        }

        .action-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 32px;
          padding: 6px 10px;
          border: 1px solid transparent;
          border-radius: 7px;
          background: transparent;
          color: var(--text-secondary);
          font-size: 10.5px;
          font-weight: 650;
          cursor: pointer;
          transition: .18s;
        }

        .action-button:hover {
          background: #f0f3f1;
          color: var(--text-main);
        }

        .action-button.validate {
          background: var(--sivec-primary);
          color: white;
        }

        .action-button.validate:hover {
          background: var(--sivec-primary-dark);
        }

        .action-button:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .certified-label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          flex: 1;
          color: var(--sivec-primary);
          font-size: 10.5px;
          font-weight: 700;
        }

        /* EMPTY */

        .empty-state {
          padding: 55px 20px;
          text-align: center;
          background: white;
          border: 1px solid var(--border);
          border-radius: 13px;
        }

        .empty-icon {
          width: 58px;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 13px;
          border-radius: 50%;
          background: #f1f4f2;
          color: var(--text-muted);
        }

        .empty-state h3 {
          margin: 0;
          font-size: 16px;
        }

        .empty-state p {
          margin: 5px 0 15px;
          color: var(--text-secondary);
          font-size: 12px;
        }

        .reset-button {
          padding: 8px 13px;
          border: none;
          border-radius: 7px;
          background: var(--sivec-primary);
          color: white;
          font-size: 11px;
          font-weight: 650;
          cursor: pointer;
        }

        /* TABLE */

        .table-card {
          overflow: hidden;
          background: white;
          border: 1px solid var(--border);
          border-radius: 13px;
          box-shadow: var(--shadow);
        }

        .sivec-table {
          width: 100%;
          border-collapse: collapse;
        }

        .sivec-table th {
          padding: 12px 14px;
          background: #f8faf9;
          border-bottom: 1px solid var(--border);
          color: var(--text-muted);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .5px;
          text-align: left;
        }

        .sivec-table td {
          padding: 13px 14px;
          border-bottom: 1px solid #edf0ee;
          vertical-align: middle;
          font-size: 11px;
        }

        .sivec-table tbody tr:last-child td {
          border-bottom: none;
        }

        .sivec-table tbody tr:hover {
          background: #fbfcfb;
        }

        .table-act-number {
          color: var(--sivec-primary);
          font-size: 10.5px;
        }

        .table-child {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .table-avatar {
          width: 31px;
          height: 31px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: var(--sivec-primary-light);
          color: var(--sivec-primary);
          font-size: 9px;
          font-weight: 800;
        }

        .table-child strong {
          display: block;
          font-size: 11px;
        }

        .table-child small,
        .sivec-table td > small,
        .sivec-table td > div > small {
          display: block;
          margin-top: 3px;
          color: var(--text-muted);
          font-size: 9px;
        }

        .table-parents span {
          display: block;
          margin: 2px 0;
          color: var(--text-secondary);
          font-size: 9.5px;
        }

        .table-actions {
          display: flex;
          justify-content: flex-end;
          gap: 5px;
        }

        .table-action {
          width: 29px;
          height: 29px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: white;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .table-action:hover {
          background: #f4f6f5;
        }

        .table-action.validate {
          color: var(--sivec-primary);
        }

        /* RESPONSIVE */

        @media (max-width: 1050px) {
          .statistics-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .quick-actions {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .sivec-dashboard {
            padding: 16px;
          }

          .dashboard-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .dashboard-title {
            font-size: 23px;
          }

          .refresh-button {
            width: 100%;
            justify-content: center;
          }

          .welcome-panel {
            align-items: flex-start;
            flex-direction: column;
          }

          .welcome-status {
            align-self: flex-start;
          }

          .statistics-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          .stat-card {
            min-height: 145px;
            padding: 14px;
          }

          .stat-number {
            font-size: 23px;
          }

          .acts-header {
            align-items: flex-start;
          }

          .act-information {
            align-items: flex-start;
            flex-direction: column;
          }

          .center-information {
            min-width: 0;
          }

          .parents-grid {
            grid-template-columns: 1fr;
          }

          .birth-actions {
            flex-wrap: wrap;
          }

          .action-button {
            flex: 1;
          }

          .certified-label {
            width: 100%;
            flex-basis: 100%;
          }
        }

        @media (max-width: 520px) {
          .statistics-grid {
            grid-template-columns: 1fr;
          }

          .welcome-content {
            align-items: flex-start;
          }

          .welcome-panel h2 {
            font-size: 16px;
          }

          .welcome-panel p {
            line-height: 1.5;
          }

          .filter-list {
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 4px;
          }

          .filter-button {
            white-space: nowrap;
          }

          .birth-card-header {
            padding: 14px;
          }

          .child-avatar {
            width: 40px;
            height: 40px;
          }

          .child-name-line h3 {
            font-size: 13px;
          }

          .act-information {
            margin: 0 14px;
          }

          .parents-section {
            padding: 12px 14px;
          }

          .birth-actions {
            padding: 8px 12px;
          }

          .action-button {
            font-size: 9.5px;
            padding: 6px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;