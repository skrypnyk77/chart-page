import { apiClient, statsClient } from "./httpClient";

class SystemsApi {
  async getNZSystem() {
    try {
      const { data } = await statsClient.get("/stats/4/stats.php");

      return data;
    } catch (err) {
      console.warn(err);
    }
  }

  async getSystems() {
    try {
      const { data } = await apiClient.get("/systems");

      return data;
    } catch (err) {
      console.warn(err);
    }
  }

  async getSystemById(id: number) {
    try {
      const { data } = await apiClient.get(`/systems/${id}`);

      return data;
    } catch (err) {
      console.warn(err);
    }
  }
}

export default new SystemsApi();
