import api from "../data/systemsApi";

import { observable, makeObservable, action } from "mobx";

class SystemsStore {
  isLoading = false;
  systemsData = [];

  constructor() {
    makeObservable(this, {
      isLoading: observable,
      systemsData: observable,
      getSystems: action,
    });
  }

  getSystems = async () => {
    this.isLoading = true;

    try {
      const data = await api.getSystems();

      this.systemsData = data;
    } catch (err) {
      console.warn(err);
    }

    this.isLoading = false;
  };
}

const systemsStore = new SystemsStore();
export default systemsStore;
