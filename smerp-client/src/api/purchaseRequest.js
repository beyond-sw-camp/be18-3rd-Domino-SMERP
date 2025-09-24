import http from "./http";

// 구매 요청 등록
export function createPurchaseRequest(requestData) {
  return http.post("/api/v1/request-purchase-orders", requestData);
}