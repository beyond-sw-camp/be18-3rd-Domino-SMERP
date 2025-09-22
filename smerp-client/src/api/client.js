import http from "./http";

// 거래처 목록 조회
export function fetchClients() {
  return http.get("/api/v1/clients");
}

// 거래처 상세 조회
export function fetchClientDetail(clientId) {
  return http.get(`/api/v1/clients/${clientId}`);
}

// 거래처 정보 수정
export function updateClient(clientId, clientData) {
  return http.patch(`/api/v1/clients/${clientId}`, clientData);
}
