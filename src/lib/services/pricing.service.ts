import type { ApiPagination, GlobalSetting, Pricing } from "../types";
import api from "./api-config";

const DEFAULT_ENDPOINT = "/price";

export type paginationQuery = {
  page?: number;
  size?: number;
};

export type GetPricingQuery = paginationQuery & {};

export async function getPricing(query?: GetPricingQuery) {
  try {
    const result = await api.get<Pricing[]>(DEFAULT_ENDPOINT, {
      params: query,
    });

    return result.data;
  } catch (error) {
    return null;
  }
}

export async function updatePricing(data: Pricing) {
  try {
    const result = await api.put<Pricing>(`${DEFAULT_ENDPOINT}`, {
      id: data.id,
      price: data.price,
      active: data.active,
    });
    return result.data;
  } catch (error) {
    return null;
  }
}
