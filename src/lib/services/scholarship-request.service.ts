import type { ApiPagination, StudentOnDepartment } from "../types";
import api from "./api-config";

const DEFAULT_ENDPOINT = "/scholarship-request";

export type PaginationQuery = {
  page?: number;
  size?: number;
};

export async function getScholarshipRequests(query?: PaginationQuery) {
  try {
    const result = await api.get<ApiPagination<StudentOnDepartment>>(
      DEFAULT_ENDPOINT,
      {
        params: query,
      },
    );

    return result.data;
  } catch (error) {
    return null;
  }
}
