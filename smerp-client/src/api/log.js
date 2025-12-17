import http from "./http";

// API 로그
export function fetchApiLogs(params = {}) {
  return http.get("/api/v1/logs/apis", { params });
}

// 에러 로그
export function fetchErrorLogs(params = {}) {
  return http.get("/api/v1/logs/errors", { params });
}

export function fetchActionLogs(params = {}) {
  return http.get("/api/v1/logs/actions", { params });
}

export function fetchActionLogDetail(id) {
  return http.get(`/api/v1/logs/actions/${id}`);
}