import { apiClient } from "./httpClient";

class temperatureApi {
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
