import api from "../data/userApi";

import { observable, makeObservable, action } from "mobx";

class UserStore {
  user = {};
  authError = "";
  isLogged = false;
  isAdmin = false;

  constructor() {
    makeObservable(this, {
      authError: observable,
      isLogged: observable,
      user: observable,
      isAdmin: observable,
      getMe: action,
      login: action,
      logout: action,
    });
  }

  getMe = async (): Promise<void> => {
    try {
      const data = await api.getUsersMe();

      if (data.roles?.includes("ROLE_ADMIN")) {
        this.isAdmin = true
      }

      this.user = data;
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  login = async (params: any): Promise<void> => {
    try {
      const data = await api.login(params);

      this.isLogged = true;
      this.authError = "";
    } catch (error) {
      console.error(error.response.data.message);

      this.isLogged = false;
      this.authError = error.response.data.message;
    }
  };

  logout = async (): Promise<void> => {
    try {
      await api.logout();

      this.isLogged = false;
    } catch (error) {
      console.error(error.response.data.message);
    }
  };
}

const userStore = new UserStore();
export default userStore;
