import { apiClient } from "./httpClient";

class LampsApi {
  async getLamps() {
    try {
      const { data } = await apiClient.get("/lamps");

      console.log(data)
      

      return data;
    } catch (err) {
      console.warn(err);
    }
  }
}

export default new LampsApi();
