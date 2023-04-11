import { apiClient, statsClient } from "./httpClient";

class illuminationApi {
  async getNZIllumination(params) {
    try {
      const { data } = await statsClient.get("/stats/4/illumination.php", {
        params,
      });

      return data;
    } catch (err) {
      console.warn(err);
    }
  }

  async getIlluminationDuration(params) {
    try {
      const { data } = await apiClient.get("/graph/illumination-duration", {
        params,
      });

      return data;
    } catch (err) {
      console.warn(err);
    }
  }
}

export default new illuminationApi();
