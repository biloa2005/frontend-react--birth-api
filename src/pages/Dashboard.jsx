import React, { useEffect, useState } from "react";
import { getBirthDashboard } from "../api/birthApi";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await getBirthDashboard();
        setDashboard(res.data ?? null);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || err.message || "Impossible de charger les statistiques.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div>
      <h1 className="mb-4">Tableau de bord des naissances</h1>

      {loading && <p>Chargement...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && dashboard && (
        <>
          <div className="row gy-3">
            <div className="col-md-3">
              <div className="card text-white bg-primary h-100">
                <div className="card-body">
                  <h5 className="card-title">Total des naissances</h5>
                  <p className="display-6 mb-0">{dashboard.totalBirths ?? 0}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-success h-100">
                <div className="card-body">
                  <h5 className="card-title">Naissances validées</h5>
                  <p className="display-6 mb-0">{dashboard.approvedBirths ?? 0}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-warning h-100">
                <div className="card-body">
                  <h5 className="card-title">Naissances en attente</h5>
                  <p className="display-6 mb-0">{dashboard.pendingBirths ?? 0}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-info h-100">
                <div className="card-body">
                  <h5 className="card-title">Créées aujourd'hui</h5>
                  <p className="display-6 mb-0">{dashboard.birthsToday ?? 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h2>5 dernières naissances</h2>
            {Array.isArray(dashboard.latestBirths) && dashboard.latestBirths.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-secondary">
                    <tr>
                      <th>Acte</th>
                      <th>Enfant</th>
                      <th>Statut</th>
                      <th>Créé le</th>
                      <th>Parents</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.latestBirths.slice(0, 5).map((birth) => (
                      <tr key={birth.id ?? birth.actNumber}>
                        <td>{birth.actNumber ?? birth.id}</td>
                        <td>{birth.childFirstname} {birth.childLastname}</td>
                        <td>{birth.status}</td>
                        <td>{birth.createdAt ? new Date(birth.createdAt).toLocaleString('fr-FR') : ''}</td>
                        <td>
                          {Array.isArray(birth.parents) && birth.parents.length > 0 ? (
                            birth.parents.map((p, index) => {
                              const father = p.fatherName ? `${p.fatherName}${p.fatherJob ? ` — ${p.fatherJob}` : ''}` : null;
                              const mother = p.motherName ? `${p.motherName}${p.motherJob ? ` — ${p.motherJob}` : ''}` : null;
                              return (
                                <div key={index}>
                                  {father && <div>Père: {father}</div>}
                                  {mother && <div>Mère: {mother}</div>}
                                  {!father && !mother && <div>Aucun parent</div>}
                                </div>
                              );
                            })
                          ) : (
                            <div>Aucun parent</div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>Aucune naissance récente disponible.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;