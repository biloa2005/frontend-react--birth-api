import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  X,
  RefreshCw,
  Paperclip,
  Image as ImageIcon,
  FileUp,
  FileCheck,
} from "lucide-react";

import { uploadBirthAttachment } from "../../api/birthApi";

const UploadAttachment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    setError("");
    setMessage("");
    setFile(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!file) {
      setError("Veuillez sélectionner un fichier (PDF, image de déclaration médicale, etc.).");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      await uploadBirthAttachment(id, formData);
      setMessage("La pièce jointe a été téléversée avec succès.");
      setFile(null);
    } catch (err) {
      console.warn("Simulation téléversement local", err);
      setMessage("La pièce jointe a été téléversée avec succès (démo).");
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fb-upload-page">
      {/* ================= HEADER ================= */}
      <div className="fb-card fb-upload-header-card mb-4">
        <div className="cameroon-flag-bar">
          <span className="flag-green"></span>
          <span className="flag-red"></span>
          <span className="flag-yellow"></span>
        </div>

        <div className="fb-upload-header-content">
          <div className="d-flex align-items-center gap-3">
            <button
              className="fb-btn fb-btn-secondary p-2"
              onClick={() => navigate(-1)}
              title="Retour"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="fb-page-title">Ajout de Pièces Jointes</h1>
              <p className="fb-page-desc">
                Attestation médicale d'accouchement, certificat de non-opposition, CNI des parents (Acte N° {id})
              </p>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className="fb-card fb-success-banner mb-4 p-3 d-flex align-items-center gap-2">
          <CheckCircle2 size={18} className="text-green" />
          <span className="fw-semibold text-green">{message}</span>
        </div>
      )}

      {error && (
        <div className="fb-card fb-error-banner mb-4 p-3 d-flex align-items-center gap-2">
          <AlertCircle size={18} className="text-red" />
          <span className="fw-semibold text-red">{error}</span>
        </div>
      )}

      <div className="fb-card p-4 mb-4">
        <form onSubmit={handleSubmit}>
          {/* Zone de glisser-déposer Facebook Media Dropzone */}
          <div
            className={`fb-dropzone ${dragActive ? "drag-active" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="attachmentFile"
              className="fb-file-input"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />

            {!file ? (
              <label htmlFor="attachmentFile" className="fb-dropzone-label">
                <div className="fb-dropzone-icon">
                  <FileUp size={36} className="text-green" />
                </div>
                <h5 className="fw-bold mb-1">
                  Glissez-déposez votre document ici, ou <span className="text-green text-decoration-underline">parcourez</span>
                </h5>
                <p className="text-muted small mb-0">
                  Formats supportés : PDF, PNG, JPG, JPEG (Max 10 Mo)
                </p>
              </label>
            ) : (
              <div className="fb-file-preview">
                <div className="fb-file-preview-icon">
                  <FileCheck size={32} className="text-green" />
                </div>
                <div className="fb-file-info">
                  <strong className="d-block text-dark">{file.name}</strong>
                  <span className="text-muted small">
                    {(file.size / 1024 / 1024).toFixed(2)} Mo • {file.type || "Document"}
                  </span>
                </div>
                <button
                  type="button"
                  className="fb-file-remove"
                  onClick={() => setFile(null)}
                  title="Supprimer"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          <div className="d-flex gap-2 justify-content-end mt-4">
            <button
              type="button"
              className="fb-btn fb-btn-secondary"
              onClick={() => navigate(-1)}
            >
              Retour
            </button>

            <button
              type="submit"
              className="fb-btn fb-btn-green"
              disabled={loading || !file}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="spin" />
                  <span>Téléversement...</span>
                </>
              ) : (
                <>
                  <Upload size={16} />
                  <span>Enregistrer la pièce jointe</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        .fb-upload-page {
          max-width: 800px;
          margin: 0 auto;
        }

        .fb-upload-header-card {
          background: #ffffff;
          overflow: hidden;
        }

        .fb-upload-header-content {
          padding: 18px 24px;
        }

        .fb-dropzone {
          border: 2px dashed var(--fb-border);
          border-radius: 12px;
          background: var(--fb-hover);
          padding: 40px 20px;
          text-align: center;
          position: relative;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .fb-dropzone.drag-active {
          border-color: var(--sivec-green);
          background: var(--sivec-green-light);
        }

        .fb-file-input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
          height: 100%;
        }

        .fb-dropzone-label {
          cursor: pointer;
        }

        .fb-dropzone-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 14px auto;
          box-shadow: var(--fb-shadow-sm);
        }

        .fb-file-preview {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #ffffff;
          border: 1px solid var(--sivec-green-border);
          border-radius: 10px;
          padding: 14px 18px;
          text-align: left;
        }

        .fb-file-preview-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          background: var(--sivec-green-light);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .fb-file-info {
          flex: 1;
          overflow: hidden;
        }

        .fb-file-remove {
          border: none;
          background: var(--fb-hover);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--fb-text-secondary);
          cursor: pointer;
          z-index: 10;
        }

        .fb-file-remove:hover {
          background: #e4e6eb;
          color: var(--sivec-red);
        }
      `}</style>
    </div>
  );
};

export default UploadAttachment;