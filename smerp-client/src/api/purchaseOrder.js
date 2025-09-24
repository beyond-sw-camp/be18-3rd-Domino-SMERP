import http from "./http";

// 구매 등록
export function createPurchaseOrder(orderData) {
  return http.post("/api/v1/purchase-orders", orderData);
}