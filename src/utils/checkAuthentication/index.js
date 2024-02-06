import React from "react";
import { Navigate } from "react-router-dom";

export const checkAuthentication = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      const isAuthenticated = window.localStorage.getItem("user")
        ? window.localStorage.getItem("user")
        : false;

      if (!isAuthenticated) {
        // Jika pengguna belum login, arahkan ke halaman login
        return <Navigate to="/login" />;
      }

      // Jika sudah login, tampilkan komponen yang dimasukkan
      return <WrappedComponent {...this.props} />;
    }
  };
};

export const checkAuthenticationLogin = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      const isAuthenticated = window.localStorage.getItem("user")
        ? window.localStorage.getItem("user")
        : false;

      console.log("isAuthenticated hahah :", isAuthenticated);

      if (!isAuthenticated) {
        // Jika pengguna belum login, arahkan ke halaman login
        console.log("masuk sini");
        return <Navigate to="/login" />;
      } else {
        console.log("masuk ya");
        return <Navigate to="/dashboard" />;
      }

      // Jika sudah login, tampilkan komponen yang dimasukkan
      return <WrappedComponent {...this.props} />;
    }
  };
};
