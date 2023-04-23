import { apiClient, statsClient } from "./httpClient";

class temperatureApi {
  async getPhpTemperature(params) {
    try {
      const { data } = await statsClient.get("/stats/temperature.php", { params });

      return data;
    } catch (err) {
      console.warn(err);
    }
  }

  async getTemperature(params) {
    try {
      const { data } = await apiClient.get("/graph/temperature", { params });

      return data;
    } catch (err) {
      console.warn(err);
    }
  }
}

export default new temperatureApi();
