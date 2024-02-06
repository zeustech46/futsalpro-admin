// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import React, { Component } from "react";
import Checkbox from "@mui/material/Checkbox";
import { Link, useLocation } from "react-router-dom";
import { getListKeranjang } from "../../../../action/KeranjangAction";
import { checkSchedule } from "../../../../action/PesananAction";
import CardKeranjang from "../CardKeranjang/index";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

// Billing page components
import ListToday from "layouts/billing/components/ListToday";
import ArgonButton from "components/ArgonButton";
import { formatDate } from "../../../../utils/formatDate/index";
import { connect } from "react-redux";
import { numberWithCommas } from "../../../../utils/numberFormat/index";
import ArgonInput from "components/ArgonInput";
import { updatePesanan } from "../../../../action/PesananAction";
import Swal from "sweetalert2";

class KeranjangLapangan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: new Date().toLocaleDateString("en-CA"),
      dataSchedule: [],
      hariLibur: false,
      deskripsi: "",
      user: JSON.parse(window.localStorage.getItem("user")),
    };
  }
  componentDidMount() {
    const { user } = this.state;
    this.props.dispatch(getListKeranjang(user.uid));
  }

  componentDidUpdate(prevProps) {
    const { user } = this.state;
    const { checkScheduleResult, deleteKeranjangResult, updatePesananResult } = this.props;

    if (checkScheduleResult && prevProps.checkScheduleResult !== checkScheduleResult) {
      this.setState({
        dataSchedule: checkScheduleResult,
      });
    }
    if (deleteKeranjangResult && prevProps.deleteKeranjangResult !== deleteKeranjangResult) {
      this.props.dispatch(getListKeranjang(user.uid));
    }
    if (updatePesananResult && prevProps.updatePesananResult !== updatePesananResult) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Pesan Lapangan Berhasil",
        showConfirmButton: false,
        timer: 1500,
      });

      this.props.dispatch(getListKeranjang(user.uid));
    }
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  onSubmit() {
    const { deskripsi, hariLibur, user } = this.state;

    if (deskripsi.length !== 0) {
      const order_id_user = hariLibur
        ? `ADMIN-${new Date().getTime()}`
        : `FSL-${new Date().getTime()}`;
      const order_id = `${order_id_user}-${user.uid}`;

      const data = {
        uid: user.uid,
        order_id_user: order_id_user,
        order_id: order_id,
        deskripsi: deskripsi,
      };

      this.props.dispatch(updatePesanan(data, hariLibur));
    } else {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Harap mengisi deskripsi",
        showConfirmButton: false,
        confirmButtonColor: "#33b4b7",
        timer: 2000,
      });
    }

    this.setState({
      deskripsi: "",
    });
  }

  render() {
    const { date, dataSchedule, hariLibur, deskripsi } = this.state;
    const { listFieldsResult, checkScheduleResult, listKeranjangResult } = this.props;

    return (
      <Card sx={{ height: "100%" }}>
        <ArgonBox
          sx={{
            borderBottom: ({ borders: { borderWidth, borderColor } }) =>
              `${borderWidth[1]} solid ${borderColor}`,
          }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          pt={4}
          pb={3}
          mx={3}
        >
          <ArgonBox
            ml={2}
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
          >
            <Icon color="inherit" fontSize="medium">
              shopping_cart
            </Icon>
            <ArgonTypography fontWeight="bold" textTransform="capitalize" fontSize={25} ml={2}>
              Keranjang
            </ArgonTypography>
          </ArgonBox>
        </ArgonBox>

        <ArgonBox display="flex" flexDirection="column" height="100%" mx={3}>
          {listKeranjangResult
            ? Object.keys(listKeranjangResult.pesanans).map((key, index) => {
                return (
                  <CardKeranjang
                    keranjang={listKeranjangResult.pesanans[key]}
                    keranjangUtama={listKeranjangResult}
                    tanggal={key}
                    key={index}
                    navigation={navigation}
                    hariLibur={hariLibur}
                    deleteButton
                  />
                );
              })
            : []}
        </ArgonBox>

        <ArgonBox mx={4} pt={5}>
          <ArgonTypography variant="body2" color="text" fontWeight="medium" fontSize={15} mb={1}>
            Deskripsi
          </ArgonTypography>
          <ArgonInput
            name="deskripsi"
            type="text"
            value={deskripsi}
            onChange={(value) => this.handleInputChange(value)}
            placeholder="Masukkan nama pengguna / deskripsi hari libur"
            size="large"
          />
          <ArgonBox display="flex" flexDirection="row" alignItems="center" mt={1}>
            <Checkbox
              checked={hariLibur}
              onChange={() => this.setState({ hariLibur: !hariLibur })}
            />
            <ArgonTypography variant="body2" color="text" fontWeight="medium" fontSize={15}>
              Jadwal Libur
            </ArgonTypography>
          </ArgonBox>
        </ArgonBox>

        <ArgonBox
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          mx={4}
          pb={4}
          pt={4}
        >
          <ArgonBox display="flex" flexDirection="column">
            <ArgonTypography variant="body2" color="text" fontWeight="medium">
              Total Harga
            </ArgonTypography>
            <ArgonTypography variant="body2" color="warning" fontWeight="bold" fontSize={22}>
              {hariLibur
                ? "Rp. -"
                : listKeranjangResult
                ? "Rp. " + numberWithCommas(listKeranjangResult.totalHarga)
                : "Rp. -"}
            </ArgonTypography>
          </ArgonBox>

          <ArgonButton
            color="warning"
            variant="gradient"
            size="large"
            onClick={() => this.onSubmit()}
          >
            {hariLibur ? (
              <ArgonTypography variant="button" color="white">
                Tetapkan Jadwal Libur
              </ArgonTypography>
            ) : (
              <>
                <Icon>shopping_cart</Icon>
                <ArgonTypography variant="button" color="white" pl={2}>
                  Checkout
                </ArgonTypography>
              </>
            )}
          </ArgonButton>
        </ArgonBox>
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  listFieldsResult: state.FieldReducer.listFieldsResult,
  listFieldsLoading: state.FieldReducer.listFieldsLoading,

  checkScheduleResult: state.PesananReducer.checkScheduleResult,
  checkScheduleLoading: state.PesananReducer.checkScheduleLoading,

  listKeranjangLoading: state.KeranjangReducer.listKeranjangLoading,
  listKeranjangResult: state.KeranjangReducer.listKeranjangResult,

  deleteKeranjangLoading: state.KeranjangReducer.deleteKeranjangLoading,
  deleteKeranjangResult: state.KeranjangReducer.deleteKeranjangResult,

  updatePesananResult: state.PesananReducer.updatePesananResult,
  updatePesananLoading: state.PesananReducer.updatePesananLoading,
});

export default connect(mapStateToProps, null)(KeranjangLapangan);
