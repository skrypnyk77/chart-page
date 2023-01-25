import api from "../data/userApi";

import { observable, makeObservable, action } from "mobx";

class UserStore {
  //this token needs with all requests
  token = {};
  authError = '';

  constructor() {
    makeObservable(this, {
      token: observable,
      authError: observable,
      login: action,
    });
  }

  login = async (params: any) => {
    try {
      const data = await api.login(params);

      this.token = data.token;

      localStorage.setItem("token", data.token);

      this.authError = '';
    } catch (error) {
      console.error(error.response.data.message);

      this.authError = error.response.data.message;
    }
  };
}

const userStore = new UserStore();
export default userStore;
