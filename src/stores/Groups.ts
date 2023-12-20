import api from "../data/groupsApi";
import userStore from "./User";

import { observable, makeObservable, action } from "mobx";

class GroupsStore {
  groupsData = [];

  constructor() {
    makeObservable(this, {
      groupsData: observable,
      getGroups: action,
    });
  }

  getGroups = async () => {
    try {
      const data = await api.getGroups();

      this.groupsData = data;
    } catch (error) {
      console.warn(error);

      if (error.response.data.code === 401) {
        userStore.logout();
      }
    }
  };
}

const groupsStore = new GroupsStore();
export default groupsStore;
