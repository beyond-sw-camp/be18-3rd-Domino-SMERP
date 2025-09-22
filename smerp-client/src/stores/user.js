import { defineStore } from "pinia";
import { fetchMe } from "@/api/auth";

export const useUserStore = defineStore("user", {
  state: () => ({
    name: null,
    loginId: null,
    loaded: false, 
  }),
  actions: {
    async loadUser() {
      try {
        const res = await fetchMe();
        this.name = res.data?.userName ?? null;
        this.loginId = res.data?.loginId ?? null;
      } catch {
        this.name = null;
        this.loginId = null;
      } finally {
        this.loaded = true;
      }
    },
    clear() {
      this.name = null;
      this.loginId = null;
      this.loaded = false;
    },
  },
});