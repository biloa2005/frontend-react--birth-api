import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { getBirthDashboard } from "../api/birthApi";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getBirthDashboard();
      setDashboard(res.data ?? null);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Impossible de charger les statistiques."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

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
          icon: <CircleAlert size={14} />,
        };

      case "ARCHIVED":
        return {
          label: "Archivée",
          className: "status-archived",
          icon: <FileText size={14} />,
        };

      default:
        return {
          label: status || "Inconnu",
          className: "status-default",
          icon: <FileText size={14} />,
        };
    }
  };

  const stats = [
    {
      title: "Total des naissances",
      value: dashboard?.totalBirths ?? 0,
      icon: <Baby size={28} />,
      className: "stat-green",
      description: "Toutes les naissances enregistrées",
    },
    {
      title: "Naissances validées",
      value: dashboard?.approvedBirths ?? 0,
      icon: <CheckCircle2 size={28} />,
      className: "stat-green-dark",
      description: "Actes officiellement validés",
    },
    {
      title: "En attente",
      value: dashboard?.pendingBirths ?? 0,
      icon: <Clock3 size={28} />,
      className: "stat-yellow",
      description: "Actes nécessitant une vérification",
    },
    {
      title: "Créées aujourd'hui",
      value: dashboard?.birthsToday ?? 0,
      icon: <CalendarDays size={28} />,
      className: "stat-red",
      description: "Nouvelles naissances aujourd'hui",
    },
  ];

  return (
    <div className="dashboard-container">

      {/* ================= HEADER ================= */}
      <div className="dashboard-header">

        <div>
          <div className="title-wrapper">
            <div className="title-icon">
              <Baby size={30} />
            </div>

            <div>
              <h1>Tableau de bord</h1>
              <p>
                Gestion et suivi des actes de naissance
              </p>
            </div>
          </div>
        </div>

        <button
          className="refresh-button"
          onClick={loadDashboard}
          disabled={loading}
        >
          <RefreshCw
            size={17}
            className={loading ? "spin" : ""}
          />
          Actualiser
        </button>
      </div>

      {/* ================= TRICOLORE ================= */}
      <div className="cameroon-line">
        <span className="green-line"></span>
        <span className="red-line"></span>
        <span className="yellow-line"></span>
      </div>

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Chargement des statistiques...</p>
        </div>
      )}

      {/* ================= ERROR ================= */}
      {!loading && error && (
        <div className="error-box">
          <CircleAlert size={22} />
          <div>
            <strong>Une erreur est survenue</strong>
            <p>{error}</p>
          </div>

          <button onClick={loadDashboard}>
            Réessayer
          </button>
        </div>
      )}

      {/* ================= DASHBOARD ================= */}
      {!loading && !error && dashboard && (
        <>
          {/* ================= STATISTIQUES ================= */}
          <div className="stats-grid">

            {stats.map((stat, index) => (
              <div
                className={`stat-card ${stat.className}`}
                key={index}
              >
                <div className="stat-card-top">

                  <div className="stat-icon">
                    {stat.icon}
                  </div>

                  <div className="stat-trend">
                    <TrendingUp size={14} />
                  </div>

                </div>

                <div className="stat-content">
                  <p>{stat.title}</p>

                  <h2>
                    {stat.value.toLocaleString("fr-FR")}
                  </h2>

                  <span>
                    {stat.description}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ================= SECTION DERNIERES NAISSANCES ================= */}
          <div className="birth-section">

            <div className="section-header">

              <div className="section-title">

                <div className="section-icon">
                  <FileText size={21} />
                </div>

                <div>
                  <h2>Dernières naissances</h2>
                  <p>
                    Les 5 derniers actes enregistrés
                  </p>
                </div>

              </div>

              <div className="birth-count">
                <Baby size={15} />
                {dashboard.latestBirths?.length ?? 0} acte(s)
              </div>

            </div>

            {Array.isArray(dashboard.latestBirths) &&
            dashboard.latestBirths.length > 0 ? (

              <div className="table-container">

                <table className="birth-table">

                  <thead>
                    <tr>
                      <th>ACTE</th>
                      <th>ENFANT</th>
                      <th>STATUT</th>
                      <th>DATE</th>
                      <th>PARENTS</th>
                    </tr>
                  </thead>

                  <tbody>

                    {dashboard.latestBirths
                      .slice(0, 5)
                      .map((birth) => {

                        const status = getStatusConfig(
                          birth.status
                        );

                        return (
                          <tr
                            key={
                              birth.id ??
                              birth.actNumber
                            }
                          >

                            {/* ACTE */}
                            <td>
                              <div className="act-number">

                                <div className="act-icon">
                                  <FileText size={16} />
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
                                  <Baby size={18} />
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

                            {/* STATUT */}
                            <td>
                              <span
                                className={`status-badge ${status.className}`}
                              >
                                {status.icon}
                                {status.label}
                              </span>
                            </td>

                            {/* DATE */}
                            <td>
                              <div className="date-info">

                                <CalendarDays
                                  size={16}
                                />

                                <span>
                                  {birth.createdAt
                                    ? new Date(
                                        birth.createdAt
                                      ).toLocaleString(
                                        "fr-FR",
                                        {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        }
                                      )
                                    : "—"}
                                </span>

                              </div>
                            </td>

                            {/* PARENTS */}
                            <td>

                              {Array.isArray(
                                birth.parents
                              ) &&
                              birth.parents.length > 0 ? (

                                <div className="parents-container">

                                  {birth.parents.map(
                                    (p, index) => {

                                      const father =
                                        p.fatherName
                                          ? `${p.fatherName}`
                                          : null;

                                      const mother =
                                        p.motherName
                                          ? `${p.motherName}`
                                          : null;

                                      return (
                                        <div
                                          key={index}
                                          className="parent-group"
                                        >

                                          {/* PERE */}
                                          {father && (
                                            <div className="parent">

                                              <div className="parent-icon father">
                                                <UserRound
                                                  size={14}
                                                />
                                              </div>

                                              <div>
                                                <strong>
                                                  {father}
                                                </strong>

                                                {p.fatherJob && (
                                                  <small>
                                                    <BriefcaseBusiness
                                                      size={12}
                                                    />
                                                    {p.fatherJob}
                                                  </small>
                                                )}
                                              </div>

                                            </div>
                                          )}

                                          {/* MERE */}
                                          {mother && (
                                            <div className="parent">

                                              <div className="parent-icon mother">
                                                <UserRound
                                                  size={14}
                                                />
                                              </div>

                                              <div>
                                                <strong>
                                                  {mother}
                                                </strong>

                                                {p.motherJob && (
                                                  <small>
                                                    <BriefcaseBusiness
                                                      size={12}
                                                    />
                                                    {p.motherJob}
                                                  </small>
                                                )}
                                              </div>

                                            </div>
                                          )}

                                          {!father &&
                                            !mother && (
                                              <span className="no-parent">
                                                Aucun parent
                                              </span>
                                            )}

                                        </div>
                                      );
                                    }
                                  )}

                                </div>

                              ) : (

                                <div className="no-parent">
                                  <Users size={15} />
                                  Aucun parent renseigné
                                </div>

                              )}

                            </td>

                          </tr>
                        );
                      })}

                  </tbody>

                </table>

              </div>

            ) : (

              <div className="empty-state">

                <div className="empty-icon">
                  <Baby size={32} />
                </div>

                <h3>
                  Aucune naissance récente
                </h3>

                <p>
                  Les nouveaux actes de naissance
                  apparaîtront ici.
                </p>

              </div>

            )}

          </div>
        </>
      )}

      <style>{`

        /* ================================
           DASHBOARD
        ================================= */

        .dashboard-container {
          min-height: 100vh;
          background: #f6f8f7;
          padding: 28px;
          color: #1f2937;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* ================================
           HEADER
        ================================= */

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .title-wrapper {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .title-icon {
          width: 58px;
          height: 58px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            135deg,
            #087f3e,
            #0b9b4c
          );
          color: white;
          box-shadow: 0 8px 20px rgba(
            8,
            127,
            62,
            0.25
          );
        }

        .dashboard-header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 750;
          color: #17221c;
        }

        .dashboard-header p {
          margin: 5px 0 0;
          color: #718078;
          font-size: 14px;
        }

        .refresh-button {
          border: none;
          background: white;
          color: #087f3e;
          padding: 11px 17px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0,0,0,0.06);
          transition: 0.2s;
        }

        .refresh-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 7px 20px rgba(0,0,0,0.1);
        }

        .refresh-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* ================================
           CAMEROON COLORS
        ================================= */

        .cameroon-line {
          width: 100%;
          height: 5px;
          display: flex;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 25px;
        }

        .green-line {
          flex: 1;
          background: #007a3d;
        }

        .red-line {
          flex: 1;
          background: #ce1126;
        }

        .yellow-line {
          flex: 1;
          background: #fcd116;
        }

        /* ================================
           STATISTICS
        ================================= */

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(
            4,
            minmax(0, 1fr)
          );
          gap: 18px;
          margin-bottom: 25px;
          width: 100%;
          max-width: 1200px;
        }

        .stat-card {
          position: relative;
          overflow: hidden;
          min-height: 185px;
          border-radius: 17px;
          padding: 21px;
          color: white;
          box-shadow: 0 7px 22px rgba(
            0,
            0,
            0,
            0.08
          );
          transition: 0.25s;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 30px rgba(
            0,
            0,
            0,
            0.13
          );
        }

        .stat-green {
          background: linear-gradient(
            135deg,
            #087f3e,
            #0ca653
          );
        }

        .stat-green-dark {
          background: linear-gradient(
            135deg,
            #075c31,
            #087f3e
          );
        }

        .stat-yellow {
          background: linear-gradient(
            135deg,
            #e7ad00,
            #fcd116
          );
          color: #312700;
        }

        .stat-red {
          background: linear-gradient(
            135deg,
            #b80e22,
            #ce1126
          );
        }

        .stat-card::after {
          content: "";
          position: absolute;
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background: rgba(
            255,
            255,
            255,
            0.08
          );
          right: -45px;
          bottom: -55px;
        }

        .stat-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-icon {
          width: 49px;
          height: 49px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(
            255,
            255,
            255,
            0.16
          );
        }

        .stat-trend {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(
            255,
            255,
            255,
            0.15
          );
        }

        .stat-content {
          margin-top: 18px;
        }

        .stat-content p {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          opacity: 0.9;
        }

        .stat-content h2 {
          margin: 5px 0;
          font-size: 34px;
          font-weight: 800;
        }

        .stat-content span {
          font-size: 11px;
          opacity: 0.78;
        }

        /* ================================
           BIRTH SECTION
        ================================= */

        .birth-section {
          background: white;
          border-radius: 18px;
          box-shadow: 0 5px 20px rgba(
            0,
            0,
            0,
            0.055
          );
          overflow: hidden;
          width: 100%;
          max-width: 1200px;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 24px;
          border-bottom: 1px solid #edf1ef;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-icon {
          width: 42px;
          height: 42px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e8f5ee;
          color: #087f3e;
        }

        .section-title h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 750;
        }

        .section-title p {
          margin: 4px 0 0;
          font-size: 12px;
          color: #87928d;
        }

        .birth-count {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f2f7f4;
          color: #087f3e;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }

        /* ================================
           TABLE
        ================================= */

        .table-container {
          width: 100%;
          overflow-x: visible;
        }

        .birth-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 0;
          table-layout: auto;
        }

        /* center containers to avoid internal horizontal scroll */
        .stats-grid,
        .birth-section,
        .table-container {
          margin-left: auto;
          margin-right: auto;
        }

        .birth-table thead {
          background: #f8faf9;
        }

        .birth-table th {
          padding: 14px 20px;
          text-align: left;
          font-size: 10px;
          letter-spacing: 0.6px;
          color: #7b8781;
          font-weight: 800;
          border-bottom: 1px solid #edf1ef;
        }

        .birth-table td {
          padding: 17px 20px;
          border-bottom: 1px solid #f0f2f1;
          vertical-align: middle;
        }

        .birth-table tbody tr {
          transition: 0.18s;
        }

        .birth-table tbody tr:hover {
          background: #f9fcfa;
        }

        /* ================================
           ACT NUMBER
        ================================= */

        .act-number,
        .child-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .act-icon {
          width: 35px;
          height: 35px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff4cc;
          color: #a57900;
        }

        .child-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e6f5ed;
          color: #087f3e;
        }

        .act-number strong,
        .child-info strong {
          display: block;
          font-size: 13px;
          color: #27322d;
        }

        .act-number small,
        .child-info small {
          display: block;
          margin-top: 3px;
          font-size: 10px;
          color: #9aa39f;
        }

        /* ================================
           STATUS
        ================================= */

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
        }

        .status-approved {
          background: #e5f7ec;
          color: #087f3e;
        }

        .status-pending {
          background: #fff5d4;
          color: #9a7100;
        }

        .status-rejected {
          background: #fde8eb;
          color: #b80e22;
        }

        .status-archived {
          background: #eef0f1;
          color: #59635e;
        }

        .status-default {
          background: #f0f2f1;
          color: #68736d;
        }

        /* ================================
           DATE
        ================================= */

        .date-info {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #68736d;
          font-size: 12px;
          white-space: nowrap;
        }

        .date-info svg {
          color: #087f3e;
        }

        /* ================================
           PARENTS
        ================================= */

        .parents-container {
          min-width: 220px;
        }

        .parent-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .parent {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .parent-icon {
          width: 28px;
          height: 28px;
          flex-shrink: 0;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .parent-icon.father {
          background: #e8f1ff;
          color: #2464b5;
        }

        .parent-icon.mother {
          background: #fff0f2;
          color: #c2354b;
        }

        .parent strong {
          display: block;
          font-size: 11px;
          color: #34403a;
        }

        .parent small {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 2px;
          color: #929b96;
          font-size: 10px;
        }

        .no-parent {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #a1aaa5;
          font-size: 11px;
        }

        /* ================================
           EMPTY
        ================================= */

        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          width: 65px;
          height: 65px;
          border-radius: 50%;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eef5f1;
          color: #087f3e;
        }

        .empty-state h3 {
          margin: 0;
          font-size: 16px;
        }

        .empty-state p {
          margin: 7px 0 0;
          color: #89938e;
          font-size: 13px;
        }

        /* ================================
           LOADING
        ================================= */

        .loading-container {
          min-height: 350px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #68736d;
        }

        .loader {
          width: 40px;
          height: 40px;
          border: 4px solid #e5eee9;
          border-top-color: #087f3e;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 15px;
        }

        .loading-container p {
          font-size: 13px;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ================================
           ERROR
        ================================= */

        .error-box {
          background: #fff1f2;
          border: 1px solid #ffd4d9;
          color: #a91e32;
          border-radius: 14px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .error-box strong {
          font-size: 14px;
        }

        .error-box p {
          margin: 4px 0 0;
          font-size: 12px;
        }

        .error-box button {
          margin-left: auto;
          border: none;
          background: #ce1126;
          color: white;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 12px;
          cursor: pointer;
        }

        /* ================================
           RESPONSIVE
        ================================= */

        @media (max-width: 1100px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {

          .dashboard-container {
            padding: 15px;
          }

          .dashboard-header {
            align-items: flex-start;
            gap: 15px;
          }

          .dashboard-header h1 {
            font-size: 22px;
          }

          .title-icon {
            width: 48px;
            height: 48px;
          }

          .refresh-button {
            padding: 9px;
          }

          .refresh-button {
            font-size: 0;
          }

          .refresh-button svg {
            margin: 0;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .stat-card {
            min-height: 155px;
          }

          .section-header {
            padding: 18px;
          }

          .birth-count {
            display: none;
          }

        }

      `}</style>

    </div>
  );
};

export default Dashboard;