import type { ApiPagination, User } from "../types";
import api from "./api-config";

const DEFAULT_ENDPOINT = "/users";

export type paginationQuery = {
  page?: number;
  size?: number;
};

export type GetUsersQuery = paginationQuery & {
  search?: string;
};

export async function getUsers(query?: GetUsersQuery) {
  try {
    const result = await api.get<ApiPagination<User>>(DEFAULT_ENDPOINT, {
      params: query,
    });

    return result.data;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const result = await api.get<User>(`${DEFAULT_ENDPOINT}/me`);
    return result.data;
  } catch (error) {
    return null;
  }
}

export async function getUser(id: number) {
  try {
    const result = await api.get<User>(`${DEFAULT_ENDPOINT}/${id}`);
    return result.data;
  } catch (error) {
    return null;
  }
}

export async function createUser(data: any) {
  try {
    const result = await api.post<User>(DEFAULT_ENDPOINT, data);
    return result.data;
  } catch (error) {
    return null;
  }
}

export async function updateUser(id: number, data: any) {
  try {
    const result = await api.put<User>(`${DEFAULT_ENDPOINT}/${id}`, data);
    return result.data;
  } catch (error) {
    return null;
  }
}
