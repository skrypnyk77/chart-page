import { createContext } from "react";

import lampsStore from "./Lamps";
import systemsStore from "./Systems";
import userStore from "./User";

const rootStoreContext = createContext({
  lampsStore: lampsStore,
  systemsStore: systemsStore,
  userStore: userStore,
});

export default rootStoreContext;
