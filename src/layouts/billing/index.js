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
import invoiceData from "layouts/tables/data/invoiceData";
import { Item, Total, Status, Aksi, Users } from "layouts/tables/data/invoiceData";
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
import { getListTransaction } from "../../action/TransactionAction";
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
import Swal from "sweetalert2";
import { deletePesanan } from "../../action/PesananAction";

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
    this.props.dispatch(getListTransaction());
  }

  componentDidUpdate(prevProps) {
    const { deletePesananResult } = this.props;

    if (deletePesananResult && prevProps.deletePesananResult !== deletePesananResult) {
      this.props.dispatch(getListTransaction());
    }
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

  deleteItemKeranjang(order_id, uid) {
    Swal.fire({
      title: "Hapus Transaksi",
      text: "Apakah Kamu Yakin?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      confirmButtonColor: "#d33",
      focusConfirm: false,
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.props.dispatch(deletePesanan(order_id, uid));

        Swal.fire({
          title: "Berhasil",
          text: "Jadwal Berhasil Dihapus",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  }

  render() {
    const { search, isModalVisible, dataModal } = this.state;
    const { getListTransactionResult, getListTransactionLoading } = this.props;
    const { columns: prCols } = invoiceData;

    console.log(dataModal[1]);

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

    const dataPesanan = dataModal[1] ? dataModal[1] : [];
    const nama = dataModal[2] ? dataModal[2] : "";
    const status = dataModal[3] ? dataModal[3] : "";
    const tanggalOrder = dataModal[4] ? dataModal[4] : "";
    const waktuOrder = dataModal[5] ? dataModal[5] : "";
    const totalHarga = dataModal[6] ? dataModal[6] : 0;

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

        <Modal
          open={isModalVisible}
          onClose={() => this.setState({ isModalVisible: !isModalVisible })}
        >
          <Box sx={style}>
            <ArgonBox
              sx={{
                position: "absolute",
                right: 30,
                cursor: "pointer",
              }}
              onClick={() => this.setState({ isModalVisible: !isModalVisible })}
            >
              <Icon fontSize="medium">close</Icon>
            </ArgonBox>

            <ArgonBox>
              <ArgonTypography variant="h6" fontWeight="bold" fontSize={18}>
                INFORMASI PESANAN
              </ArgonTypography>

              <ArgonBox display="flex" flexDirection="row">
                <ArgonTypography variant="h6" color="text">
                  No. Invoice :
                </ArgonTypography>
                <ArgonTypography variant="h6" fontWeight="medium" color="warning" ml={1}>
                  {dataModal[0]}
                </ArgonTypography>
              </ArgonBox>
            </ArgonBox>

            <ArgonBox display="flex" flexDirection="row" height="100%">
              <ArgonBox width="55%" flexWrap="wrap">
                {dataModal[1]
                  ? Object.keys(dataPesanan.pesanans).map((key, index) => {
                      return (
                        <CardKeranjang
                          keranjang={dataPesanan.pesanans[key]}
                          keranjangUtama={dataPesanan}
                          tanggal={key}
                          key={index}
                          navigation={navigation}
                        />
                      );
                    })
                  : []}
              </ArgonBox>
              <ArgonBox
                sx={{
                  borderLeft: ({ borders: { borderWidth, borderColor } }) =>
                    `${borderWidth[1]} solid ${borderColor}`,
                }}
                ml={3}
                pl={3}
                mt={2}
                width="40%"
              >
                <ArgonTypography variant="h6">Informasi Pengguna</ArgonTypography>

                <ArgonBox display="flex" flexDirection="column" justifyContent="space-between">
                  <ArgonBox
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    mt={2}
                    fontSize={15}
                  >
                    <ArgonTypography variant="h6" color="text" fontSize={15}>
                      Pemesan :
                    </ArgonTypography>
                    <ArgonTypography variant="h6" color="text" fontSize={15}>
                      {nama}
                    </ArgonTypography>
                  </ArgonBox>

                  <ArgonBox display="flex" flexDirection="row" justifyContent="space-between">
                    <ArgonTypography variant="h6" color="text" fontSize={15}>
                      Tanggal Pesan :
                    </ArgonTypography>
                    <ArgonTypography variant="h6" color="text" fontSize={15}>
                      {formatDateNumber(tanggalOrder)}
                    </ArgonTypography>
                  </ArgonBox>
                  <ArgonBox display="flex" flexDirection="row" justifyContent="space-between">
                    <ArgonTypography variant="h6" color="text" fontSize={15}>
                      Waktu Pesan :
                    </ArgonTypography>
                    <ArgonTypography variant="h6" color="text" fontSize={15}>
                      {waktuOrder} WIB
                    </ArgonTypography>
                  </ArgonBox>
                  <ArgonBox
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    mt={1}
                  >
                    <ArgonTypography variant="h6" color="text" fontSize={15}>
                      Status Pembayaran :
                    </ArgonTypography>
                    <ArgonBox
                      style={{ backgroundColor: alpha(color, 0.1), borderRadius: 10 }}
                      px={1}
                    >
                      <ArgonTypography
                        style={{ color: color, textTransform: "uppercase" }}
                        variant="h6"
                        fontWeight="medium"
                        px={1}
                        fontSize={14}
                      >
                        {status}
                      </ArgonTypography>
                    </ArgonBox>
                  </ArgonBox>
                  <ArgonBox
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    mt={3}
                  >
                    <ArgonTypography
                      variant="button"
                      color="warning"
                      fontWeight="bold"
                      fontSize={18}
                    >
                      Total Harga :
                    </ArgonTypography>
                    <ArgonTypography
                      variant="button"
                      color="warning"
                      fontWeight="bold"
                      fontSize={18}
                    >
                      {"Rp. " + numberWithCommas(totalHarga)}
                    </ArgonTypography>
                  </ArgonBox>
                </ArgonBox>

                <ArgonBox display="flex" flexDirection="column" alignItems="flex-end">
                  <ArgonBox component="img" src={icon} alt="sidebar_illustration" width="75%" />
                </ArgonBox>
              </ArgonBox>
            </ArgonBox>
          </Box>
        </Modal>

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
                    Transaksi Sewa Lapangan
                  </ArgonTypography>
                  <ArgonTypography variant="body2">
                    {getListTransactionResult && getListTransactionResult.length === 10
                      ? getListTransactionResult.length + " Transaksi Terakhir"
                      : "Semua Transaksi"}
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
                        placeholder="Cari Invoice ..."
                        size="large"
                      />
                    </ArgonBox>
                  </ArgonBox>
                  <ArgonBox display="flex">
                    <ArgonButton
                      onClick={() => {
                        this.props.dispatch(getListTransaction(search));
                        this.setState({
                          search: "",
                        });
                      }}
                      color="warning"
                    >
                      Cari Transaksi
                    </ArgonButton>
                  </ArgonBox>
                </ArgonBox>
              </ArgonBox>

              {getListTransactionResult ? (
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
                      rows={Object.keys(getListTransactionResult).map((item, index) => {
                        const dataOrder = getListTransactionResult[item];
                        const order_id = getListTransactionResult[item].order_id;
                        const nama = getListTransactionResult[item].nama;
                        const totalHarga = getListTransactionResult[item].totalHarga;
                        const status = getListTransactionResult[item].status;
                        const tanggalOrder = getListTransactionResult[item].tanggalOrder;
                        const waktuOrder = getListTransactionResult[item].waktuOrder;
                        const userId = getListTransactionResult[item].user;

                        return {
                          no: <Item value={index + 1} />,
                          invoice: [order_id],
                          name: <Users value={nama} uid={userId} />,
                          total: <Total value={totalHarga} />,
                          status: <Status value={status} />,
                          tanggal_order: <Item value={tanggalOrder} />,
                          // cetak, // Assuming you have a variable for 'cetak' button
                          aksi: (
                            <ArgonBox display="flex" flexDirection="row">
                              <ArgonBox mr={1}>
                                <ArgonButton
                                  size="small"
                                  color="primary"
                                  onClick={() =>
                                    this.toggleModal(
                                      order_id,
                                      dataOrder,
                                      nama,
                                      status,
                                      tanggalOrder,
                                      waktuOrder,
                                      totalHarga
                                    )
                                  }
                                >
                                  Lihat
                                </ArgonButton>
                              </ArgonBox>
                              <ArgonBox>
                                <ArgonButton
                                  size="small"
                                  color="error"
                                  onClick={() => this.deleteItemKeranjang(order_id, userId)}
                                >
                                  <Icon color="inherit">delete</Icon>
                                </ArgonButton>
                              </ArgonBox>
                            </ArgonBox>
                          ), // Assuming you have a variable for 'aksi' button
                        };
                      })}
                    />
                  </ArgonBox>

                  <ArgonBox
                    onClick={() => this.props.dispatch(getListTransaction("semua"))}
                    py={2}
                    px={5}
                    sx={{ cursor: "pointer" }}
                    display="flex"
                    flexDirection="row"
                    justifyContent="flex-end"
                  >
                    <ArgonTypography color="primary" variant="button">
                      Lihat Semua
                    </ArgonTypography>
                  </ArgonBox>
                </>
              ) : getListTransactionLoading ? (
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
  getListTransactionResult: state.TransactionReducer.getListTransactionResult,
  getListTransactionLoading: state.TransactionReducer.getListTransactionLoading,

  deletePesananResult: state.PesananReducer.deletePesananResult,
});

export default checkAuthentication(connect(mapStateToProps, null)(Billing));
