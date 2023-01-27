import { apiClient } from "./httpClient";

class UserApi {
  async login(params: any) {
    const { data } = await apiClient.post("/auth", {
      ...params,
    });

    return data;
  }

  async logout() {
    const { data } = await apiClient.get("/token/invalidate");

    return data;
  }
}

export default new UserApi();
