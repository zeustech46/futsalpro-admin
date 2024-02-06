// Argon Dashboard 2 MUI layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import VirtualReality from "layouts/virtual-reality";
import RTL from "layouts/rtl";
import Profile from "layouts/profile";
import Login from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import User from "./layouts/user/index";
import Users from "./layouts/users/index";
import Cart from "layouts/cart";
import Finish from "layouts/Midtrans/Finish";
import UnFinish from "layouts/Midtrans/Unfinish";
import Error from "layouts/Midtrans/Error";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";

const routes = [
  {
    type: "route",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <ArgonBox component="i" color="primary" fontSize="14px" className="ni ni-tv-2" />,
    component: <Dashboard />,
  },
  {
    type: "route",
    name: "Jadwal",
    key: "jadwal",
    route: "/jadwal",
    icon: (
      <ArgonBox component="i" color="warning" fontSize="14px" className="ni ni-calendar-grid-58" />
    ),
    component: <Tables />,
  },
  {
    type: "route",
    name: "Transaksi",
    key: "transaksi",
    route: "/transaksi",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-credit-card" />,
    component: <Billing />,
  },
  {
    type: "route",
    name: "User",
    key: "users",
    route: "/users",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-badge" />,
    component: <Users />,
  },

  // {
  //   type: "route",
  //   name: "RTL",
  //   key: "rtl",
  //   route: "/rtl",
  //   icon: <ArgonBox component="i" color="error" fontSize="14px" className="ni ni-world-2" />,
  //   component: <RTL />,
  // },
  // { type: "title", title: "Account Pages", key: "account-pages" },
  {
    type: "route",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <ArgonBox component="i" color="dark" fontSize="14px" className="ni ni-single-02" />,
    component: <Profile />,
  },
  {
    // type: "route",
    name: "Login",
    key: "login",
    route: "/login",
    icon: (
      <ArgonBox component="i" color="warning" fontSize="14px" className="ni ni-single-copy-04" />
    ),
    component: <Login />,
  },
  {
    name: "Cart",
    key: "cart",
    route: "/keranjang",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <Cart />,
  },

  {
    name: "User",
    key: "user",
    route: "/user/:id",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <User />,
  },
  {
    name: "Finish",
    key: "payment-finish",
    route: "/payment/finish",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <Finish />,
  },
  {
    name: "UnFinish",
    key: "payment-unfinish",
    route: "/payment/unfinish",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <UnFinish />,
  },
  {
    name: "Error",
    key: "payment-error",
    route: "/payment/error",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <Error />,
  },
];

export default routes;
