import http from "./http";

/* Product APIs */
export const getProductsApi = () => http.get("/products");

export const getProductByIdApi = (id) =>
  http.get(`/products/${id}`);

export const createProductApi = (data) =>
  http.post("/products", data);

export const updateProductApi = (id, data) =>
  http.put(`/products/${id}`, data);

export const deleteProductApi = (id) =>
  http.delete(`/products/${id}`);
