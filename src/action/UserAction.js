import { dispatchLoading, dispatchSuccess, dispatchError } from "../utils/dispatch/index";
import { ref, onValue, query, orderByChild, equalTo } from "firebase/database";
import { db } from "../config/Firebase/index";

export const GET_DETAIL_USER = "GET_DETAIL_USER";
export const GET_LIST_USER = "GET_LIST_USER";

export const getListUser = (keyword) => {
  return (dispatch) => {
    dispatchLoading(dispatch, GET_LIST_USER);

    if (keyword) {
      onValue(
        query(ref(db, "users/"), orderByChild("uid"), equalTo(keyword)),
        (snapshot) => {
          if (snapshot.val()) {
            // berhasil
            dispatchSuccess(dispatch, GET_LIST_USER, snapshot.val());
          } else {
            onValue(
              query(ref(db, "users/"), orderByChild("fullName"), equalTo(keyword)),
              (snapshot) => {
                if (snapshot.val()) {
                  // berhasil
                  dispatchSuccess(dispatch, GET_LIST_USER, snapshot.val());
                } else {
                  onValue(
                    query(ref(db, "users/"), orderByChild("email"), equalTo(keyword)),
                    (snapshot) => {
                      if (snapshot.val()) {
                        // berhasil
                        dispatchSuccess(dispatch, GET_LIST_USER, snapshot.val());
                      } else {
                        dispatchError(dispatch, GET_LIST_USER, "Data Liga tidak ada");
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
          }
        },
        {
          onlyOnce: true,
        }
      );
    } else {
      onValue(
        ref(db, `users/`),
        (snapshot) => {
          if (snapshot.val()) {
            // berhasil
            dispatchSuccess(dispatch, GET_LIST_USER, snapshot.val());
          }
        },
        {
          onlyOnce: true,
        }
      );
    }
  };
};

export const getDetailUser = (uid) => {
  return (dispatch) => {
    dispatchLoading(dispatch, GET_DETAIL_USER);

    onValue(
      ref(db, `users/${uid}`),
      (snapshot) => {
        if (snapshot.val()) {
          // berhasil
          dispatchSuccess(dispatch, GET_DETAIL_USER, snapshot.val());

          // Simpan di Async Storage
        } else {
          onValue(
            ref(db, `admin/${uid}`),
            (snapshot) => {
              if (snapshot.val()) {
                dispatchSuccess(dispatch, GET_DETAIL_USER, snapshot.val());
              } else {
                dispatchError(dispatch, GET_DETAIL_USER, "Data Lapangan Tidak Tersedia");
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
  };
};
