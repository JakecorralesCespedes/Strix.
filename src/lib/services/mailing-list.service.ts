import type { ApiPagination, MailingList, User } from "../types";
import api from "./api-config";

const DEFAULT_ENDPOINT = "/mailing-list";

export type paginationQuery = {
  page?: number;
  size?: number;
};

export type GetMailingListQuery = paginationQuery & {};

export async function getMailingList(query?: GetMailingListQuery) {
  try {
    const result = await api.get<ApiPagination<MailingList>>(DEFAULT_ENDPOINT, {
      params: query,
    });

    return result.data;
  } catch (error) {
    return null;
  }
}

export async function createMalingList(body: MailingList) {
  try {
    const result = await api.post<MailingList>(DEFAULT_ENDPOINT, body);

    return result.data;
  } catch (error) {
    return null;
  }
}

export async function updateMailingList(id: number, body: MailingList) {
  try {
    const result = await api.put<MailingList>(
      `${DEFAULT_ENDPOINT}/${id}`,
      body,
    );

    return result.data;
  } catch (error) {
    return null;
  }
}
