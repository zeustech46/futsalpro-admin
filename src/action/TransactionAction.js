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

export const GET_LIST_TRANSACTION = "GET_LIST_TRANSACTION";
export const SAVE_KEYWORD_TRANSACTION = "SAVE_KEYWORD_HISTORY";
export const GET_LIST_TRANSACTION_USER = "GET_LIST_TRANSACTION_USER";

export const getListTransaction = (keyword) => {
  return (dispatch) => {
    dispatchLoading(dispatch, GET_LIST_TRANSACTION);

    if (keyword === "semua") {
      onValue(
        ref(db, "histories/"),
        (snapshot) => {
          if (snapshot.val()) {
            const data = Object.keys(snapshot.val()).map((item) => snapshot.val()[item]);

            const filterData = data.filter((filter) => !filter.libur).map((item) => item);
            // berhasil
            dispatchSuccess(dispatch, GET_LIST_TRANSACTION, filterData.reverse());

            // Simpan di Async Storage
          } else {
            dispatchError(dispatch, GET_LIST_TRANSACTION, "Data Lapangan Tidak Tersedia");
          }
        },
        {
          onlyOnce: true,
        }
      );
    } else if (keyword) {
      onValue(
        query(ref(db, "histories/"), orderByChild("order_id"), equalTo(keyword)),
        (snapshot) => {
          if (snapshot.val()) {
            // berhasil
            dispatchSuccess(dispatch, GET_LIST_TRANSACTION, snapshot.val());
          } else {
            onValue(
              query(ref(db, "histories/"), orderByChild("nama"), equalTo(keyword)),
              (snapshot) => {
                if (snapshot.val()) {
                  // berhasil
                  dispatchSuccess(dispatch, GET_LIST_TRANSACTION, snapshot.val());
                } else {
                  dispatchError(dispatch, GET_LIST_TRANSACTION, "Data Liga tidak ada");
                }
              },
              {
                onlyOnce: true,
              }
            );
          }
        },
        {
          onlyOnce: true,
        }
      );
    } else {
      get(query(ref(db, `histories/`), limitToLast(10))).then(
        (snapshot) => {
          if (snapshot.val()) {
            // Custom comparator function to sort by 'tanggal' in descending order

            const data = Object.keys(snapshot.val()).map((item) => snapshot.val()[item]);

            const filterData = data.filter((filter) => !filter.libur).map((item) => item);
            // berhasil
            dispatchSuccess(dispatch, GET_LIST_TRANSACTION, filterData.reverse());

            // Simpan di Async Storage
          } else {
            dispatchError(dispatch, GET_LIST_TRANSACTION, "Data Lapangan Tidak Tersedia");
          }
        },
        {
          onlyOnce: true,
        }
      );
    }
  };
};

export const saveKeywordTransaction = (search) => ({
  type: SAVE_KEYWORD_TRANSACTION,
  payload: {
    keyword: search,
  },
});

export const getListTransactionUser = (uid) => {
  return (dispatch) => {
    dispatchLoading(dispatch, GET_LIST_TRANSACTION_USER);

    onValue(
      query(ref(db, "histories/"), orderByChild("user"), equalTo(uid)),
      (snapshot) => {
        if (snapshot.val()) {
          const data = Object.keys(snapshot.val()).map((item) => snapshot.val()[item]);

          data.sort((a, b) => {
            // Membandingkan tanggal
            const tanggalA = new Date(a.tanggalOrder);
            const tanggalB = new Date(b.tanggalOrder);

            if (tanggalA - tanggalB !== 0) {
              return tanggalB - tanggalA;
            }

            // Jika tanggal sama, bandingkan waktu
            const waktuA = parseFloat(a.waktuOrder.replace(".", ":"));
            const waktuB = parseFloat(b.waktuOrder.replace(".", ":"));

            return waktuB - waktuA;
          });

          // berhasil
          dispatchSuccess(dispatch, GET_LIST_TRANSACTION_USER, data);
        } else {
          dispatchError(dispatch, GET_LIST_TRANSACTION_USER, "Data Liga tidak ada");
        }
      },
      {
        onlyOnce: true,
      }
    );
  };
};
