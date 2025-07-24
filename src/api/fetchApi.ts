import { API_HOST } from "@/services/env";

/** Đường dẫn host */
export const HOST: { [index: string]: string } =
  API_HOST[import.meta.env.VITE_APP_ENV || "production"];
