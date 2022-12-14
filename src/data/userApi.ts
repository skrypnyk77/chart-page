import { apiClient } from "./httpClient";

class UserApi {
  async login(params: any) {
    const { data } = await apiClient.post('/auth', {
       ...params
    });

    return data;
  }
}

export default new UserApi();
