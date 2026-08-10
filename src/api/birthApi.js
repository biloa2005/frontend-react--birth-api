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