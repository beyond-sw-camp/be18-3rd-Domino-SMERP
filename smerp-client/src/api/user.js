import http from "./http";

// 사용자 목록 조회
export function fetchUsers() {
  return http.get("/api/v1/users");
}

// 내 정보 조회
export function fetchMyInfo() {
  return http.get("/api/v1/users/my-info");
}

// 사용자 정보 수정
export function updateUser(userId, userData) {
  return http.patch(`/api/v1/users/${userId}`, userData);
}