import api from "../data/systemsApi";

import { observable, makeObservable, action } from "mobx";

class SystemsStore {
  hardCodeSystem = {};
  isLoading = false;
  systemsData = [];

  constructor() {
    makeObservable(this, {
      hardCodeSystem: observable,
      isLoading: observable,
      systemsData: observable,
      getSystems: action,
      getHardCodeSystem: action,
    });
  }

  getHardCodeSystem = async () => {
    try {
      const data = await api.getNZSystem();

      console.log(data);

      this.hardCodeSystem = data;
    } catch (err) {
      console.warn(err);
    }
  };

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
