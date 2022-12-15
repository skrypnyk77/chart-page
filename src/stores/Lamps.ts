import api from "../data/lampsApi";

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
    } catch (err) {
      console.warn(err);
    }
  };
}

const lampsStore = new LampsStore();
export default lampsStore;
