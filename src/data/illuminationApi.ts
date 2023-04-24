import { apiClient, statsClient } from "./httpClient";

class illuminationApi {
  async getPhpIlluminationGroup(params) {
    try {
      const { data } = await statsClient.get("/stats/illumination-group.php", {
        params,
      });

      return data;
    } catch (err) {
      console.warn(err);
    }
  }

  async getPhpIllumination(params) {
    try {
      const { data } = await statsClient.get("/stats/illumination.php", {
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
