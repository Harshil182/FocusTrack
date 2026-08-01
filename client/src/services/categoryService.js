import api from "./api.js";

export const categoryService = {
  getCategories: () => api.get("/categories").then((r) => r.data),
  updateCategory: (id, payload) => api.put(`/categories/${id}`, payload).then((r) => r.data),
};
