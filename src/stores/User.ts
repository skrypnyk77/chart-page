import api from "../data/userApi";

import { observable, makeObservable, action } from "mobx";

class UserStore {
  authError = "";
  isLogged = false;

  constructor() {
    makeObservable(this, {
      authError: observable,
      isLogged: observable,
      login: action,
    });
  }

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
