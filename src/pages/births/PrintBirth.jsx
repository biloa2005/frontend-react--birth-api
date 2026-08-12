import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { printBirth } from "../../api/birthApi";

const PrintBirth = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePrint = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const blob = await printBirth(id);
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `acte_naissance_${id}.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setMessage("PDF généré avec succès.");
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;
      let serverMessage = err?.message || "Erreur lors de la génération du PDF";

      if (err?.response?.data instanceof Blob) {
        try {
          serverMessage = await err.response.data.text();
        } catch (blobError) {
          console.error("Impossible de lire le message d'erreur Blob", blobError);
          serverMessage = "Erreur serveur inconnue (Blob)";
        }
      } else if (err?.response?.data) {
        serverMessage = err.response.data?.message || err.response.data;
      }

      if (status === 400) {
        setError(`Erreur ${status} : ${serverMessage}`);
      } else if (status === 404) {
        setError(`Erreur ${status} : ${serverMessage}`);
      } else {
        setError(`Erreur ${status || "500"} : ${serverMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="mb-4">Générer et imprimer l'acte</h1>

      <div className="mb-3">
        <strong>ID de naissance :</strong> {id}
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <button className="btn btn-success" onClick={handlePrint} disabled={loading || !id}>
        {loading ? "Génération en cours..." : "Télécharger le PDF"}
      </button>
    </div>
  );
};

export default PrintBirth;