import { apiClient, statsClient } from "./httpClient";

class SystemsApi {
  async updateSystem(params) {
    try {
      const { data } = await statsClient.get('stats/update-name.php', {
        params
      });

      return data;
    } catch (err) {
      console.warn(err);
    }
  }

  async getAnotherSystem(id: string) {
    try {
      const { data } = await statsClient.get(`/stats/stats.php?system=${id}`);

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
