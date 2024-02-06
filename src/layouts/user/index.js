// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import Icon from "@mui/material/Icon";

// Argon Dashboard 2 MUI examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";
import { Item, Total, Status, Users, cetak, Aksi } from "layouts/tables/data/invoiceData";

// Data

import BillingInformation from "layouts/billing/components/BillingInformation";
import Transactions from "layouts/billing/components/Transactions";

import KeranjangLapangan from "layouts/cart/components/KeranjangLapangan/";
import Order from "layouts/cart/components/Order/";
import ScheduleRequest from "layouts/billing/components/ScheduleRequest/index";
import team2 from "assets/images/team-2.jpg";
import invoiceData from "layouts/tables/data/invoiceData";
import { Component } from "react";
import Params from "../../utils/params/index";
import { connect } from "react-redux";
import { getDetailUser } from "../../action/UserAction";
import { getListTransactionUser } from "../../action/TransactionAction";
import ArgonButton from "components/ArgonButton";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CardKeranjang from "../cart/components/CardKeranjang/index";
import { alpha } from "@mui/material/styles";
import { numberWithCommas } from "../../utils/numberFormat/index";
import icon from "assets/images/illustrations/icon-invoice.svg";
import { formatDateNumber } from "../../utils/formatDateNumber/index";
import { deletePesanan } from "../../action/PesananAction";
import Swal from "sweetalert2";
import { checkAuthentication } from "../../utils/checkAuthentication/index";

class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.id,
      isModalVisible: false,
      dataModal: [],
    };
  }

  componentDidMount() {
    this.props.dispatch(getDetailUser(this.props.id));
    this.props.dispatch(getListTransactionUser(this.props.id));
  }

  componentDidUpdate(prevProps) {
    const { deletePesananResult } = this.props;

    if (deletePesananResult && prevProps.deletePesananResult !== deletePesananResult) {
      this.props.dispatch(getListTransactionUser(this.props.id));
    }
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
    const { columns: prCols } = invoiceData;
    const { isModalVisible, dataModal } = this.state;
    const { getDetailUserResult, getListTransactionUserResult } = this.props;

    const noInvoice = dataModal[0] ? dataModal[0] : [];
    const dataPesanan = dataModal[1] ? dataModal[1] : [];
    const nama = dataModal[2] ? dataModal[2] : "";
    const status = dataModal[3] ? dataModal[3] : "";
    const tanggalOrder = dataModal[4] ? dataModal[4] : "";
    const waktuOrder = dataModal[5] ? dataModal[5] : "";
    const totalHarga = dataModal[6] ? dataModal[6] : 0;

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
                {totalHarga !== 0 ? "INFORMASI PESANAN" : "INFORMASI JADWAL LIBUR"}
              </ArgonTypography>

              <ArgonBox display="flex" flexDirection="row">
                <ArgonTypography variant="h6" color="text">
                  No. Invoice :
                </ArgonTypography>
                <ArgonTypography variant="h6" fontWeight="medium" color="warning" ml={1}>
                  {noInvoice}
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
                          hariLibur={totalHarga === 0 ? true : false}
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
                <ArgonTypography variant="h6">
                  {totalHarga !== 0 ? "Informasi Pengguna" : "Detail"}
                </ArgonTypography>

                <ArgonBox display="flex" flexDirection="column" justifyContent="space-between">
                  <ArgonBox
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    mt={2}
                    fontSize={15}
                  >
                    <ArgonTypography variant="h6" color="text" fontSize={15}>
                      {totalHarga !== 0 ? "Pemesan :" : "Keterangan :"}
                    </ArgonTypography>
                    <ArgonTypography
                      variant="h6"
                      color={totalHarga !== 0 ? "text" : "error"}
                      fontSize={15}
                    >
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
        <ArgonBox py={3}>
          <Card sx={{ height: "100%" }}>
            <ArgonBox mx={5} my={5}>
              <ArgonTypography variant="h5" color="warning" fontWeight="medium" mb={3}>
                Profile Pengguna
              </ArgonTypography>
              <ArgonBox
                display="flex"
                flexDirection="row"
                alignItems="center"
                //   pb={3}
                //   sx={{
                //     borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                //       `${borderWidth[1]} solid ${borderColor}`,
                //   }}
              >
                {getDetailUserResult ? (
                  <ArgonBox
                    component="img"
                    src={`data:image/png;base64, ${getDetailUserResult.photo}`}
                    alt="gambar"
                    width={200}
                    sx={{ borderRadius: 40 }}
                  />
                ) : (
                  <ArgonBox
                    width={200}
                    sx={{ borderRadius: 40 }}
                    variant="contained"
                    color="dark"
                  />
                )}
                <ArgonBox ml={3}>
                  <ArgonTypography variant="h3">
                    {getDetailUserResult ? getDetailUserResult.fullName : "-"}
                  </ArgonTypography>

                  <ArgonTypography variant="h6" mt={1} color="text" fontSize={15}>
                    Informasi Detail
                  </ArgonTypography>
                  <ArgonBox display="flex" flexDirection="row" alignItems="center" mt={1}>
                    <ArgonBox>
                      <ArgonTypography variant="h6" fontSize={15}>
                        Username
                      </ArgonTypography>
                      <ArgonTypography variant="h6" fontSize={15}>
                        Profession
                      </ArgonTypography>
                      <ArgonTypography variant="h6" fontSize={15}>
                        Email
                      </ArgonTypography>
                      <ArgonTypography variant="h6" fontSize={15}>
                        No. Handphone
                      </ArgonTypography>
                      <ArgonTypography variant="h6" fontSize={15}>
                        Alamat
                      </ArgonTypography>
                      <ArgonTypography variant="h6" fontSize={15}>
                        User ID
                      </ArgonTypography>
                    </ArgonBox>
                    <ArgonBox ml={4}>
                      <ArgonTypography variant="h6" fontSize={15}>
                        : {getDetailUserResult ? getDetailUserResult.username : ""}
                      </ArgonTypography>
                      <ArgonTypography variant="h6" fontSize={15}>
                        : {getDetailUserResult ? getDetailUserResult.profession : ""}
                      </ArgonTypography>
                      <ArgonTypography variant="h6" fontSize={15}>
                        : {getDetailUserResult ? getDetailUserResult.email : ""}
                      </ArgonTypography>
                      <ArgonTypography variant="h6" fontSize={15}>
                        : {getDetailUserResult ? getDetailUserResult.noHp : ""}
                      </ArgonTypography>
                      <ArgonTypography variant="h6" fontSize={15}>
                        : {getDetailUserResult ? getDetailUserResult.address : ""}
                      </ArgonTypography>
                      <ArgonTypography variant="h6" fontSize={15}>
                        : {getDetailUserResult ? getDetailUserResult.uid : ""}
                      </ArgonTypography>
                    </ArgonBox>
                  </ArgonBox>
                </ArgonBox>
              </ArgonBox>

              <ArgonTypography variant="h6" my={3} color="text">
                Semua Transaksi
              </ArgonTypography>

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
                  rows={
                    getListTransactionUserResult
                      ? Object.keys(getListTransactionUserResult).map((item, index) => {
                          const dataOrder = getListTransactionUserResult[item];
                          const order_id = getListTransactionUserResult[item].order_id;
                          const nama = getListTransactionUserResult[item].nama;
                          const totalHarga = getListTransactionUserResult[item].totalHarga;
                          const status = getListTransactionUserResult[item].status;
                          const tanggalOrder = getListTransactionUserResult[item].tanggalOrder;
                          const waktuOrder = getListTransactionUserResult[item].waktuOrder;
                          const uid = getListTransactionUserResult[item].user;

                          return {
                            no: <Item value={index + 1} />,
                            invoice: [order_id],
                            name: (
                              <Users value={nama} hariLibur={totalHarga === 0 ? true : false} />
                            ),
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
                                    onClick={() => this.deleteItemKeranjang(order_id, uid)}
                                  >
                                    <Icon color="inherit">delete</Icon>
                                  </ArgonButton>
                                </ArgonBox>
                              </ArgonBox>
                            ), // Assuming you have a variable for 'aksi' button
                          };
                        })
                      : []
                  }
                />
              </ArgonBox>
            </ArgonBox>
          </Card>
        </ArgonBox>
        <Footer />
      </DashboardLayout>
    );
  }
}
const mapStateToProps = (state) => ({
  getDetailUserResult: state.UserReducer.getDetailUserResult,

  getListTransactionUserResult: state.TransactionReducer.getListTransactionUserResult,

  deletePesananResult: state.PesananReducer.deletePesananResult,
});

export default checkAuthentication(Params(connect(mapStateToProps, null)(User)));
