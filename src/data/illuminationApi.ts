import { apiClient } from "./httpClient";

class illuminationApi {
  async getIlluminationDuration(params) {
    try {
      const { data } = await apiClient.get("/graph/illumination-duration", { params });

      return data;
    } catch (err) {
      console.warn(err);
    }
  }
}

export default new illuminationApi();
