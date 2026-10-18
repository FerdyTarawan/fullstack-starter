import { createServerFn } from "@tanstack/react-start";
import { fetchHealth } from "./health";

export const getHealth = createServerFn({ method: "GET" }).handler(() =>
  fetchHealth(process.env.API_BASE_URL ?? "http://127.0.0.1:8000"),
);
