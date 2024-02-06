import { dispatchLoading, dispatchSuccess, dispatchError } from "../utils/dispatch/index";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../config/Firebase/index";
import { ref, set, onValue } from "firebase/database";
import { AlertError } from "../utils/alert/index";

export const LOGIN_USER = "LOGIN_USER";
export const CHECK_LOGIN = "CHECK_LOGIN";
export const LOGOUT_USER = "LOGOUT_USER";

export const loginUser = (email, password) => {
  return (dispatch) => {
    dispatchLoading(dispatch, LOGIN_USER);

    //Simpan email dan password di Authentication
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        //membaca data di firebase
        onValue(
          ref(db, `admin/${user.uid}`),
          (snapshot) => {
            if (snapshot.val()) {
              console.log(snapshot.val());
              //simpan data di localStorage
              window.localStorage.setItem("user", JSON.stringify(snapshot.val()));

              dispatchSuccess(dispatch, LOGIN_USER, snapshot.val());
            } else {
              AlertError("error", "Data User tidak ditemukan");

              dispatchError(dispatch, LOGIN_USER, "Gagal Login");
            }
          },
          {
            onlyOnce: true,
          }
        );

        // ...
      })
      .catch((error) => {
        AlertError("error", "Email dan Password tidak valid");

        dispatchError(dispatch, LOGIN_USER, "Gagal Login");
      });
  };
};

export const checkLogin = () => {
  return (dispatch) => {
    dispatchLoading(dispatch, CHECK_LOGIN);

    if (window.localStorage.getItem("user")) {
      const user = JSON.parse(window.localStorage.getItem("user"));
      dispatchSuccess(dispatch, CHECK_LOGIN, user);
    } else {
      dispatchError(dispatch, CHECK_LOGIN, "Belum Login");
    }
  };
};

export const logOutUser = () => {
  return (dispatch) => {
    dispatchLoading(dispatch, LOGOUT_USER);

    signOut(auth)
      .then((res) => {
        // Sign-out successful.
        window.localStorage.removeItem("user");
        console.log(window.localStorage.removeItem("user"));
        dispatchSuccess(dispatch, LOGOUT_USER, "berhasil");
      })
      .catch((error) => {
        // An error happened.
        dispatchError(dispatch, LOGOUT_USER, error.message);
      });
  };
};
