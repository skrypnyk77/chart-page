import { apiClient } from "./httpClient";

class batteryApi {
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
