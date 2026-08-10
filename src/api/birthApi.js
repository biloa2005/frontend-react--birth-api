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