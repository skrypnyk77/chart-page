import api from "../data/groupsApi";

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
    } catch (err) {
      console.warn(err);
    }
  };
}

const groupsStore = new GroupsStore();
export default groupsStore;
