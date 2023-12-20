import api from "../data/systemsApi";
import userStore from "./User";

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
        systemsData?.map((item) => api.getAnotherSystem(item.id))
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
          last_update: phpData[index]?.last_update,
          illumination: phpData[index]?.illumination
        };
      });

      this.systemsData = mapped;
    } catch (error) {
      console.warn(error);

      if (error.response.data.code === 401) {
        userStore.logout();
      }
    }

    this.isLoading = false;
  };
}

const systemsStore = new SystemsStore();
export default systemsStore;
