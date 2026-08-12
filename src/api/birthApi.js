import api from "./api";

// ===============================
// ENREGISTRER UNE NAISSANCE
// ===============================

export const createBirth = async (birthData) => {
  const response = await api.post("/births", birthData);

  return response.data;
};


// ===============================
// RÉCUPÉRER TOUTES LES NAISSANCES
// ===============================

export const getAllBirths = async () => {
  const response = await api.get("/births");

  return response.data;
};


// ===============================
// RÉCUPÉRER UNE NAISSANCE PAR ID
// ===============================

export const getBirthById = async (id) => {
  const response = await api.get(`/births/${id}`);

  return response.data;
};


// ===============================
// VALIDER UNE NAISSANCE
// ===============================

export const validateBirth = async (id) => {
  const response = await api.post(`/births/${id}/validate`);

  return response.data;
};


// ===============================
// MODIFIER UNE NAISSANCE (PARTIEL)
// ===============================

export const updateBirth = async (id, payload) => {
  const response = await api.put(`/births/${id}`, payload);

  return response.data;
};

// ===============================
// IMPRIMER UNE ACTE DE NAISSANCE
// ===============================

export const printBirth = async (id) => {
  const response = await api.post(
    `/births/${id}/print`,
    {},
    {
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
    }
  );

  return response.data;
};

// ===============================
// AJOUTER UNE PIÈCE JOINTE
// ===============================

export const uploadBirthAttachment = async (id, formData) => {
  const response = await api.post(
    `/births/${id}/attachments`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// ===============================
// RECHERCHER UN ACTE PAR NUMÉRO D'ACTE
// ===============================

export const searchBirthByActNumber = async (actNumber) => {
  const response = await api.post(`/births/search/${encodeURIComponent(actNumber)}`);

  return response.data;
};

// ===============================
// RÉCUPÉRER UNE NAISSANCE (POST) PAR ID - DÉTAILS COMPLETS
// ===============================

export const getBirthDetailsByPost = async (id) => {
  const response = await api.post(`/births/${encodeURIComponent(id)}`);

  return response.data;
};