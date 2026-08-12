import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Upload,
  FileText,
  FileUp,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  X,
  Loader2,
  ShieldCheck,
  Paperclip,
} from "lucide-react";

import { uploadBirthAttachment } from "../../api/birthApi";

const UploadAttachment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] ?? null;

    setError("");
    setMessage("");
    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);

    // Réinitialiser le champ file
    const input = document.getElementById(
      "attachmentFile"
    );

    if (input) {
      input.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!file) {
      setError(
        "Veuillez sélectionner un fichier avant de continuer."
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await uploadBirthAttachment(
        id,
        formData
      );

      setMessage(
        response?.message ??
          "Pièce jointe ajoutée avec succès."
      );

      setTimeout(() => {
        navigate("/tout");
      }, 1200);
    } catch (err) {
      console.error(err);

      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Erreur lors du téléversement du fichier.";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 octet";

    if (bytes < 1024) {
      return `${bytes} octets`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} Ko`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(
      1
    )} Mo`;
  };

  return (
    <div className="container-fluid py-4">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="card border-0 shadow-sm mb-4 overflow-hidden"
        style={{
          borderRadius: "18px",
        }}
      >

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
                <Paperclip size={28} />
              </div>

              <div>

                <h2
                  className="fw-bold mb-1"
                  style={{
                    color: "#173b2b",
                  }}
                >
                  Ajouter une pièce jointe
                </h2>

                <p className="text-muted mb-0">
                  Ajouter un document à l'acte de naissance
                </p>

              </div>

            </div>

            <button
              type="button"
              className="btn btn-light border d-flex align-items-center gap-2"
              onClick={() => navigate("/tout")}
              disabled={loading}
            >
              <ArrowLeft size={18} />
              Retour
            </button>

          </div>

        </div>
      </div>

      {/* =====================================================
          ALERTES
      ===================================================== */}

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

            <strong>
              Téléversement réussi
            </strong>

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

            <strong>
              Téléversement impossible
            </strong>

            <div className="small mt-1">
              {error}
            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          CONTENU
      ===================================================== */}

      <div className="row g-4">

        {/* =================================================
            INFORMATIONS ACTE
        ================================================= */}

        <div className="col-lg-5">

          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderRadius: "18px",
            }}
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
                    style={{
                      color: "#173b2b",
                    }}
                  >
                    Acte concerné
                  </h5>

                  <small className="text-muted">
                    Informations du dossier
                  </small>

                </div>

              </div>

              {/* ID */}

              <div
                className="p-4 mb-3"
                style={{
                  background: "#f8faf9",
                  borderRadius: "14px",
                  borderLeft:
                    "4px solid #198754",
                }}
              >

                <small className="text-muted d-block mb-1">
                  Identifiant de la naissance
                </small>

                <strong
                  className="text-break"
                  style={{
                    color: "#173b2b",
                  }}
                >
                  {id || "Non disponible"}
                </strong>

              </div>

              {/* Document */}

              <div
                className="p-4 mb-3"
                style={{
                  background: "#f8faf9",
                  borderRadius: "14px",
                  borderLeft:
                    "4px solid #dc3545",
                }}
              >

                <div className="d-flex align-items-center gap-3">

                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "11px",
                      background: "#fdecec",
                      color: "#dc3545",
                    }}
                  >
                    <FileUp size={21} />
                  </div>

                  <div>

                    <small className="text-muted d-block">
                      Type d'opération
                    </small>

                    <strong>
                      Ajout de document
                    </strong>

                  </div>

                </div>

              </div>

              {/* Sécurité */}

              <div
                className="p-4"
                style={{
                  background: "#fffdf5",
                  borderRadius: "14px",
                  borderLeft:
                    "4px solid #ffc107",
                }}
              >

                <div className="d-flex align-items-start gap-3">

                  <ShieldCheck
                    size={23}
                    style={{
                      color: "#d39e00",
                    }}
                  />

                  <div>

                    <strong className="d-block mb-1">
                      Document sécurisé
                    </strong>

                    <small className="text-muted">
                      Le fichier sera associé à cet acte
                      de naissance dans le système.
                    </small>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            UPLOAD
        ================================================= */}

        <div className="col-lg-7">

          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderRadius: "18px",
              overflow: "hidden",
            }}
          >

            <div
              style={{
                height: "5px",
                background:
                  "linear-gradient(90deg, #198754 0%, #198754 33%, #dc3545 33%, #dc3545 66%, #ffc107 66%, #ffc107 100%)",
              }}
            />

            <div className="card-body p-4">

              <div className="d-flex align-items-center gap-3 mb-4">

                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "12px",
                    background: "#e8f5ee",
                    color: "#198754",
                  }}
                >
                  <Upload size={23} />
                </div>

                <div>

                  <h5
                    className="fw-bold mb-1"
                    style={{
                      color: "#173b2b",
                    }}
                  >
                    Sélectionner un fichier
                  </h5>

                  <small className="text-muted">
                    Choisissez le document à joindre à
                    l'acte
                  </small>

                </div>

              </div>

              <form onSubmit={handleSubmit}>

                {/* =========================================
                    DROPZONE
                ========================================= */}

                <label
                  htmlFor="attachmentFile"
                  className="upload-zone d-flex flex-column align-items-center justify-content-center text-center"
                >

                  <div
                    className="d-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "20px",
                      background: "#e8f5ee",
                      color: "#198754",
                    }}
                  >
                    <Upload size={32} />
                  </div>

                  <h6 className="fw-bold mb-2">
                    Cliquez pour sélectionner
                  </h6>

                  <p className="text-muted small mb-1">
                    Sélectionnez le document depuis votre
                    ordinateur
                  </p>

                  <small className="text-muted">
                    PDF, JPG, PNG ou autre fichier accepté
                  </small>

                </label>

                <input
                  id="attachmentFile"
                  type="file"
                  className="d-none"
                  onChange={handleFileChange}
                />

                {/* =========================================
                    FICHIER SELECTIONNE
                ========================================= */}

                {file && (

                  <div
                    className="mt-4 p-3"
                    style={{
                      background: "#f8faf9",
                      borderRadius: "14px",
                      border:
                        "1px solid #dee2e6",
                    }}
                  >

                    <div className="d-flex align-items-center gap-3">

                      <div
                        className="d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "12px",
                          background:
                            "#fdecec",
                          color: "#dc3545",
                        }}
                      >
                        <FileText size={24} />
                      </div>

                      <div className="flex-grow-1 min-width-0">

                        <strong
                          className="d-block text-break"
                          style={{
                            color:
                              "#173b2b",
                          }}
                        >
                          {file.name}
                        </strong>

                        <small className="text-muted">
                          {formatFileSize(
                            file.size
                          )}
                        </small>

                      </div>

                      <button
                        type="button"
                        className="btn btn-light border d-flex align-items-center justify-content-center"
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius:
                            "10px",
                        }}
                        onClick={
                          handleRemoveFile
                        }
                        disabled={loading}
                        title="Supprimer le fichier"
                      >
                        <X size={18} />
                      </button>

                    </div>

                  </div>

                )}

                {/* =========================================
                    ACTIONS
                ========================================= */}

                <div
                  className="d-flex flex-column flex-sm-row gap-3 mt-4"
                >

                  <button
                    type="button"
                    className="btn btn-light border px-4 py-2 d-flex align-items-center justify-content-center gap-2"
                    onClick={() =>
                      navigate("/tout")
                    }
                    disabled={loading}
                  >
                    <ArrowLeft size={18} />
                    Annuler
                  </button>

                  <button
                    className="btn btn-success flex-grow-1 py-2 d-flex align-items-center justify-content-center gap-2"
                    type="submit"
                    disabled={
                      loading || !file
                    }
                    style={{
                      borderRadius:
                        "10px",
                    }}
                  >

                    {loading ? (
                      <>
                        <Loader2
                          size={19}
                          style={{
                            animation:
                              "spin 1s linear infinite",
                          }}
                        />

                        Téléversement...
                      </>
                    ) : (
                      <>
                        <Upload
                          size={19}
                        />

                        Ajouter la pièce jointe
                      </>
                    )}

                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          INFORMATION
      ===================================================== */}

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
                Conseils pour le document
              </h6>

              <p className="text-muted small mb-0">
                Assurez-vous que le document sélectionné
                est lisible et correspond bien à l'acte de
                naissance concerné avant de procéder au
                téléversement.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          STYLE
      ===================================================== */}

      <style>
        {`
          .upload-zone {
            min-height: 260px;
            border: 2px dashed #198754;
            border-radius: 16px;
            background: #f8faf9;
            cursor: pointer;
            padding: 30px;
            transition: all 0.2s ease;
          }

          .upload-zone:hover {
            background: #eef8f2;
            border-color: #157347;
            transform: translateY(-1px);
          }

          .btn {
            transition: all 0.2s ease;
          }

          .btn:hover:not(:disabled) {
            transform: translateY(-1px);
          }

          .min-width-0 {
            min-width: 0;
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

export default UploadAttachment;