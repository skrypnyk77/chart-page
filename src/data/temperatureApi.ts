import { apiClient, statsClient } from "./httpClient";

class temperatureApi {
  async getPhpOnlineDevices(params) {
    try {
      const { data } = await statsClient.get("/stats/online-devices.php", { params });

      return data;
    } catch (err) {
      console.warn(err);
    }
  }

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
