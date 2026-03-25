import api from "./api-config";

const DEFAULT_ENDPOINT = "/permissions";

export async function getPermissions() {
  try {
    const result = await api.get<string[]>(DEFAULT_ENDPOINT);
    return result.data;
  } catch (error) {
    return [];
  }
}
