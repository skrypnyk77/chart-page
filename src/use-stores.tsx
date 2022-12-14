import { useContext } from "react";
import { default as rootStoreContext } from "./stores";

export const useStores = () => useContext(rootStoreContext);
