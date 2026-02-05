import http from "./http";

export const getProfit = (range) => http.get(`/profit?range=${range}`);
