import api from "../data/userApi";

import { observable, makeObservable, action } from "mobx";

class UserStore {
  //this token needs with all requests
  token = {};

  constructor() {
    makeObservable(this, {
      token: observable,
      login: action,
    });
  }

  login = async (params: any) => {
    try {
      const data = await api.login(params);  
    
      this.token = data.token;

      localStorage.setItem('token', data.token)
    } catch (err) {
      console.warn(err);
    }
  };
}

const userStore = new UserStore();
export default userStore;
