import {
  ref,
  onValue,
  query,
  orderByChild,
  equalTo,
  get,
  limitToLast,
  endAt,
} from "firebase/database";
import { db } from "../config/Firebase/index";
import { dispatchLoading, dispatchSuccess, dispatchError } from "../utils/dispatch/index";

export const GET_LIST_FIELDS = "GET_LIST_FIELDS";

export const getListFields = () => {
  return (dispatch) => {
    dispatchLoading(dispatch, GET_LIST_FIELDS);

    onValue(
      ref(db, "fields/"),
      (snapshot) => {
        if (snapshot.val()) {
          // berhasil
          dispatchSuccess(dispatch, GET_LIST_FIELDS, snapshot.val());

          // Simpan di Async Storage
        } else {
          dispatchError(dispatch, GET_LIST_FIELDS, "Data Lapangan Tidak Tersedia");
        }
      },
      {
        onlyOnce: true,
      }
    );
  };
};
