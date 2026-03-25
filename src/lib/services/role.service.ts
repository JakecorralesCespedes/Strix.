import type { ApiPagination, Role } from "../types";
import api from "./api-config";

const DEFAULT_ENDPOINT = "/roles";

export type PaginationQuery = {
  page?: number;
  size?: number;
};

export async function getRoles(query?: PaginationQuery) {
  try {
    const result = await api.get<ApiPagination<Role>>(DEFAULT_ENDPOINT, {
      params: query,
    });

    return result.data;
  } catch (error) {
    return null;
  }
}
