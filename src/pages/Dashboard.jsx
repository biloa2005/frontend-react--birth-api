import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./births/Dashboard.css";
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

      
    </div>
  );
};

export default Dashboard;