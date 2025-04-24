import { useContext } from "react";
import { AuthContext } from "../contexts/authContxtDef";

export const useAuth = () => {
  return useContext(AuthContext);
};
