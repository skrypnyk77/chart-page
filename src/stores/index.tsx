import { createContext } from "react";

import lampsStore from "./Lamps";
import groupsStore from "./Groups";
import systemsStore from "./Systems";
import userStore from "./User";

const rootStoreContext = createContext({
  lampsStore: lampsStore,
  groupsStore: groupsStore,
  systemsStore: systemsStore,
  userStore: userStore,
});

export default rootStoreContext;
