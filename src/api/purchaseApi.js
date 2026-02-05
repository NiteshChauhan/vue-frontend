import http from "./http";

export const createPurchaseApi = (data) =>
  http.post("/purchase", data);
