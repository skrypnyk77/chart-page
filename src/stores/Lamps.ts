import api from "../data/lampsApi";
import userStore from "./User";

import { observable, makeObservable, action } from "mobx";

class LampsStore {
  lampsData = [];

  constructor() {
    makeObservable(this, {
      lampsData: observable,
      getLamps: action,
    });
  }

  getLamps = async () => {
    try {
      const data = await api.getLamps();

      this.lampsData = data;
    } catch (error) {
      console.warn(error);

      if (error.response.data.code === 401) {
        userStore.logout();
      }
    }
  };
}

const lampsStore = new LampsStore();
export default lampsStore;
