import { combineReducers } from "redux";
import DashboardReducer from "./dashboard";
import FieldReducer from "./field";
import PesananReducer from "./pesanan";
import TransactionReducer from "./transaction";
import KeranjangReducer from "./keranjang";
import UserReducer from "./user";
import AuthReducer from "./auth";

export default combineReducers({
  DashboardReducer,
  FieldReducer,
  PesananReducer,
  TransactionReducer,
  KeranjangReducer,
  UserReducer,
  AuthReducer,
});
