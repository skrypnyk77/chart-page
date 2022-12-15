import { apiClient } from "./httpClient";

class SystemsApi {
  async getSystems() {
    try {
      const { data } = await apiClient.get("/systems");

      return data;
    } catch (err) {
      console.warn(err);
    }
  }
}

export default new SystemsApi();
