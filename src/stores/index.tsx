import { createContext } from "react";

import lampsStore from "./Lamps";
import userStore from "./User";

const rootStoreContext = createContext({
    lampsStore: lampsStore,
    userStore: userStore
});

export default rootStoreContext;
