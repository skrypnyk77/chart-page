import { apiClient, statsClient } from "./httpClient";

class batteryApi {
  async getPhpBatteryLevel(params) {
    try {
      const { data } = await statsClient.get("/stats/battery-level.php", {
        params,
      });

      return data;
    } catch (err) {
      console.warn(err);
    }
  }

  async getBatteryLevel(params) {
    try {
      const { data } = await apiClient.get("/graph/battery-level", { params });

      return data;
    } catch (err) {
      console.warn(err);
    }
  }
}

export default new batteryApi();
