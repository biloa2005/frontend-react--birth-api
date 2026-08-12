import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAllBirths, getBirthDetailsByPost, deleteBirth } from "../../api/birthApi";

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


  useEffect(() => {

    const loadBirths = async () => {

      try {

        const response = await getAllBirths();

        setBirths(response.allBirth);

      } catch (error) {

        console.error(error);

        setError(
          "Impossible de récupérer les naissances."
        );

      } finally {

        setLoading(false);

      }

    };

    loadBirths();

  }, []);

  const handleShowDetails = async (id) => {
    if (!id) return;
    setDetailError("");
    setSelectedDetails(null);
    setShowDetails(true);
    setDetailLoading(true);

    try {
      const res = await getBirthDetailsByPost(id);
      if (res?.success) {
        setSelectedDetails(res.data ?? null);
      } else {
        setDetailError(res?.message || "Aucun acte trouvé.");
      }
    } catch (err) {
      console.error(err);
      setDetailError(err?.response?.data?.message || err.message || "Erreur lors de la récupération des détails.");
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedDetails(null);
    setDetailError("");
  };

  const handleDeleteBirth = async (id) => {
    if (!id) return;
    if (!window.confirm("Confirmer la suppression de cette naissance non validée ?")) {
      return;
    }

    setDeleteLoading(true);
    setError("");

    try {
      const res = await deleteBirth(id);
      if (res?.success) {
        setBirths((prev) => prev.filter((birth) => (birth.id || birth._id || birth.actNumber) !== id));
      } else {
        setError(res?.message || "Impossible de supprimer la naissance.");
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || "Erreur lors de la suppression.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const renderParentInfo = (p, i) => {
    if (p == null) return `Parent ${i + 1}`;

    // If parent is a primitive (string/number) just show it
    if (typeof p === 'string' || typeof p === 'number') return String(p);

    // Support nested shapes
    const person = p.person ?? p.parent ?? p;

    const first = person.firstname ?? person.firstName ?? person.name ?? person.fullName ?? null;
    const last = person.lastname ?? person.lastName ?? person.surname ?? null;
    const cin = person.cin ?? person.CIN ?? null;
    const profession = person.job ?? person.occupation ?? person.profession ?? person.metier ?? person.work ?? person.emploi ?? null;

    const name = first || last ? `${first ?? ''}${first && last ? ' ' : ''}${last ?? ''}`.trim() : null;

    const parts = [];
    if (name) parts.push(name);
    if (profession) parts.push(`Métier: ${profession}`);
    if (cin) parts.push(`CIN: ${cin}`);

    return parts.length > 0 ? parts.join(' — ') : `Parent ${i + 1}`;
  };


  if (loading) {
    return <p>Chargement...</p>;
  }


  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
      </div>
    );
  }


  return (
    <div>

      <div className="mb-3 d-flex justify-content-end">
        <button
          className="btn btn-success"
          onClick={() => navigate("/births/create")}
        >
          Créer une naissance
        </button>
      </div>

      <div className="table-responsive">

      <table className="table table-bordered table-hover">

        <thead className="table-success">

          <tr>

            <th>N° Acte</th>
            <th>Enfant</th>
            <th>Date naissance</th>
            <th>Lieu</th>
            <th>Sexe</th>
            <th>Statut</th>
            <th>Actions</th>

          </tr>

        </thead>


        <tbody>

          {births.length === 0 ? (

            <tr>

              <td
                colSpan="7"
                className="text-center"
              >
                Aucune naissance
              </td>

            </tr>

          ) : (

            births.map((birth) => (

              <tr key={birth.id ?? birth._id ?? birth.actNumber}>

                <td>{birth.actNumber ?? birth.id}</td>

                <td>
                  {birth.childFirstname} {birth.childLastname}
                </td>

                <td>
                  {birth.birthDate ? new Date(birth.birthDate).toLocaleDateString("fr-FR") : ""}
                </td>

                <td>{birth.birthPlace}</td>

                <td>{birth.sex}</td>

                <td>{birth.status}</td>

                <td className="d-flex gap-2 flex-wrap">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => handleShowDetails(birth.id || birth._id || birth.actNumber)}
                  >
                    Détails
                  </button>
                  {birth.status === "PENDING" && (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteBirth(birth.id || birth._id || birth.actNumber)}
                      disabled={deleteLoading}
                    >
                      Supprimer
                    </button>
                  )}
                  {birth.status !== "APPROVED" ? (
                    <>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => navigate(`/births/${birth.id || birth._id || birth.actNumber}/edit`)}
                      >
                        Modifier
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => navigate(`/births/${birth.id || birth._id || birth.actNumber}/attachments`)}
                      >
                        Pièce jointe
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => navigate(`/births/${birth.id || birth._id || birth.actNumber}/print`)}
                      >
                        Imprimer
                      </button>
                    </>
                  )}
                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
    {showDetails && (
      <>
        <div className="modal show d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Détails de la naissance</h5>
                <button type="button" className="btn-close" aria-label="Fermer" onClick={closeDetails}></button>
              </div>
              <div className="modal-body">
                {detailLoading ? (
                  <p>Chargement...</p>
                ) : detailError ? (
                  <div className="alert alert-danger">{detailError}</div>
                ) : selectedDetails ? (
                  <div>
                    <p><strong>ID :</strong> {selectedDetails.id}</p>
                    <p><strong>Numéro d'acte :</strong> {selectedDetails.actNumber}</p>
                    <p><strong>Enfant :</strong> {selectedDetails.childFirstname} {selectedDetails.childLastname}</p>
                    <p><strong>Date :</strong> {selectedDetails.birthDate ? new Date(selectedDetails.birthDate).toLocaleDateString('fr-FR') : ''}</p>
                    <p><strong>Lieu :</strong> {selectedDetails.birthPlace}</p>
                    <p><strong>Sexe :</strong> {selectedDetails.sex}</p>

                   <div className="mt-3">
  <strong>Parents :</strong>

  {selectedDetails.parents &&
  Array.isArray(selectedDetails.parents) &&
  selectedDetails.parents.length > 0 ? (
    selectedDetails.parents.map((parent, index) => (
      <div key={parent.id ?? index} className="mt-3">

        <h6>Père</h6>

        <p>
          <strong>Nom :</strong>{" "}
          {parent.fatherName || "Non renseigné"}
        </p>

        <p>
          <strong>Métier :</strong>{" "}
          {parent.fatherJob || "Non renseigné"}
        </p>

        <hr />

        <h6>Mère</h6>

        <p>
          <strong>Nom :</strong>{" "}
          {parent.motherName || "Non renseigné"}
        </p>

        <p>
          <strong>Métier :</strong>{" "}
          {parent.motherJob || "Non renseigné"}
        </p>

      </div>
    ))
  ) : (
    <p>Aucun parent renseigné</p>
  )}
</div>
                    <div className="mt-3">
                      <strong>Pièces jointes :</strong>
                      {Array.isArray(selectedDetails.attachments) && selectedDetails.attachments.length > 0 ? (
                        <ul>
                          {selectedDetails.attachments.map((a, i) => (
                            <li key={i}>{a.filename ?? a.name ?? `Fichier ${i+1}`}{a.url ? (<span> - <a href={a.url} target="_blank" rel="noreferrer">Ouvrir</a></span>) : null}</li>
                          ))}
                        </ul>
                      ) : (
                        <div>Aucune pièce jointe</div>
                      )}
                    </div>

                    {selectedDetails.history && selectedDetails.history.length > 0 && (
                      <div className="mt-3">
                        <strong>Historique :</strong>
                        <ul>
                          {selectedDetails.history.map((h, i) => (
                            <li key={i}>{h.action} - {h.by} - {h.date ? new Date(h.date).toLocaleString('fr-FR') : ''}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                  </div>
                ) : (
                  <div>Aucun détail disponible.</div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeDetails}>Fermer</button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop show"></div>
      </>
    )}
    </div>
  );
};

export default BirthTable;