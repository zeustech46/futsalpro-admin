import React, { Component } from "react";
import { connect } from "react-redux";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import { cancelPesanan } from "action/PesananAction";
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Lottie from "lottie-react";
import AnimationError from "assets/images/animation-error.json";
import LogoFutsalPro from "assets/images/logo-futsalpro.png";

class Error extends Component {
  toHistory() {
    window.ReactNativeWebView.postMessage("Selesai");
  }

  render() {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    const order_id = params.get("order_id");

    this.props.dispatch(cancelPesanan(order_id));

    return (
      <Grid container justifyContent="center" height="100vh">
        <Grid item>
          <Box
            sx={{
              textAlign: "center",
              alignItems: "center",
              borderRadius: 15,
              paddingTop: 10,
              paddingBottom: 10,
              borderRadius: 10,
            }}
            display="flex"
            flexDirection="column"
          >
            <ArgonBox component="img" src={LogoFutsalPro} alt="gambar" width={200} mb={1} />

            <ArgonBox width={230}>
              <Lottie animationData={AnimationError} loop={false} />
            </ArgonBox>

            <ArgonTypography fontSize={24} mt={1}>
              Pembayaran Gagal
            </ArgonTypography>

            <ArgonBox bgColor="#dee2e6" py={1} px={2} sx={{ borderRadius: 20 }} color="dark" mt={1}>
              <ArgonTypography color="dark" fontSize={18}>
                Order ID : FSL-01291329328
              </ArgonTypography>
            </ArgonBox>

            <ArgonBox display="flex" flexDirection="row">
              <ArgonTypography fontSize={17} mt={2}>
                Status Pembayaran :
              </ArgonTypography>
              <ArgonTypography
                sx={{ textTransform: "uppercase" }}
                fontSize={17}
                fontWeight="bold"
                mt={2}
                ml={0.5}
                color="error"
              >
                GAGAL
              </ArgonTypography>
            </ArgonBox>

            <ArgonBox
              display="flex"
              flexDirection="row"
              bgColor="primary"
              alignItems="center"
              mt={7}
              py={1}
              px={2}
              color="white"
              onClick={() => this.toHistory()}
              sx={{ cursor: "pointer", borderRadius: 4 }}
            >
              <ArgonTypography color="white" fontSize={23} px={8}>
                Lanjutkan
              </ArgonTypography>
              <Icon>arrow_forward_icon</Icon>
            </ArgonBox>
          </Box>
        </Grid>
      </Grid>
    );
  }
}
export default connect()(Error);
