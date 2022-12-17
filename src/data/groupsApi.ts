import { apiClient } from "./httpClient";

class GroupsApi {
  async getGroups() {
    try {
      const { data } = await apiClient.get("/groups");

      return data;
    } catch (err) {
      console.warn(err);
    }
  }
}

export default new GroupsApi();
