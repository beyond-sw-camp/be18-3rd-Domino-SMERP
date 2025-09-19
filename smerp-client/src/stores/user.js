import { defineStore } from "pinia";
import { fetchMe } from "@/api/auth";

export const useUserStore = defineStore("user", {
  state: () => ({
    name: null,
    loaded: false, 
  }),
  actions: {
    async loadUser() {
      try {
        const res = await fetchMe();
        this.name = res.data?.userName ?? null;
      } catch {
        this.name = null;
      } finally {
        this.loaded = true;
      }
    },
    clear() {
      this.name = null;
      this.loaded = false;
    },
  },
});