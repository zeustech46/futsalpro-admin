// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";
import Footer from "examples/Footer";
import { alpha } from "@mui/material/styles";

// Argon Dashboard 2 MUI components
import MasterCard from "examples/Cards/MasterCard";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";
import invoiceData from "layouts/users/data/invoiceData";
import { Item, Total, Status, Aksi, Users } from "layouts/users/data/invoiceData";
import React, { Component } from "react";
import Icon from "@mui/material/Icon";

// Billing page components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PaymentMethod from "layouts/billing/components/PaymentMethod";
import Invoices from "layouts/billing/components/Invoices";
import BillingInformation from "layouts/billing/components/BillingInformation";
import Transactions from "layouts/billing/components/Transactions";
import Table from "examples/Tables/Table";
import { connect } from "react-redux";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardKeranjang from "../cart/components/CardKeranjang/index";
import { numberWithCommas } from "../../utils/numberFormat/index";
import icon from "assets/images/illustrations/icon-invoice.svg";
import { formatDateNumber } from "../../utils/formatDateNumber/index";
import { checkAuthentication } from "../../utils/checkAuthentication/index";
import CircularProgress from "@mui/material/CircularProgress";
import { getListUser } from "../../action/UserAction";
import { getListUserTotal } from "../../action/DashboardAction";
import { Link } from "react-router-dom";

class Billing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
      isModalVisible: false,
      dataModal: [],
    };
  }
  componentDidMount() {
    this.props.dispatch(getListUser());
    this.props.dispatch(getListUserTotal());
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  toggleModal(order_id, dataOrder, nama, status, tanggalOrder, waktuOrder, totalHarga) {
    const { isModalVisible } = this.state;
    this.setState({
      isModalVisible: !isModalVisible,
      dataModal: [order_id, dataOrder, nama, status, tanggalOrder, waktuOrder, totalHarga],
    });
  }

  render() {
    const { search, isModalVisible, dataModal } = this.state;
    const { getListUserResult, getListUserLoading, listUserTotalResult } = this.props;
    const { columns: prCols } = invoiceData;

    console.log(getListUserResult);

    const style = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "60%",
      height: "75%",
      bgcolor: "background.paper",
      boxShadow: 24,
      borderRadius: 4,
      p: 4,
      overflow: "scroll",
    };

    const totalUser = listUserTotalResult ? listUserTotalResult : [];

    let color;
    if (status === "pending") {
      color = "#fb6340";
    } else if (status === "lunas") {
      color = "#65CB8F";
    } else {
      color = "#f5365c";
    }
    return (
      <DashboardLayout>
        <DashboardNavbar />

        <ArgonBox mt={4}>
          <ArgonBox mb={2}>
            <Card>
              <ArgonBox
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                mx={3}
                pt={4}
                pb={5}
                flexWrap="wrap"
              >
                <ArgonBox display="flex" flexDirection="column">
                  <ArgonTypography variant="h4" fontWeight="bold">
                    List Informasi User
                  </ArgonTypography>
                  <ArgonTypography variant="body2">
                    Total User saat ini : {totalUser}
                  </ArgonTypography>
                </ArgonBox>

                <ArgonBox display="flex" flexDirection="row">
                  <ArgonBox component="form" role="form" mr={1} width={300}>
                    <ArgonBox>
                      <ArgonInput
                        name="search"
                        type="text"
                        value={search}
                        onChange={(value) => this.handleInputChange(value)}
                        placeholder="Masukkan ID User / nama / email ..."
                        size="large"
                      />
                    </ArgonBox>
                  </ArgonBox>
                  <ArgonBox display="flex">
                    <ArgonButton
                      onClick={() => {
                        this.props.dispatch(getListUser(search));
                        this.setState({
                          search: "",
                        });
                      }}
                      color="warning"
                    >
                      Cari User
                    </ArgonButton>
                  </ArgonBox>
                </ArgonBox>
              </ArgonBox>

              {getListUserResult ? (
                <>
                  <ArgonBox
                    sx={{
                      "& .MuiTableRow-root:not(:last-child)": {
                        "& td": {
                          borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                            `${borderWidth[1]} solid ${borderColor}`,
                        },
                      },
                    }}
                  >
                    <Table
                      columns={prCols}
                      rows={Object.keys(getListUserResult).map((item, index) => {
                        const dataUser = getListUserResult[item];
                        const userId = dataUser.uid;
                        const nama = dataUser.fullName;
                        const profesi = dataUser.profession;
                        const email = dataUser.email;
                        const photo = dataUser.photo;

                        return {
                          no: <Item value={index + 1} />,
                          user_id: [userId],
                          nama: <Users value={nama} photo={photo} />,
                          profesi: <Item value={profesi} />,
                          email: <Item value={email} />,
                          aksi: (
                            <ArgonBox display="flex" flexDirection="row">
                              <ArgonBox mr={1}>
                                <ArgonButton
                                  size="small"
                                  color="primary"
                                  to={"/user/" + userId}
                                  component={Link}
                                >
                                  Lihat
                                </ArgonButton>
                              </ArgonBox>
                            </ArgonBox>
                          ), // Assuming you have a variable for 'aksi' button
                        };
                      })}
                    />
                  </ArgonBox>

                  {/* <ArgonButton
                    onClick={() => {
                      // this.props.dispatch(getListTransaction("semua"))
                      console.log("haha");
                    }}
                  >
                    <ArgonTypography color="primary" variant="button">
                      Lihat Semua
                    </ArgonTypography>
                  </ArgonButton> */}
                </>
              ) : getListUserLoading ? (
                <ArgonBox
                  sx={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                  }}
                  mb={4}
                >
                  <CircularProgress />
                </ArgonBox>
              ) : (
                <ArgonBox
                  sx={{
                    borderTop: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[1]} solid ${borderColor}`,
                  }}
                  py={2}
                  px={5}
                  display="flex"
                  flexDirection="row"
                  justifyContent="center"
                >
                  <ArgonTypography color="primary" variant="button" fontSize={16}>
                    Data Tidak Ditemukan
                  </ArgonTypography>
                </ArgonBox>
              )}
            </Card>
          </ArgonBox>
        </ArgonBox>
        <Footer />
      </DashboardLayout>
    );
  }
}

const mapStateToProps = (state) => ({
  getListUserResult: state.UserReducer.getListUserResult,
  getListUserLoading: state.UserReducer.getListUserLoading,

  listUserTotalResult: state.DashboardReducer.listUserTotalResult,
});

export default checkAuthentication(connect(mapStateToProps, null)(Billing));
