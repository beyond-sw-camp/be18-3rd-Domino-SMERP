import http from "./http";

export function fetchOrders(page = 0, size = 20) {
  return http.get("/api/v1/orders", {
    params: {
      page,
      size,
    },
  });
}

export function fetchOrderDetail(documentNo) {
  return http.get(`/api/v1/orders/${documentNo}`);
}

export function getOrderSummary() {
  return http.get("/api/v1/orders/summary");
}
