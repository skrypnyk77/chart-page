import api from "../data/systemsApi";

import { observable, makeObservable, action } from "mobx";

class SystemsStore {
  systemsData = [];

  constructor() {
    makeObservable(this, {
      systemsData: observable,
      getSystems: action,
    });
  }

  getSystems = async () => {
    try {
      const data = await api.getSystems();

      this.systemsData = data;
    } catch (err) {
      console.warn(err);
    }
  };
}

const systemsStore = new SystemsStore();
export default systemsStore;
