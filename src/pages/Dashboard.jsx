import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Baby,
  CheckCircle2,
  Clock3,
  CalendarDays,
  Users,
  FileText,
  TrendingUp,
  RefreshCw,
  UserRound,
  BriefcaseBusiness,
  CircleAlert,
  UserPlus,
  Printer,
  Search,
  MapPin,
  Sparkles,
  LayoutGrid,
  List,
  ShieldCheck,
  ChevronRight,
  Send,
  Eye,
  Paperclip,
  Share2,
  Check,
} from "lucide-react";
import { getBirthDashboard, validateBirth } from "../api/birthApi";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL"); // ALL, APPROVED, PENDING, TODAY
  const [viewMode, setViewMode] = useState("feed"); // "feed" | "table"
  const [validatingId, setValidatingId] = useState(null);

  // Mock data si le serveur backend n'est pas actif pour garantir une démo visuelle riche
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
      {
        id: "5",
        actNumber: "ACT-2026-00138",
        childFirstname: "Christian David",
        childLastname: "ABENA",
        birthDate: "2026-08-11T11:00:00.000Z",
        birthPlace: "Garoua (Hôpital Régional)",
        sex: "M",
        status: "APPROVED",
        centerId: "Centre Garoua",
        createdAt: "2026-08-11T12:00:00.000Z",
        parents: [
          {
            fatherName: "ABENA Jean-Pierre",
            fatherJob: "Administrateur",
            motherName: "YOMBI Carine",
            motherJob: "Pharmacienne",
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
      console.warn("API indisponible, chargement des données locales pour la démo", err);
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
      // Mettre à jour localement
      setDashboard((prev) => {
        if (!prev) return prev;
        const updated = (prev.latestBirths || []).map((b) =>
          b.id === id || b.actNumber === id ? { ...b, status: "APPROVED" } : b
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
      // Simulation locale si le backend est hors ligne
      setDashboard((prev) => {
        if (!prev) return prev;
        const updated = (prev.latestBirths || []).map((b) =>
          b.id === id || b.actNumber === id ? { ...b, status: "APPROVED" } : b
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
  const rawList = Array.isArray(currentData?.latestBirths) ? currentData.latestBirths : [];

  const filteredBirths = rawList.filter((birth) => {
    if (activeFilter === "APPROVED") return birth.status === "APPROVED";
    if (activeFilter === "PENDING") return birth.status === "PENDING";
    if (activeFilter === "TODAY") {
      const today = new Date().toISOString().slice(0, 10);
      return birth.createdAt?.startsWith(today);
    }
    return true;
  });

  return (
    <div className="fb-dashboard-feed">
      {/* =========================================================
         1. BANNIÈRE DE BIENVENUE FACEBOOK & BOUTON ACTUALISER
      ========================================================= */}
      <div className="fb-card fb-welcome-card mb-4">
        <div className="cameroon-flag-bar">
          <span className="flag-green"></span>
          <span className="flag-red"></span>
          <span className="flag-yellow"></span>
        </div>

        <div className="fb-welcome-content">
          <div className="fb-welcome-left">
            <div className="fb-welcome-icon-box">
              <Sparkles size={24} className="text-yellow" />
            </div>
            <div>
              <h1 className="fb-welcome-title">Fil d'actualité SIVEC</h1>
              <p className="fb-welcome-desc">
                Plateforme officielle de suivi et de gestion des actes de naissance du Cameroun
              </p>
            </div>
          </div>

          <button
            className="fb-btn fb-btn-secondary"
            onClick={loadDashboard}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "spin text-green" : "text-green"} />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* =========================================================
         2. STORIES / STATS CARDS REEL (VERT, ROUGE, JAUNE)
      ========================================================= */}
      <div className="fb-stories-grid mb-4">
        {/* Story 1 : Total Naissances (Vert) */}
        <div className="fb-story-card story-green">
          <div className="fb-story-top">
            <div className="fb-story-icon icon-green">
              <Baby size={22} />
            </div>
            <span className="fb-story-pill pill-green">Registre</span>
          </div>
          <div className="fb-story-body">
            <h3 className="fb-story-number">
              {currentData?.totalBirths?.toLocaleString("fr-FR") ?? 0}
            </h3>
            <p className="fb-story-label">Total des naissances</p>
            <span className="fb-story-sub">Tous les actes enregistrés</span>
          </div>
          <div className="fb-story-bar bar-green"></div>
        </div>

        {/* Story 2 : Validées (Vert Foncé / Émeraude) */}
        <div className="fb-story-card story-emerald">
          <div className="fb-story-top">
            <div className="fb-story-icon icon-emerald">
              <CheckCircle2 size={22} />
            </div>
            <span className="fb-story-pill pill-emerald">Certifiés</span>
          </div>
          <div className="fb-story-body">
            <h3 className="fb-story-number">
              {currentData?.approvedBirths?.toLocaleString("fr-FR") ?? 0}
            </h3>
            <p className="fb-story-label">Actes Validés</p>
            <span className="fb-story-sub">Signés & officiels</span>
          </div>
          <div className="fb-story-bar bar-green"></div>
        </div>

        {/* Story 3 : En Attente (Jaune / Or) */}
        <div className="fb-story-card story-yellow">
          <div className="fb-story-top">
            <div className="fb-story-icon icon-yellow">
              <Clock3 size={22} />
            </div>
            <span className="fb-story-pill pill-yellow">À signer</span>
          </div>
          <div className="fb-story-body">
            <h3 className="fb-story-number">
              {currentData?.pendingBirths?.toLocaleString("fr-FR") ?? 0}
            </h3>
            <p className="fb-story-label">En attente de validation</p>
            <span className="fb-story-sub">Vérification requise</span>
          </div>
          <div className="fb-story-bar bar-yellow"></div>
        </div>

        {/* Story 4 : Aujourd'hui (Rouge) */}
        <div className="fb-story-card story-red">
          <div className="fb-story-top">
            <div className="fb-story-icon icon-red">
              <CalendarDays size={22} />
            </div>
            <span className="fb-story-pill pill-red">Aujourd'hui</span>
          </div>
          <div className="fb-story-body">
            <h3 className="fb-story-number">
              {currentData?.birthsToday?.toLocaleString("fr-FR") ?? 0}
            </h3>
            <p className="fb-story-label">Créées aujourd'hui</p>
            <span className="fb-story-sub">Flux des dernières 24h</span>
          </div>
          <div className="fb-story-bar bar-red"></div>
        </div>
      </div>

      {/* =========================================================
         3. BOÎTE DE CRÉATION RAPIDE FACEBOOK ("QUOI DE NEUF ?")
      ========================================================= */}
      <div className="fb-card fb-create-post-card mb-4">
        <div className="fb-create-post-top">
          <div className="fb-avatar">
            <ShieldCheck size={22} />
          </div>
          <button
            className="fb-create-post-input"
            onClick={() => navigate("/births/create")}
          >
            Enregistrer un nouvel acte de naissance dans le système...
          </button>
        </div>

        <div className="fb-create-post-divider"></div>

        <div className="fb-create-post-actions">
          <button
            className="fb-post-action-btn action-green"
            onClick={() => navigate("/births/create")}
          >
            <UserPlus size={18} className="text-green" />
            <span>Nouvelle Déclaration</span>
          </button>

          <button
            className="fb-post-action-btn action-yellow"
            onClick={() => navigate("/births/validate")}
          >
            <CheckCircle2 size={18} className="text-yellow" />
            <span>Valider les Actes</span>
          </button>

          <button
            className="fb-post-action-btn action-red"
            onClick={() => navigate("/births/print")}
          >
            <Printer size={18} className="text-red" />
            <span>Imprimer un Certificat</span>
          </button>
        </div>
      </div>

      {/* =========================================================
         4. FILTRES PILULES FACEBOOK & SÉLECTEUR DE VUE
      ========================================================= */}
      <div className="fb-feed-controls mb-4">
        <div className="fb-filter-pills">
          <button
            className={`fb-pill ${activeFilter === "ALL" ? "active" : ""}`}
            onClick={() => setActiveFilter("ALL")}
          >
            Tous les actes ({rawList.length})
          </button>

          <button
            className={`fb-pill pill-filter-green ${
              activeFilter === "APPROVED" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("APPROVED")}
          >
            <span className="fb-pill-dot dot-green"></span>
            Validés ({rawList.filter((b) => b.status === "APPROVED").length})
          </button>

          <button
            className={`fb-pill pill-filter-yellow ${
              activeFilter === "PENDING" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("PENDING")}
          >
            <span className="fb-pill-dot dot-yellow"></span>
            En attente ({rawList.filter((b) => b.status === "PENDING").length})
          </button>

          <button
            className={`fb-pill pill-filter-red ${
              activeFilter === "TODAY" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("TODAY")}
          >
            <span className="fb-pill-dot dot-red"></span>
            Aujourd'hui ({currentData?.birthsToday ?? 0})
          </button>
        </div>

        <div className="fb-view-toggle">
          <button
            className={`fb-view-btn ${viewMode === "feed" ? "active" : ""}`}
            onClick={() => setViewMode("feed")}
            title="Vue Cartes Fil Facebook"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            className={`fb-view-btn ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
            title="Vue Tableau Officiel"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* =========================================================
         5. CONTENU : CARTES FACEBOOK OU TABLEAU OFFICIEL
      ========================================================= */}
      {filteredBirths.length === 0 ? (
        <div className="fb-card fb-empty-state">
          <div className="fb-empty-icon">
            <Baby size={40} />
          </div>
          <h4>Aucun acte trouvé</h4>
          <p>Aucun enregistrement ne correspond au filtre sélectionné.</p>
          <button
            className="fb-btn fb-btn-green mt-3"
            onClick={() => setActiveFilter("ALL")}
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : viewMode === "feed" ? (
        /* VUE FIL DE CARTES FACEBOOK */
        <div className="fb-posts-stream">
          {filteredBirths.map((birth) => {
            const isApproved = birth.status === "APPROVED";
            const parents = Array.isArray(birth.parents) ? birth.parents[0] : null;

            return (
              <div className="fb-card fb-post-card mb-4" key={birth.id || birth.actNumber}>
                {/* En-tête du post Facebook */}
                <div className="fb-post-header">
                  <div className="fb-post-avatar-wrap">
                    <div className={`fb-post-avatar ${isApproved ? "avatar-green" : "avatar-yellow"}`}>
                      <Baby size={22} />
                    </div>
                  </div>

                  <div className="fb-post-meta">
                    <div className="fb-post-author-row">
                      <span className="fb-post-author">
                        {birth.childFirstname} {birth.childLastname}
                      </span>
                      <span className="fb-post-sex-tag">
                        {birth.sex === "MALE" || birth.sex === "M"
                          ? "♂ Garçon"
                          : "♀ Fille"}
                      </span>
                    </div>

                    <div className="fb-post-timestamp">
                      <MapPin size={12} className="text-muted" />
                      <span>{birth.birthPlace || "Centre Hospitalier"}</span>
                      <span className="fb-dot-sep">•</span>
                      <span>
                        {birth.createdAt
                          ? new Date(birth.createdAt).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Récent"}
                      </span>
                    </div>
                  </div>

                  {/* Badge de Statut Facebook (Vert, Rouge, Jaune) */}
                  <div className="fb-post-status">
                    {isApproved ? (
                      <span className="fb-badge fb-badge-green">
                        <CheckCircle2 size={13} />
                        Validé
                      </span>
                    ) : (
                      <span className="fb-badge fb-badge-yellow">
                        <Clock3 size={13} />
                        En attente
                      </span>
                    )}
                  </div>
                </div>

                {/* Corps du post / Fiche d'acte */}
                <div className="fb-post-content">
                  <div className="fb-act-highlight">
                    <div className="fb-act-badge">
                      <FileText size={15} className="text-green" />
                      <span className="fb-act-num">
                        Acte N° {birth.actNumber || `SIVEC-2026-${birth.id}`}
                      </span>
                    </div>
                    <span className="fb-act-center">
                      {birth.centerId || "Mairie de Yaoundé I"}
                    </span>
                  </div>

                  {/* Détails Parents & Filiation */}
                  <div className="fb-filiation-box">
                    <div className="fb-filiation-row">
                      <div className="fb-parent-item">
                        <UserRound size={15} className="text-green" />
                        <div>
                          <span className="fb-parent-role">Père :</span>
                          <strong className="fb-parent-name">
                            {parents?.fatherName || "Non renseigné"}
                          </strong>
                          {parents?.fatherJob && (
                            <span className="fb-parent-job">({parents.fatherJob})</span>
                          )}
                        </div>
                      </div>

                      <div className="fb-parent-item">
                        <UserRound size={15} className="text-yellow" />
                        <div>
                          <span className="fb-parent-role">Mère :</span>
                          <strong className="fb-parent-name">
                            {parents?.motherName || "Non renseigné"}
                          </strong>
                          {parents?.motherJob && (
                            <span className="fb-parent-job">({parents.motherJob})</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ligne de séparation */}
                <div className="fb-post-divider"></div>

                {/* Barre d'actions Facebook (Vert, Rouge, Jaune) */}
                <div className="fb-post-actions-bar">
                  {!isApproved ? (
                    <button
                      className="fb-post-btn btn-validate"
                      onClick={() => handleValidateQuick(birth.id)}
                      disabled={validatingId === birth.id}
                    >
                      <CheckCircle2
                        size={17}
                        className={validatingId === birth.id ? "spin text-green" : "text-green"}
                      />
                      <span>{validatingId === birth.id ? "Validation..." : "Valider l'acte"}</span>
                    </button>
                  ) : (
                    <div className="fb-post-btn-validated">
                      <Check size={16} className="text-green" />
                      <span>Acte Certifié Conforme</span>
                    </div>
                  )}

                  <button
                    className="fb-post-btn"
                    onClick={() => navigate(`/tout`)}
                    title="Consulter les détails complets"
                  >
                    <Eye size={17} className="text-muted" />
                    <span>Détails</span>
                  </button>

                  <button
                    className="fb-post-btn"
                    onClick={() => navigate(`/births/${birth.id || 1}/print`)}
                    title="Imprimer l'acte officiel"
                  >
                    <Printer size={17} className="text-red" />
                    <span>Imprimer</span>
                  </button>

                  <button
                    className="fb-post-btn"
                    onClick={() => navigate(`/births/${birth.id || 1}/attachments`)}
                    title="Ajouter ou voir des pièces jointes"
                  >
                    <Paperclip size={17} className="text-yellow" />
                    <span>Pièces</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VUE TABLEAU OFFICIEL */
        <div className="fb-card p-3 mb-4">
          <div className="table-responsive">
            <table className="table fb-table align-middle">
              <thead>
                <tr>
                  <th>N° D'ACTE</th>
                  <th>ENFANT</th>
                  <th>DATE & LIEU</th>
                  <th>STATUT</th>
                  <th>PARENTS</th>
                  <th className="text-end">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredBirths.map((birth) => {
                  const isApproved = birth.status === "APPROVED";
                  const parents = Array.isArray(birth.parents) ? birth.parents[0] : null;

                  return (
                    <tr key={birth.id || birth.actNumber}>
                      <td>
                        <strong className="text-green">
                          {birth.actNumber || `ACT-${birth.id}`}
                        </strong>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="fb-table-avatar">
                            <Baby size={16} />
                          </div>
                          <div>
                            <strong>
                              {birth.childFirstname} {birth.childLastname}
                            </strong>
                            <div className="small text-muted">
                              {birth.sex === "MALE" || birth.sex === "M"
                                ? "Masculin"
                                : "Féminin"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          {birth.createdAt
                            ? new Date(birth.createdAt).toLocaleDateString("fr-FR")
                            : "—"}
                        </div>
                        <small className="text-muted">{birth.birthPlace}</small>
                      </td>
                      <td>
                        {isApproved ? (
                          <span className="fb-badge fb-badge-green">Validé</span>
                        ) : (
                          <span className="fb-badge fb-badge-yellow">En attente</span>
                        )}
                      </td>
                      <td>
                        <small className="d-block">P: {parents?.fatherName || "—"}</small>
                        <small className="d-block text-muted">M: {parents?.motherName || "—"}</small>
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-2">
                          {!isApproved && (
                            <button
                              className="fb-btn fb-btn-light-green p-1 px-2"
                              onClick={() => handleValidateQuick(birth.id)}
                              title="Valider"
                            >
                              <CheckCircle2 size={15} />
                            </button>
                          )}
                          <button
                            className="fb-btn fb-btn-secondary p-1 px-2"
                            onClick={() => navigate(`/births/${birth.id || 1}/print`)}
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

      {/* =========================================================
         STYLE DU DASHBOARD (SCOPED / CLEAN)
      ========================================================= */}
      <style>{`
        .fb-dashboard-feed {
          max-width: 1000px;
          margin: 0 auto;
        }

        /* Welcome Banner */
        .fb-welcome-card {
          overflow: hidden;
          background: #ffffff;
        }

        .fb-welcome-content {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .fb-welcome-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .fb-welcome-icon-box {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: var(--sivec-green-light);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .fb-welcome-title {
          margin: 0;
          font-size: 22px;
          font-weight: 800;
          color: var(--fb-text-primary);
        }

        .fb-welcome-desc {
          margin: 2px 0 0 0;
          font-size: 13.5px;
          color: var(--fb-text-secondary);
        }

        /* Stories Grid */
        .fb-stories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 14px;
        }

        .fb-story-card {
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid var(--fb-border);
          padding: 16px;
          position: relative;
          overflow: hidden;
          box-shadow: var(--fb-shadow-sm);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .fb-story-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--fb-shadow);
        }

        .fb-story-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .fb-story-icon {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-green { background: var(--sivec-green-light); color: var(--sivec-green); }
        .icon-emerald { background: #d1fae5; color: #059669; }
        .icon-yellow { background: var(--sivec-yellow-light); color: var(--sivec-yellow-hover); }
        .icon-red { background: var(--sivec-red-light); color: var(--sivec-red); }

        .fb-story-pill {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 10px;
        }

        .pill-green { background: var(--sivec-green-light); color: var(--sivec-green); }
        .pill-emerald { background: #d1fae5; color: #059669; }
        .pill-yellow { background: var(--sivec-yellow-light); color: var(--sivec-yellow-hover); }
        .pill-red { background: var(--sivec-red-light); color: var(--sivec-red); }

        .fb-story-number {
          margin: 0;
          font-size: 26px;
          font-weight: 800;
          color: var(--fb-text-primary);
          line-height: 1.2;
        }

        .fb-story-label {
          margin: 4px 0 2px 0;
          font-size: 13px;
          font-weight: 700;
          color: var(--fb-text-primary);
        }

        .fb-story-sub {
          font-size: 11.5px;
          color: var(--fb-text-secondary);
        }

        .fb-story-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
        }

        .bar-green { background: var(--sivec-green); }
        .bar-yellow { background: var(--sivec-yellow); }
        .bar-red { background: var(--sivec-red); }

        /* Create Post Box */
        .fb-create-post-card {
          padding: 14px 16px;
          background: #ffffff;
        }

        .fb-create-post-top {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .fb-create-post-input {
          flex: 1;
          background: var(--fb-hover);
          border: 1px solid var(--fb-border);
          border-radius: 24px;
          padding: 10px 18px;
          text-align: left;
          color: var(--fb-text-secondary);
          font-size: 14px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .fb-create-post-input:hover {
          background: #e4e6eb;
          color: var(--fb-text-primary);
        }

        .fb-create-post-divider {
          height: 1px;
          background: var(--fb-border);
          margin: 12px 0;
        }

        .fb-create-post-actions {
          display: flex;
          align-items: center;
          justify-content: space-around;
          gap: 8px;
        }

        .fb-post-action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 8px;
          border: none;
          background: transparent;
          font-size: 13.5px;
          font-weight: 600;
          color: var(--fb-text-secondary);
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .fb-post-action-btn:hover {
          background: var(--fb-hover);
          color: var(--fb-text-primary);
        }

        /* Filter Pills & View Switch */
        .fb-feed-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .fb-filter-pills {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .fb-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 20px;
          border: 1px solid var(--fb-border);
          background: #ffffff;
          font-size: 13px;
          font-weight: 600;
          color: var(--fb-text-secondary);
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .fb-pill:hover {
          background: var(--fb-hover);
          color: var(--fb-text-primary);
        }

        .fb-pill.active {
          background: var(--fb-text-primary);
          color: #ffffff;
          border-color: var(--fb-text-primary);
        }

        .fb-pill.pill-filter-green.active {
          background: var(--sivec-green);
          border-color: var(--sivec-green);
          color: #ffffff;
        }

        .fb-pill.pill-filter-yellow.active {
          background: var(--sivec-yellow-hover);
          border-color: var(--sivec-yellow-hover);
          color: #ffffff;
        }

        .fb-pill.pill-filter-red.active {
          background: var(--sivec-red);
          border-color: var(--sivec-red);
          color: #ffffff;
        }

        .fb-pill-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .dot-green { background: var(--sivec-green); }
        .dot-yellow { background: var(--sivec-yellow); }
        .dot-red { background: var(--sivec-red); }

        .fb-view-toggle {
          display: flex;
          background: #ffffff;
          border: 1px solid var(--fb-border);
          border-radius: 8px;
          overflow: hidden;
        }

        .fb-view-btn {
          border: none;
          background: transparent;
          padding: 7px 12px;
          color: var(--fb-text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .fb-view-btn.active {
          background: var(--sivec-green);
          color: #ffffff;
        }

        /* Post Card */
        .fb-post-card {
          padding: 16px;
          background: #ffffff;
        }

        .fb-post-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .fb-post-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-green { background: var(--sivec-green-light); color: var(--sivec-green); }
        .avatar-yellow { background: var(--sivec-yellow-light); color: var(--sivec-yellow-hover); }

        .fb-post-meta {
          flex: 1;
        }

        .fb-post-author-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .fb-post-author {
          font-size: 15px;
          font-weight: 700;
          color: var(--fb-text-primary);
        }

        .fb-post-sex-tag {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 7px;
          border-radius: 10px;
          background: #e4e6eb;
          color: var(--fb-text-secondary);
        }

        .fb-post-timestamp {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: var(--fb-text-secondary);
          margin-top: 2px;
        }

        .fb-dot-sep {
          color: var(--fb-text-muted);
        }

        .fb-act-highlight {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--fb-hover);
          padding: 8px 12px;
          border-radius: 8px;
          margin-bottom: 12px;
        }

        .fb-act-badge {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .fb-act-num {
          font-weight: 700;
          font-size: 13px;
          color: var(--fb-text-primary);
        }

        .fb-act-center {
          font-size: 12px;
          color: var(--fb-text-secondary);
        }

        .fb-filiation-box {
          background: #fcfdfe;
          border: 1px dashed var(--fb-border);
          border-radius: 8px;
          padding: 10px 14px;
        }

        .fb-filiation-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .fb-parent-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13px;
        }

        .fb-parent-role {
          color: var(--fb-text-secondary);
          margin-right: 4px;
        }

        .fb-parent-name {
          color: var(--fb-text-primary);
        }

        .fb-parent-job {
          margin-left: 4px;
          font-size: 11.5px;
          color: var(--fb-text-muted);
        }

        .fb-post-divider {
          height: 1px;
          background: var(--fb-border);
          margin: 12px 0 8px 0;
        }

        .fb-post-actions-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
        }

        .fb-post-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px;
          border-radius: 6px;
          border: none;
          background: transparent;
          font-size: 13px;
          font-weight: 600;
          color: var(--fb-text-secondary);
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .fb-post-btn:hover {
          background: var(--fb-hover);
          color: var(--fb-text-primary);
        }

        .fb-post-btn.btn-validate {
          background: var(--sivec-green-light);
          color: var(--sivec-green);
        }

        .fb-post-btn.btn-validate:hover {
          background: #c8e6c9;
        }

        .fb-post-btn-validated {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px;
          font-size: 12.5px;
          font-weight: 700;
          color: var(--sivec-green);
        }

        .fb-empty-state {
          text-align: center;
          padding: 40px 20px;
        }

        .fb-empty-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: var(--fb-hover);
          color: var(--fb-text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
        }

        .fb-table-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--sivec-green-light);
          color: var(--sivec-green);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;