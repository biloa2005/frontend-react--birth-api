import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Printer,
  Download,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building2,
  CalendarDays,
  MapPin,
  Baby,
  UserRound,
  ShieldCheck,
  Sparkles,
  RefreshCw,
} from "lucide-react";

import { printBirth } from "../../api/birthApi";

const PrintBirth = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePrintPdf = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (id) {
        const blob = await printBirth(id);
        const pdfBlob = new Blob([blob], { type: "application/pdf" });
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `acte_naissance_${id}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        setMessage("Le document PDF officiel a été téléchargé.");
      } else {
        window.print();
      }
    } catch (err) {
      console.warn("Impression directe du navigateur pour la démo", err);
      window.print();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fb-print-page">
      {/* ================= HEADER ================= */}
      <div className="fb-card fb-print-header-card mb-4 no-print">
        <div className="cameroon-flag-bar">
          <span className="flag-green"></span>
          <span className="flag-red"></span>
          <span className="flag-yellow"></span>
        </div>

        <div className="fb-print-header-content">
          <div className="d-flex align-items-center gap-3">
            <button
              className="fb-btn fb-btn-secondary p-2"
              onClick={() => navigate(-1)}
              title="Retour"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="fb-page-title">Impression du Certificat de Naissance</h1>
              <p className="fb-page-desc">
                Acte officiel conforme au registre national d'état civil
              </p>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button
              className="fb-btn fb-btn-red"
              onClick={handlePrintPdf}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="spin" />
                  <span>Génération...</span>
                </>
              ) : (
                <>
                  <Printer size={16} />
                  <span>Imprimer / Télécharger PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className="fb-card fb-success-banner mb-4 p-3 d-flex align-items-center gap-2 no-print">
          <CheckCircle2 size={18} className="text-green" />
          <span className="fw-semibold text-green">{message}</span>
        </div>
      )}

      {/* ================= ACTE OFFICIEL (STYLE CAMEROUN PREVIEW) ================= */}
      <div className="fb-card fb-certificate-card print-area mb-4">
        {/* Bordure tricolore d'honneur */}
        <div className="fb-cert-border">
          {/* En-tête officiel */}
          <div className="row text-center mb-4">
            <div className="col-5">
              <strong className="d-block small">RÉPUBLIQUE DU CAMEROUN</strong>
              <small className="text-muted d-block">Paix — Travail — Patrie</small>
              <small className="d-block mt-1">MINISTÈRE DE L'ADMINISTRATION TERRITORIALE</small>
              <small className="text-muted d-block">Région du Centre • Département du Mfoundi</small>
            </div>

            <div className="col-2 d-flex flex-column align-items-center justify-content-center">
              <div className="fb-cert-emblem">
                <span className="text-yellow fw-bold fs-3">★</span>
              </div>
              <small className="fw-bold text-green mt-1">SIVEC</small>
            </div>

            <div className="col-5">
              <strong className="d-block small">REPUBLIC OF CAMEROON</strong>
              <small className="text-muted d-block">Peace — Work — Fatherland</small>
              <small className="d-block mt-1">MINISTRY OF TERRITORIAL ADMINISTRATION</small>
              <small className="text-muted d-block">Centre Region • Mfoundi Division</small>
            </div>
          </div>

          <div className="cameroon-flag-bar mb-4">
            <span className="flag-green"></span>
            <span className="flag-red"></span>
            <span className="flag-yellow"></span>
          </div>

          {/* Titre du document */}
          <div className="text-center mb-4">
            <h2 className="fb-cert-title text-green">ACTE DE NAISSANCE</h2>
            <h5 className="fb-cert-subtitle text-muted">BIRTH CERTIFICATE</h5>
            <div className="fb-cert-act-no mt-2">
              <strong>N° D'ACTE : {id ? `ACT-2026-00${id}` : "ACT-2026-00142"}</strong>
            </div>
          </div>

          {/* Corps de l'acte */}
          <div className="fb-cert-body">
            <p>
              Le <strong>14 Août 2026</strong> à <strong>08 heures 30 minutes</strong>, est né(e) à{" "}
              <strong>Yaoundé (Hôpital Central de Yaoundé)</strong> :
            </p>

            <div className="fb-cert-highlight-box my-3">
              <div className="row g-2">
                <div className="col-12 col-sm-8">
                  <span className="text-muted small d-block">Nom et Prénoms de l'enfant :</span>
                  <h4 className="fw-bold text-dark mb-0">Noah Junior KAMGANG</h4>
                </div>
                <div className="col-12 col-sm-4 text-sm-end">
                  <span className="text-muted small d-block">Sexe :</span>
                  <strong className="text-green fs-5">MASCULIN (Garçon)</strong>
                </div>
              </div>
            </div>

            <div className="row g-3 my-2">
              <div className="col-12 col-md-6">
                <div className="fb-cert-parent-box">
                  <span className="text-muted small d-block">De (Père) :</span>
                  <strong>KAMGANG Michel</strong>
                  <div className="small text-muted">Profession : Ingénieur Télécoms</div>
                  <div className="small text-muted">Nationalité : Camerounaise</div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="fb-cert-parent-box">
                  <span className="text-muted small d-block">Et de (Mère) :</span>
                  <strong>BEKONO Chantal</strong>
                  <div className="small text-muted">Profession : Enseignante</div>
                  <div className="small text-muted">Nationalité : Camerounaise</div>
                </div>
              </div>
            </div>

            <p className="mt-4">
              Dressé le <strong>14 Août 2026</strong> sur la déclaration des parents, par nous,{" "}
              <strong>Jean Dupont</strong>, Officier d'État Civil du Centre Principal de Yaoundé I, assisté de notre secrétaire.
            </p>
          </div>

          {/* Signatures & Sceaux */}
          <div className="row mt-5 pt-4">
            <div className="col-6 text-center">
              <small className="text-muted d-block">Le Déclarant</small>
              <div className="fb-cert-sign-space">
                <em>Signé électroniquement</em>
              </div>
            </div>

            <div className="col-6 text-center">
              <small className="text-muted d-block">L'Officier d'État Civil</small>
              <div className="fb-cert-sign-space">
                <div className="fb-cert-stamp">
                  <span>RÉPUBLIQUE DU CAMEROUN</span>
                  <strong className="text-red">ÉTAT CIVIL YAOUNDÉ I</strong>
                  <span>SCEAU OFFICIEL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        .fb-print-page {
          max-width: 860px;
          margin: 0 auto;
        }

        .fb-print-header-card {
          background: #ffffff;
          overflow: hidden;
        }

        .fb-print-header-content {
          padding: 18px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .fb-certificate-card {
          background: #ffffff;
          padding: 24px;
          box-shadow: var(--fb-shadow);
        }

        .fb-cert-border {
          border: 2px solid #087f3e;
          padding: 30px;
          border-radius: 8px;
          background: #ffffff;
          position: relative;
        }

        .fb-cert-emblem {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--sivec-green-light);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--sivec-green);
        }

        .fb-cert-title {
          font-weight: 900;
          letter-spacing: 2px;
          margin: 0;
          font-size: 24px;
        }

        .fb-cert-subtitle {
          font-weight: 700;
          letter-spacing: 1px;
          font-size: 14px;
        }

        .fb-cert-act-no {
          display: inline-block;
          padding: 4px 14px;
          background: var(--fb-hover);
          border-radius: 6px;
          border: 1px solid var(--fb-border);
          font-size: 13px;
        }

        .fb-cert-highlight-box {
          background: var(--fb-hover);
          border: 1px solid var(--fb-border);
          border-radius: 8px;
          padding: 14px 18px;
        }

        .fb-cert-parent-box {
          background: #fbfcfd;
          border: 1px dashed var(--fb-border);
          border-radius: 8px;
          padding: 12px 16px;
        }

        .fb-cert-sign-space {
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 10px;
        }

        .fb-cert-stamp {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          border: 2px dashed var(--sivec-red);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          text-align: center;
          color: var(--sivec-red);
          font-weight: 800;
          transform: rotate(-10deg);
        }

        @media print {
          .no-print { display: none !important; }
          .fb-print-page { max-width: 100% !important; margin: 0 !important; }
          .fb-certificate-card { box-shadow: none !important; border: none !important; }
        }
      `}</style>
    </div>
  );
};

export default PrintBirth;