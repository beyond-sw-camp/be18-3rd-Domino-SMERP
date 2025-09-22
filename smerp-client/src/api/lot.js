import http from "./http";

// 로트 목록 조회 (페이지네이션)
export function fetchLots(page = 0, size = 20) {
  return http.get("/api/v1/lots", {
    params: {
      page,
      size,
    },
  });
}

// 로트 생성
export function createLot(lotData) {
  return http.post("/api/v1/lots", lotData);
}

// 로트 상세 조회
export function fetchLotDetail(lotId) {
  return http.get(`/api/v1/lots/${lotId}`);
}
