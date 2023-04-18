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
      const systemsData = await api.getSystems();

      const phpData = await Promise.all(
        systemsData?.map((item, index) => api.getAnotherSystem(index + 1))
      );

      const mapped = systemsData?.map((item, index) => {
        return {
          ...item,
          battery: phpData[index]?.battery,
          batterydays: phpData[index]?.batterydays,
          devices: phpData[index]?.devices,
          emergency: phpData[index]?.emergency,
          ps_battery: phpData[index]?.ps_battery,
          temperature: phpData[index]?.temperature,
        };
      });

      this.systemsData = mapped;
    } catch (err) {
      console.warn(err);
    }

    this.isLoading = false;
  };
}

const systemsStore = new SystemsStore();
export default systemsStore;
