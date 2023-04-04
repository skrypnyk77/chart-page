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

  async getUsers(params?: any) {
    const { data } = await apiClient.get("/users", params);

    return data;
  }

  async createUser(params: any) {
    const { data } = await apiClient.post("/users", {
      ...params,
    });

    return data;
  }

  async updateUser(params: any) {
    const { id, ...rest } = params;

    await apiClient.patch(
      `/users/${id}`,
      {
        ...rest,
      },
      {
        headers: {
          "Content-Type": "application/merge-patch+json",
          Accept: "application/json",
        },
      }
    );
  }

  async deleteUser(id: string) {
    const { data } = await apiClient.delete(`/users/${id}`);

    return data;
  }
}

export default new UserApi();
