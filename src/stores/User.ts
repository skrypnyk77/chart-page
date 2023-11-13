import api from "../data/userApi";

import { observable, makeObservable, action } from "mobx";

interface CurrentUser {
  id: number;
  login: string;
  roles: string[];
  name: string;
  note: string;
  created_at: string;
  modified_at: string;
  available_systems: AvailableSystem[];
}

interface AvailableSystem {
  code: string;
  created_at: string;
  id: number;
  name: string;
}

class UserStore {
  user = {} as CurrentUser;
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
        this.isAdmin = true;
      }

      this.user = data;
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  login = async (params: any): Promise<void> => {
    try {
      await api.login(params);

      this.isLogged = true;
      this.authError = "";
    } catch (error) {
      console.log("error.message", error?.message);
      console.log("error.status", error.response?.status);
      console.log(
        "error.response.data.message",
        error?.response?.data?.message
      );
      console.log(
        "error.response.data.error.message",
        error?.response?.data?.error?.message
      );

      this.isLogged = false;
      this.authError = error?.response?.data?.message;
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
