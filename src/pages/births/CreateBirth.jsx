import React, { useState } from "react";
import { createBirth } from "../../api/birthApi";

const CreateBirth = () => {

  const [formData, setFormData] = useState({
    childFirstname: "",
    childLastname: "",
    birthDate: "",
    birthPlace: "",
    sex: "",
    centerId: "",

    fatherName: "",
    motherName: "",
    fatherJob: "",
    motherJob: "",
  });

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");


  // ===============================
  // MODIFICATION DU FORMULAIRE
  // ===============================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // ===============================
  // SOUMISSION
  // ===============================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {

        const response = await createBirth(formData);

        // `createBirth` retourne `response.data` depuis l'API.
        const data = response?.data ?? response;

        console.log(data);

        const actNumber = data?.actNumber ?? data?.id ?? "N/A";

        setMessage(`Naissance enregistrée. Numéro d'acte : ${actNumber}`);

      // Réinitialiser le formulaire
      setFormData({
        childFirstname: "",
        childLastname: "",
        birthDate: "",
        birthPlace: "",
        sex: "",
        centerId: "",

        fatherName: "",
        motherName: "",
        fatherJob: "",
        motherJob: "",
      });

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Une erreur est survenue."
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="container">

      <h1 className="mb-4">
        Enregistrer une naissance
      </h1>


      {/* MESSAGE SUCCÈS */}

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}


      {/* MESSAGE ERREUR */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}


      <form onSubmit={handleSubmit}>

        {/* ===================== */}
        {/* ENFANT */}
        {/* ===================== */}

        <h4 className="mb-3">
          Informations de l'enfant
        </h4>


        <div className="row">

          <div className="col-md-6 mb-3">

            <label className="form-label">
              Prénom
            </label>

            <input
              type="text"
              name="childFirstname"
              value={formData.childFirstname}
              onChange={handleChange}
              className="form-control"
              required
            />

          </div>


          <div className="col-md-6 mb-3">

            <label className="form-label">
              Nom
            </label>

            <input
              type="text"
              name="childLastname"
              value={formData.childLastname}
              onChange={handleChange}
              className="form-control"
              required
            />

          </div>


          <div className="col-md-6 mb-3">

            <label className="form-label">
              Date de naissance
            </label>

            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="form-control"
              required
            />

          </div>


          <div className="col-md-6 mb-3">

            <label className="form-label">
              Lieu de naissance
            </label>

            <input
              type="text"
              name="birthPlace"
              value={formData.birthPlace}
              onChange={handleChange}
              className="form-control"
              required
            />

          </div>


          <div className="col-md-6 mb-3">

            <label className="form-label">
              Sexe
            </label>

            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className="form-select"
              required
            >

              <option value="">
                Sélectionner
              </option>

              <option value="MALE">
                Masculin
              </option>

              <option value="FEMALE">
                Féminin
              </option>

            </select>

          </div>


          <div className="col-md-6 mb-3">

            <label className="form-label">
              Centre
            </label>

            <input
              type="text"
              name="centerId"
              value={formData.centerId}
              onChange={handleChange}
              className="form-control"
            />

          </div>

        </div>


        {/* ===================== */}
        {/* PARENTS */}
        {/* ===================== */}

        <h4 className="mt-4 mb-3">
          Informations des parents
        </h4>


        <div className="row">

          <div className="col-md-6 mb-3">

            <label className="form-label">
              Nom du père
            </label>

            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              className="form-control"
              required
            />

          </div>


          <div className="col-md-6 mb-3">

            <label className="form-label">
              Nom de la mère
            </label>

            <input
              type="text"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              className="form-control"
              required
            />

          </div>


          <div className="col-md-6 mb-3">

            <label className="form-label">
              Profession du père
            </label>

            <input
              type="text"
              name="fatherJob"
              value={formData.fatherJob}
              onChange={handleChange}
              className="form-control"
            />

          </div>


          <div className="col-md-6 mb-3">

            <label className="form-label">
              Profession de la mère
            </label>

            <input
              type="text"
              name="motherJob"
              value={formData.motherJob}
              onChange={handleChange}
              className="form-control"
            />

          </div>

        </div>


        {/* ===================== */}
        {/* BOUTON */}
        {/* ===================== */}

        <button
          type="submit"
          className="btn btn-success mt-3"
          disabled={loading}
        >

          {loading
            ? "Enregistrement..."
            : "Enregistrer la naissance"
          }

        </button>

      </form>

    </div>
  );
};

export default CreateBirth;