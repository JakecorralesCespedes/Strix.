import type { ApiPagination, WorkHours } from "../types";
import api from "./api-config";

const DEFAULT_ENDPOINT = "/work-hours";

export type PaginationQuery = {
  page?: number;
  size?: number;
  departmentId?: number;
  studentId?: number;
  periodId?: number;
};

export async function getWorkHours(query?: PaginationQuery) {
  try {
    const result = await api.get<ApiPagination<WorkHours>>(DEFAULT_ENDPOINT, {
      params: query,
    });

    return result.data;
  } catch (error) {
    console.error("Error fetching work hours:", error);
    return null;
  }
}
