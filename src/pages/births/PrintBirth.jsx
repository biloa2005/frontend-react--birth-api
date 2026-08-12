import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FileText,
  Download,
  Printer,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  FileDown,
} from "lucide-react";

import { printBirth } from "../../api/birthApi";

const PrintBirth = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePrint = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const blob = await printBirth(id);

      const pdfBlob = new Blob([blob], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `acte_naissance_${id}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);

      setMessage("Le PDF de l'acte a été généré avec succès.");
    } catch (err) {
      console.error(err);

      const status = err?.response?.status;

      let serverMessage =
        err?.message ||
        "Erreur lors de la génération du PDF.";

      if (err?.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();

          try {
            const json = JSON.parse(text);
            serverMessage =
              json?.message || text || serverMessage;
          } catch {
            serverMessage = text || serverMessage;
          }
        } catch (blobError) {
          console.error(
            "Impossible de lire le message d'erreur Blob",
            blobError
          );

          serverMessage =
            "Erreur serveur inconnue.";
        }
      } else if (err?.response?.data) {
        serverMessage =
          err.response.data?.message ||
          err.response.data ||
          serverMessage;
      }

      setError(
        `Erreur ${status || 500} : ${serverMessage}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">

      {/* ================= HEADER ================= */}

      <div
        className="card border-0 shadow-sm mb-4 overflow-hidden"
        style={{ borderRadius: "18px" }}
      >
        {/* Barre aux couleurs du Cameroun */}

        <div
          style={{
            height: "6px",
            background:
              "linear-gradient(90deg, #198754 0%, #198754 33%, #dc3545 33%, #dc3545 66%, #ffc107 66%, #ffc107 100%)",
          }}
        />

        <div className="card-body p-4">

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

            <div className="d-flex align-items-center gap-3">

              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "55px",
                  height: "55px",
                  borderRadius: "15px",
                  background: "#e8f5ee",
                  color: "#198754",
                }}
              >
                <FileText size={28} />
              </div>

              <div>
                <h2
                  className="fw-bold mb-1"
                  style={{ color: "#173b2b" }}
                >
                  Générer l'acte de naissance
                </h2>

                <p className="text-muted mb-0">
                  Génération et téléchargement du document officiel
                </p>
              </div>

            </div>

            <button
              type="button"
              className="btn btn-light border d-flex align-items-center gap-2"
              onClick={() => navigate("/tout")}
            >
              <ArrowLeft size={18} />
              Retour
            </button>

          </div>

        </div>
      </div>

      {/* ================= ALERTES ================= */}

      {message && (
        <div
          className="alert border-0 shadow-sm d-flex align-items-start gap-3 mb-4"
          style={{
            background: "#e9f7ef",
            color: "#146c43",
            borderRadius: "14px",
          }}
        >
          <CheckCircle2
            size={23}
            className="mt-1 flex-shrink-0"
          />

          <div>
            <strong>Génération réussie</strong>

            <div className="small mt-1">
              {message}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div
          className="alert border-0 shadow-sm d-flex align-items-start gap-3 mb-4"
          style={{
            background: "#fdecec",
            color: "#b02a37",
            borderRadius: "14px",
          }}
        >
          <AlertCircle
            size={23}
            className="mt-1 flex-shrink-0"
          />

          <div>
            <strong>Impossible de générer le document</strong>

            <div className="small mt-1">
              {error}
            </div>
          </div>
        </div>
      )}

      {/* ================= CONTENU ================= */}

      <div className="row g-4">

        {/* ================= INFORMATIONS ================= */}

        <div className="col-lg-7">

          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderRadius: "18px" }}
          >

            <div className="card-body p-4">

              <div className="d-flex align-items-center gap-3 mb-4">

                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "12px",
                    background: "#fff4d6",
                    color: "#d39e00",
                  }}
                >
                  <FileText size={23} />
                </div>

                <div>
                  <h5
                    className="fw-bold mb-1"
                    style={{ color: "#173b2b" }}
                  >
                    Informations du document
                  </h5>

                  <small className="text-muted">
                    Document associé à l'acte de naissance
                  </small>
                </div>

              </div>

              {/* ID */}

              <div
                className="p-4 mb-3"
                style={{
                  background: "#f8faf9",
                  borderRadius: "14px",
                  borderLeft: "4px solid #198754",
                }}
              >

                <div className="d-flex justify-content-between align-items-center gap-3">

                  <div>
                    <small className="text-muted d-block mb-1">
                      Identifiant de la naissance
                    </small>

                    <span
                      className="fw-bold text-break"
                      style={{ color: "#173b2b" }}
                    >
                      {id || "Non disponible"}
                    </span>
                  </div>

                  <ShieldCheck
                    size={27}
                    className="text-success flex-shrink-0"
                  />

                </div>

              </div>

              {/* Type document */}

              <div
                className="p-4 mb-3"
                style={{
                  background: "#f8faf9",
                  borderRadius: "14px",
                  borderLeft: "4px solid #dc3545",
                }}
              >

                <div className="d-flex align-items-center gap-3">

                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      background: "#fdecec",
                      color: "#dc3545",
                    }}
                  >
                    <FileDown size={21} />
                  </div>

                  <div>
                    <small className="text-muted d-block">
                      Type de document
                    </small>

                    <strong>
                      Acte de naissance
                    </strong>
                  </div>

                </div>

              </div>

              {/* Format */}

              <div
                className="p-4"
                style={{
                  background: "#f8faf9",
                  borderRadius: "14px",
                  borderLeft: "4px solid #ffc107",
                }}
              >

                <div className="d-flex align-items-center gap-3">

                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      background: "#fff8e1",
                      color: "#d39e00",
                    }}
                  >
                    <FileText size={21} />
                  </div>

                  <div>
                    <small className="text-muted d-block">
                      Format
                    </small>

                    <strong>
                      PDF
                    </strong>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ================= ACTION ================= */}

        <div className="col-lg-5">

          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderRadius: "18px",
              overflow: "hidden",
            }}
          >

            {/* Bandeau */}

            <div
              style={{
                height: "5px",
                background:
                  "linear-gradient(90deg, #198754 0%, #198754 33%, #dc3545 33%, #dc3545 66%, #ffc107 66%, #ffc107 100%)",
              }}
            />

            <div className="card-body p-4 d-flex flex-column">

              <div
                className="d-flex align-items-center justify-content-center mx-auto mb-4"
                style={{
                  width: "85px",
                  height: "85px",
                  borderRadius: "22px",
                  background: "#e8f5ee",
                  color: "#198754",
                }}
              >
                <Printer size={40} />
              </div>

              <h4
                className="text-center fw-bold mb-2"
                style={{ color: "#173b2b" }}
              >
                Générer le PDF
              </h4>

              <p className="text-center text-muted mb-4">
                Cliquez sur le bouton ci-dessous pour générer
                l'acte de naissance au format PDF.
              </p>

              {/* Séparateur */}

              <hr className="my-2" />

              <div className="py-3">

                <div className="d-flex align-items-center gap-3 mb-3">

                  <CheckCircle2
                    size={19}
                    className="text-success"
                  />

                  <span className="small">
                    Document généré au format PDF
                  </span>

                </div>

                <div className="d-flex align-items-center gap-3 mb-3">

                  <CheckCircle2
                    size={19}
                    className="text-success"
                  />

                  <span className="small">
                    Téléchargement automatique
                  </span>

                </div>

                <div className="d-flex align-items-center gap-3">

                  <CheckCircle2
                    size={19}
                    className="text-success"
                  />

                  <span className="small">
                    Document prêt à être imprimé
                  </span>

                </div>

              </div>

              {/* Bouton */}

              <div className="mt-auto pt-4">

                <button
                  type="button"
                  className="btn btn-success w-100 py-3 d-flex align-items-center justify-content-center gap-2 fw-semibold"
                  onClick={handlePrint}
                  disabled={loading || !id}
                  style={{
                    background: "#198754",
                    borderColor: "#198754",
                    borderRadius: "12px",
                  }}
                >

                  {loading ? (
                    <>
                      <Loader2
                        size={20}
                        style={{
                          animation:
                            "spin 1s linear infinite",
                        }}
                      />

                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Download size={20} />

                      Télécharger l'acte PDF
                    </>
                  )}

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= CONSEIL ================= */}

      <div
        className="card border-0 shadow-sm mt-4"
        style={{
          borderRadius: "16px",
          background: "#fffdf5",
        }}
      >

        <div className="card-body p-4">

          <div className="d-flex align-items-start gap-3">

            <div
              className="d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "11px",
                background: "#fff4d6",
                color: "#d39e00",
              }}
            >
              <ShieldCheck size={21} />
            </div>

            <div>

              <h6 className="fw-bold mb-1">
                Information
              </h6>

              <p className="text-muted small mb-0">
                Vérifiez les informations de l'acte avant
                de générer le document officiel. Le fichier PDF
                généré peut ensuite être imprimé ou archivé.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ================= STYLE ================= */}

      <style>
        {`
          .btn {
            transition: all 0.2s ease;
          }

          .btn:hover:not(:disabled) {
            transform: translateY(-1px);
          }

          .btn-success:hover:not(:disabled) {
            background: #157347 !important;
            border-color: #146c43 !important;
          }

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>

    </div>
  );
};

export default PrintBirth;