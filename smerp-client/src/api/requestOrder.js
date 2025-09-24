import http from "./http";

// 발주 등록
export function createRequestOrder(orderData) {
  return http.post("/api/v1/request-orders", orderData);
}

// 발주 목록 조회
export function fetchRequestOrders(page = 0, size = 20, searchTerm = '') {
  return http.get("/api/v1/request-orders", { params: { page, size, searchTerm } });
}