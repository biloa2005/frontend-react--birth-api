import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAllBirths } from "../../api/birthApi";

const BirthTable = () => {

  const navigate = useNavigate();

  const [births, setBirths] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


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
    </div>
  );
};

export default BirthTable;