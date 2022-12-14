import api from "../data/lampsApi";

import { observable, makeObservable, action } from "mobx";

class LampsStore {
  lampsData = [];
  lampsMeta = {};

  constructor() {
    makeObservable(this, {
      lampsData: observable,
      lampsMeta: observable,
      getLamps: action,
    });
  }

  getLamps = async () => {
    try {
      const data = await api.getLamps();

      this.lampsData = data.data;
      this.lampsMeta = data.meta;
    } catch (err) {
      console.warn(err);
    }
  };
}

const lampsStore = new LampsStore();
export default lampsStore;
