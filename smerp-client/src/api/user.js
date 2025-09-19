import http from "./http";

// 사용자 목록 조회
export function fetchUsers() {
  return http.get("/api/v1/users");
}

// 사용자 정보 수정
export function updateUser(userId, userData) {
  return http.patch(`/api/v1/users/${userId}`, userData);
}
